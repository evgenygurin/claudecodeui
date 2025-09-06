import { createClient } from '@supabase/supabase-js';
import { Pool } from 'pg';

/**
 * Supabase PostgreSQL Integration for lcodegen
 * Подключение к Supabase PostgreSQL базе данных
 */

class SupabaseDatabase {
  constructor() {
    this.supabase = null;
    this.pool = null;
    this.initialized = false;
  }

  /**
   * Инициализация подключения к Supabase
   */
  async initialize() {
    try {
      // Проверяем наличие необходимых переменных окружения
      if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
        throw new Error('SUPABASE_URL и SUPABASE_ANON_KEY должны быть установлены в переменных окружения');
      }

      // Инициализация Supabase клиента
      this.supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY,
        {
          auth: {
            autoRefreshToken: true,
            persistSession: true
          },
          db: {
            schema: 'public'
          }
        }
      );

      // Инициализация PostgreSQL пула соединений
      if (process.env.DATABASE_URL) {
        this.pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: {
            rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'
          },
          max: parseInt(process.env.DB_POOL_MAX) || 10,
          min: parseInt(process.env.DB_POOL_MIN) || 2,
          idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT) || 30000,
          connectionTimeoutMillis: parseInt(process.env.DB_POOL_CONNECTION_TIMEOUT) || 2000,
        });

        // Тестируем подключение
        await this.testConnection();
      }

      this.initialized = true;
      console.log('✅ Supabase PostgreSQL подключение инициализировано');
    } catch (error) {
      console.error('❌ Ошибка инициализации Supabase:', error);
      throw error;
    }
  }

  /**
   * Тестирование подключения к базе данных
   */
  async testConnection() {
    try {
      if (this.pool) {
        const client = await this.pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        console.log('✅ PostgreSQL подключение успешно:', result.rows[0]);
      }

      if (this.supabase) {
        const { data, error } = await this.supabase
          .from('_supabase_migrations')
          .select('version')
          .limit(1);
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = table not found (это нормально)
          throw error;
        }
        console.log('✅ Supabase клиент подключен успешно');
      }
    } catch (error) {
      console.error('❌ Ошибка тестирования подключения:', error);
      throw error;
    }
  }

  /**
   * Получение Supabase клиента
   */
  getSupabaseClient() {
    if (!this.initialized) {
      throw new Error('Supabase не инициализирован. Вызовите initialize() сначала.');
    }
    return this.supabase;
  }

  /**
   * Получение PostgreSQL пула соединений
   */
  getPool() {
    if (!this.initialized) {
      throw new Error('Supabase не инициализирован. Вызовите initialize() сначала.');
    }
    return this.pool;
  }

  /**
   * Выполнение SQL запроса через пул соединений
   */
  async query(text, params = []) {
    if (!this.pool) {
      throw new Error('PostgreSQL пул не инициализирован');
    }

    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('📊 SQL запрос выполнен:', { text, duration, rows: result.rowCount });
      return result;
    } catch (error) {
      console.error('❌ Ошибка SQL запроса:', { text, error: error.message });
      throw error;
    }
  }

  /**
   * Получение клиента из пула для транзакций
   */
  async getClient() {
    if (!this.pool) {
      throw new Error('PostgreSQL пул не инициализирован');
    }
    return await this.pool.connect();
  }

  /**
   * Создание таблицы для lcodegen сессий
   */
  async createCodegenTables() {
    try {
      const createSessionsTable = `
        CREATE TABLE IF NOT EXISTS codegen_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          session_id VARCHAR(255) UNIQUE NOT NULL,
          project_path TEXT,
          command TEXT,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          metadata JSONB DEFAULT '{}'::jsonb
        );
      `;

      const createMessagesTable = `
        CREATE TABLE IF NOT EXISTS codegen_messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          session_id VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL,
          content TEXT NOT NULL,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          metadata JSONB DEFAULT '{}'::jsonb,
          FOREIGN KEY (session_id) REFERENCES codegen_sessions(session_id) ON DELETE CASCADE
        );
      `;

      const createIndexes = `
        CREATE INDEX IF NOT EXISTS idx_codegen_sessions_status ON codegen_sessions(status);
        CREATE INDEX IF NOT EXISTS idx_codegen_sessions_created_at ON codegen_sessions(created_at);
        CREATE INDEX IF NOT EXISTS idx_codegen_messages_session_id ON codegen_messages(session_id);
        CREATE INDEX IF NOT EXISTS idx_codegen_messages_timestamp ON codegen_messages(timestamp);
      `;

      await this.query(createSessionsTable);
      await this.query(createMessagesTable);
      await this.query(createIndexes);

      console.log('✅ Таблицы lcodegen созданы успешно');
    } catch (error) {
      console.error('❌ Ошибка создания таблиц lcodegen:', error);
      throw error;
    }
  }

  /**
   * Сохранение сессии lcodegen
   */
  async saveCodegenSession(sessionData) {
    try {
      const { sessionId, projectPath, command, status = 'active', metadata = {} } = sessionData;
      
      const query = `
        INSERT INTO codegen_sessions (session_id, project_path, command, status, metadata)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (session_id) 
        DO UPDATE SET 
          project_path = EXCLUDED.project_path,
          command = EXCLUDED.command,
          status = EXCLUDED.status,
          metadata = EXCLUDED.metadata,
          updated_at = NOW()
        RETURNING *
      `;

      const result = await this.query(query, [sessionId, projectPath, command, status, JSON.stringify(metadata)]);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Ошибка сохранения сессии lcodegen:', error);
      throw error;
    }
  }

  /**
   * Сохранение сообщения lcodegen
   */
  async saveCodegenMessage(messageData) {
    try {
      const { sessionId, role, content, metadata = {} } = messageData;
      
      const query = `
        INSERT INTO codegen_messages (session_id, role, content, metadata)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

      const result = await this.query(query, [sessionId, role, content, JSON.stringify(metadata)]);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Ошибка сохранения сообщения lcodegen:', error);
      throw error;
    }
  }

  /**
   * Получение сессий lcodegen
   */
  async getCodegenSessions(limit = 10, offset = 0) {
    try {
      const query = `
        SELECT s.*, 
               COUNT(m.id) as message_count,
               MAX(m.timestamp) as last_message_at
        FROM codegen_sessions s
        LEFT JOIN codegen_messages m ON s.session_id = m.session_id
        GROUP BY s.id
        ORDER BY s.created_at DESC
        LIMIT $1 OFFSET $2
      `;

      const result = await this.query(query, [limit, offset]);
      return result.rows;
    } catch (error) {
      console.error('❌ Ошибка получения сессий lcodegen:', error);
      throw error;
    }
  }

  /**
   * Получение сообщений сессии
   */
  async getCodegenMessages(sessionId, limit = 50, offset = 0) {
    try {
      const query = `
        SELECT * FROM codegen_messages
        WHERE session_id = $1
        ORDER BY timestamp ASC
        LIMIT $2 OFFSET $3
      `;

      const result = await this.query(query, [sessionId, limit, offset]);
      return result.rows;
    } catch (error) {
      console.error('❌ Ошибка получения сообщений lcodegen:', error);
      throw error;
    }
  }

  /**
   * Закрытие подключений
   */
  async close() {
    try {
      if (this.pool) {
        await this.pool.end();
        console.log('✅ PostgreSQL пул соединений закрыт');
      }
      this.initialized = false;
    } catch (error) {
      console.error('❌ Ошибка закрытия подключений:', error);
    }
  }
}

// Создаем единственный экземпляр
const supabaseDB = new SupabaseDatabase();

export default supabaseDB;
