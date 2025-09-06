import express from 'express';
import supabaseDB from '../database/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * Supabase PostgreSQL Integration Routes for lcodegen
 * Маршруты для интеграции lcodegen с Supabase PostgreSQL
 */

// Инициализация Supabase подключения
router.post('/init', authenticateToken, async (req, res) => {
  try {
    await supabaseDB.initialize();
    await supabaseDB.createCodegenTables();
    
    res.json({
      success: true,
      message: 'Supabase PostgreSQL подключение инициализировано успешно',
      initialized: supabaseDB.initialized
    });
  } catch (error) {
    console.error('Ошибка инициализации Supabase:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Тестирование подключения к Supabase
router.get('/test-connection', authenticateToken, async (req, res) => {
  try {
    if (!supabaseDB.initialized) {
      await supabaseDB.initialize();
    }
    
    await supabaseDB.testConnection();
    
    res.json({
      success: true,
      message: 'Подключение к Supabase PostgreSQL успешно',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ошибка тестирования подключения:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Сохранение сессии lcodegen в Supabase
router.post('/sessions', authenticateToken, async (req, res) => {
  try {
    const { sessionId, projectPath, command, status, metadata } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID обязателен'
      });
    }
    
    const session = await supabaseDB.saveCodegenSession({
      sessionId,
      projectPath,
      command,
      status,
      metadata
    });
    
    res.json({
      success: true,
      session,
      message: 'Сессия lcodegen сохранена в Supabase'
    });
  } catch (error) {
    console.error('Ошибка сохранения сессии:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Получение сессий lcodegen из Supabase
router.get('/sessions', authenticateToken, async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    
    const sessions = await supabaseDB.getCodegenSessions(
      parseInt(limit),
      parseInt(offset)
    );
    
    res.json({
      success: true,
      sessions,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: sessions.length
      }
    });
  } catch (error) {
    console.error('Ошибка получения сессий:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Сохранение сообщения lcodegen в Supabase
router.post('/messages', authenticateToken, async (req, res) => {
  try {
    const { sessionId, role, content, metadata } = req.body;
    
    if (!sessionId || !role || !content) {
      return res.status(400).json({
        success: false,
        error: 'Session ID, role и content обязательны'
      });
    }
    
    const message = await supabaseDB.saveCodegenMessage({
      sessionId,
      role,
      content,
      metadata
    });
    
    res.json({
      success: true,
      message: message,
      messageText: 'Сообщение lcodegen сохранено в Supabase'
    });
  } catch (error) {
    console.error('Ошибка сохранения сообщения:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Получение сообщений сессии из Supabase
router.get('/sessions/:sessionId/messages', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    const messages = await supabaseDB.getCodegenMessages(
      sessionId,
      parseInt(limit),
      parseInt(offset)
    );
    
    res.json({
      success: true,
      sessionId,
      messages,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: messages.length
      }
    });
  } catch (error) {
    console.error('Ошибка получения сообщений:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Выполнение произвольного SQL запроса (только для чтения)
router.post('/query', authenticateToken, async (req, res) => {
  try {
    const { query, params = [] } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'SQL запрос обязателен'
      });
    }
    
    // Проверяем, что запрос только для чтения (SELECT)
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery.startsWith('select')) {
      return res.status(400).json({
        success: false,
        error: 'Разрешены только SELECT запросы'
      });
    }
    
    const result = await supabaseDB.query(query, params);
    
    res.json({
      success: true,
      result: {
        rows: result.rows,
        rowCount: result.rowCount,
        fields: result.fields?.map(field => ({
          name: field.name,
          dataTypeID: field.dataTypeID
        }))
      }
    });
  } catch (error) {
    console.error('Ошибка выполнения SQL запроса:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Получение статистики lcodegen сессий
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_sessions,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_sessions,
        COUNT(CASE WHEN status = 'error' THEN 1 END) as error_sessions,
        COUNT(DISTINCT project_path) as unique_projects,
        AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) as avg_session_duration_seconds
      FROM codegen_sessions
    `;
    
    const result = await supabaseDB.query(statsQuery);
    const stats = result.rows[0];
    
    // Получаем статистику по сообщениям
    const messagesStatsQuery = `
      SELECT 
        COUNT(*) as total_messages,
        COUNT(CASE WHEN role = 'user' THEN 1 END) as user_messages,
        COUNT(CASE WHEN role = 'assistant' THEN 1 END) as assistant_messages,
        COUNT(CASE WHEN role = 'system' THEN 1 END) as system_messages
      FROM codegen_messages
    `;
    
    const messagesResult = await supabaseDB.query(messagesStatsQuery);
    const messagesStats = messagesResult.rows[0];
    
    res.json({
      success: true,
      stats: {
        ...stats,
        ...messagesStats,
        generated_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Получение конфигурации Supabase
router.get('/config', authenticateToken, async (req, res) => {
  try {
    const config = {
      supabaseUrl: process.env.SUPABASE_URL ? 'настроен' : 'не настроен',
      databaseUrl: process.env.DATABASE_URL ? 'настроен' : 'не настроен',
      initialized: supabaseDB.initialized,
      poolSettings: {
        max: parseInt(process.env.DB_POOL_MAX) || 10,
        min: parseInt(process.env.DB_POOL_MIN) || 2,
        idleTimeout: parseInt(process.env.DB_POOL_IDLE_TIMEOUT) || 30000,
        connectionTimeout: parseInt(process.env.DB_POOL_CONNECTION_TIMEOUT) || 2000
      }
    };
    
    res.json({
      success: true,
      config
    });
  } catch (error) {
    console.error('Ошибка получения конфигурации:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
