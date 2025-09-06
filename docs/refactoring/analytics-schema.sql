-- Claude Code UI Analytics Schema for Supabase PostgreSQL
-- Схема аналитики для мониторинга производительности и использования

-- ============================================================================
-- ПОЛЬЗОВАТЕЛИ И СЕССИИ
-- ============================================================================

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    preferences JSONB DEFAULT '{}',
    
    -- Индексы
    CONSTRAINT users_username_check CHECK (length(username) >= 3),
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Таблица пользовательских сессий (веб-сессии)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- ============================================================================
-- ПРОЕКТЫ И CLI СЕССИИ
-- ============================================================================

-- Таблица проектов
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    path TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('claude', 'cursor', 'codegen')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    config JSONB DEFAULT '{}',
    
    -- Составной индекс для быстрого поиска проектов пользователя
    UNIQUE(user_id, name)
);

-- Таблица CLI сессий (чат/терминал сессии)
CREATE TABLE IF NOT EXISTS cli_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    type VARCHAR(50) NOT NULL CHECK (type IN ('chat', 'terminal')),
    cli_type VARCHAR(50) NOT NULL CHECK (cli_type IN ('claude', 'cursor', 'codegen')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'aborted', 'error')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    config JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}'
);

-- ============================================================================
-- СООБЩЕНИЯ И ВЗАИМОДЕЙСТВИЯ
-- ============================================================================

-- Таблица сообщений в CLI сессиях
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES cli_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('user', 'assistant', 'system', 'error')),
    content TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Индекс для быстрого поиска сообщений по сессии
    INDEX idx_messages_session_created (session_id, created_at DESC)
);

-- Таблица для отслеживания использования токенов
CREATE TABLE IF NOT EXISTS token_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    session_id UUID REFERENCES cli_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    cli_type VARCHAR(50) NOT NULL,
    model VARCHAR(100),
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER GENERATED ALWAYS AS (input_tokens + output_tokens) STORED,
    cost_usd DECIMAL(10, 6) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ФАЙЛОВЫЕ ОПЕРАЦИИ
-- ============================================================================

-- Таблица файловых операций
CREATE TABLE IF NOT EXISTS file_operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES cli_sessions(id) ON DELETE SET NULL,
    operation_type VARCHAR(50) NOT NULL CHECK (operation_type IN ('create', 'read', 'update', 'delete', 'rename', 'move')),
    file_path TEXT NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(100),
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    duration_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ПРОИЗВОДИТЕЛЬНОСТЬ И МЕТРИКИ
-- ============================================================================

-- Таблица метрик производительности
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES cli_sessions(id) ON DELETE SET NULL,
    metric_type VARCHAR(100) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    value DECIMAL(15, 6) NOT NULL,
    unit VARCHAR(50),
    tags JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Индекс для быстрого поиска метрик
    INDEX idx_performance_metrics_type_name_created (metric_type, metric_name, created_at DESC)
);

-- Таблица ошибок и исключений
CREATE TABLE IF NOT EXISTS error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES cli_sessions(id) ON DELETE SET NULL,
    error_type VARCHAR(100) NOT NULL,
    error_code VARCHAR(50),
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    context JSONB DEFAULT '{}',
    severity VARCHAR(20) DEFAULT 'error' CHECK (severity IN ('debug', 'info', 'warn', 'error', 'fatal')),
    resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- СОБЫТИЯ И АКТИВНОСТЬ
-- ============================================================================

-- Таблица событий пользовательской активности
CREATE TABLE IF NOT EXISTS user_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES cli_sessions(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    properties JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Индекс для аналитики событий
    INDEX idx_user_events_type_name_created (event_type, event_name, created_at DESC),
    INDEX idx_user_events_user_created (user_id, created_at DESC)
);

-- Таблица системных событий
CREATE TABLE IF NOT EXISTS system_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('debug', 'info', 'warn', 'error', 'fatal')),
    message TEXT,
    properties JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- АГРЕГИРОВАННАЯ АНАЛИТИКА
-- ============================================================================

-- Таблица дневной статистики пользователей
CREATE TABLE IF NOT EXISTS daily_user_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    sessions_count INTEGER DEFAULT 0,
    messages_count INTEGER DEFAULT 0,
    tokens_used INTEGER DEFAULT 0,
    files_modified INTEGER DEFAULT 0,
    active_time_minutes INTEGER DEFAULT 0,
    errors_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Уникальность по пользователю и дате
    UNIQUE(user_id, date)
);

-- Таблица дневной статистики проектов
CREATE TABLE IF NOT EXISTS daily_project_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    sessions_count INTEGER DEFAULT 0,
    messages_count INTEGER DEFAULT 0,
    active_users_count INTEGER DEFAULT 0,
    files_modified INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Уникальность по проекту и дате
    UNIQUE(project_id, date)
);

-- Таблица общей системной статистики
CREATE TABLE IF NOT EXISTS daily_system_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    total_users INTEGER DEFAULT 0,
    active_users INTEGER DEFAULT 0,
    new_users INTEGER DEFAULT 0,
    total_projects INTEGER DEFAULT 0,
    active_projects INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    total_errors INTEGER DEFAULT 0,
    avg_response_time_ms DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ИНДЕКСЫ ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ
-- ============================================================================

-- Индексы для пользователей
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login DESC);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active, created_at DESC);

-- Индексы для проектов
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(type);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_last_activity ON projects(last_activity DESC);

-- Индексы для CLI сессий
CREATE INDEX IF NOT EXISTS idx_cli_sessions_project_id ON cli_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_cli_sessions_user_id ON cli_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_cli_sessions_type ON cli_sessions(type);
CREATE INDEX IF NOT EXISTS idx_cli_sessions_cli_type ON cli_sessions(cli_type);
CREATE INDEX IF NOT EXISTS idx_cli_sessions_status ON cli_sessions(status);
CREATE INDEX IF NOT EXISTS idx_cli_sessions_created_at ON cli_sessions(created_at DESC);

-- Индексы для сообщений
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(type);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Индексы для использования токенов
CREATE INDEX IF NOT EXISTS idx_token_usage_user_id ON token_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_token_usage_cli_type ON token_usage(cli_type);
CREATE INDEX IF NOT EXISTS idx_token_usage_created_at ON token_usage(created_at DESC);

-- Индексы для файловых операций
CREATE INDEX IF NOT EXISTS idx_file_operations_project_id ON file_operations(project_id);
CREATE INDEX IF NOT EXISTS idx_file_operations_user_id ON file_operations(user_id);
CREATE INDEX IF NOT EXISTS idx_file_operations_type ON file_operations(operation_type);
CREATE INDEX IF NOT EXISTS idx_file_operations_created_at ON file_operations(created_at DESC);

-- ============================================================================
-- ФУНКЦИИ ДЛЯ АНАЛИТИКИ
-- ============================================================================

-- Функция для обновления времени последней активности
CREATE OR REPLACE FUNCTION update_last_activity()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для автоматического обновления времени
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_last_activity();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_last_activity();

-- Функция для подсчета активных пользователей за период
CREATE OR REPLACE FUNCTION get_active_users_count(
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE
)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(DISTINCT user_id)
        FROM user_events
        WHERE created_at BETWEEN start_date AND end_date
    );
END;
$$ LANGUAGE plpgsql;

-- Функция для получения топ CLI инструментов
CREATE OR REPLACE FUNCTION get_top_cli_tools(
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TABLE(cli_type VARCHAR, sessions_count BIGINT, messages_count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cs.cli_type,
        COUNT(DISTINCT cs.id) as sessions_count,
        COUNT(m.id) as messages_count
    FROM cli_sessions cs
    LEFT JOIN messages m ON cs.id = m.session_id
    WHERE cs.created_at BETWEEN start_date AND end_date
    GROUP BY cs.cli_type
    ORDER BY sessions_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Функция для получения статистики использования токенов
CREATE OR REPLACE FUNCTION get_token_usage_stats(
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TABLE(
    cli_type VARCHAR,
    total_tokens BIGINT,
    avg_tokens_per_message DECIMAL,
    total_cost_usd DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tu.cli_type,
        SUM(tu.total_tokens) as total_tokens,
        AVG(tu.total_tokens) as avg_tokens_per_message,
        SUM(tu.cost_usd) as total_cost_usd
    FROM token_usage tu
    WHERE tu.created_at BETWEEN start_date AND end_date
    GROUP BY tu.cli_type
    ORDER BY total_tokens DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ПРЕДСТАВЛЕНИЯ ДЛЯ АНАЛИТИКИ
-- ============================================================================

-- Представление активных пользователей
CREATE OR REPLACE VIEW active_users_today AS
SELECT DISTINCT u.id, u.username, u.email
FROM users u
JOIN user_events ue ON u.id = ue.user_id
WHERE ue.created_at >= CURRENT_DATE;

-- Представление статистики проектов
CREATE OR REPLACE VIEW project_stats AS
SELECT 
    p.id,
    p.name,
    p.type,
    COUNT(DISTINCT cs.id) as sessions_count,
    COUNT(DISTINCT m.id) as messages_count,
    COUNT(DISTINCT fo.id) as file_operations_count,
    MAX(cs.last_activity) as last_activity
FROM projects p
LEFT JOIN cli_sessions cs ON p.id = cs.project_id
LEFT JOIN messages m ON cs.id = m.session_id
LEFT JOIN file_operations fo ON p.id = fo.project_id
GROUP BY p.id, p.name, p.type;

-- Представление ошибок по типам
CREATE OR REPLACE VIEW error_summary AS
SELECT 
    error_type,
    COUNT(*) as error_count,
    COUNT(CASE WHEN severity = 'fatal' THEN 1 END) as fatal_count,
    COUNT(CASE WHEN severity = 'error' THEN 1 END) as error_count_only,
    COUNT(CASE WHEN resolved = false THEN 1 END) as unresolved_count,
    MAX(created_at) as last_occurrence
FROM error_logs
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY error_type
ORDER BY error_count DESC;

-- ============================================================================
-- ПОЛИТИКИ БЕЗОПАСНОСТИ (RLS)
-- ============================================================================

-- Включение Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE cli_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Политика для пользователей (пользователи видят только свои данные)
CREATE POLICY users_policy ON users
    FOR ALL
    USING (auth.uid() = id);

-- Политика для проектов
CREATE POLICY projects_policy ON projects
    FOR ALL
    USING (auth.uid() = user_id);

-- Политика для CLI сессий
CREATE POLICY cli_sessions_policy ON cli_sessions
    FOR ALL
    USING (auth.uid() = user_id);

-- Политика для сообщений
CREATE POLICY messages_policy ON messages
    FOR ALL
    USING (auth.uid() = user_id);

-- ============================================================================
-- КОММЕНТАРИИ К ТАБЛИЦАМ
-- ============================================================================

COMMENT ON TABLE users IS 'Пользователи системы Claude Code UI';
COMMENT ON TABLE projects IS 'Проекты пользователей с различными CLI инструментами';
COMMENT ON TABLE cli_sessions IS 'Сессии взаимодействия с CLI (чат или терминал)';
COMMENT ON TABLE messages IS 'Сообщения в рамках CLI сессий';
COMMENT ON TABLE token_usage IS 'Отслеживание использования токенов для биллинга и аналитики';
COMMENT ON TABLE file_operations IS 'Операции с файлами в проектах';
COMMENT ON TABLE performance_metrics IS 'Метрики производительности системы';
COMMENT ON TABLE error_logs IS 'Логи ошибок и исключений';
COMMENT ON TABLE user_events IS 'События пользовательской активности';
COMMENT ON TABLE system_events IS 'Системные события и логи';
COMMENT ON TABLE daily_user_stats IS 'Агрегированная дневная статистика по пользователям';
COMMENT ON TABLE daily_project_stats IS 'Агрегированная дневная статистика по проектам';
COMMENT ON TABLE daily_system_stats IS 'Общая системная статистика по дням';

-- ============================================================================
-- ПРИМЕРЫ ЗАПРОСОВ ДЛЯ АНАЛИТИКИ
-- ============================================================================

/*
-- Топ 10 самых активных пользователей за последние 30 дней
SELECT 
    u.username,
    COUNT(DISTINCT cs.id) as sessions_count,
    COUNT(m.id) as messages_count,
    SUM(tu.total_tokens) as tokens_used
FROM users u
JOIN cli_sessions cs ON u.id = cs.user_id
LEFT JOIN messages m ON cs.id = m.session_id
LEFT JOIN token_usage tu ON m.id = tu.message_id
WHERE cs.created_at >= NOW() - INTERVAL '30 days'
GROUP BY u.id, u.username
ORDER BY sessions_count DESC
LIMIT 10;

-- Статистика использования CLI инструментов
SELECT 
    cli_type,
    COUNT(*) as sessions_count,
    AVG(EXTRACT(EPOCH FROM (completed_at - created_at))/60) as avg_duration_minutes
FROM cli_sessions
WHERE created_at >= NOW() - INTERVAL '7 days'
    AND completed_at IS NOT NULL
GROUP BY cli_type
ORDER BY sessions_count DESC;

-- Ошибки по дням за последнюю неделю
SELECT 
    DATE(created_at) as error_date,
    COUNT(*) as error_count,
    COUNT(DISTINCT user_id) as affected_users
FROM error_logs
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY error_date DESC;

-- Производительность ответов по CLI типам
SELECT 
    tu.cli_type,
    AVG(pm.value) as avg_response_time_ms,
    COUNT(*) as requests_count
FROM token_usage tu
JOIN performance_metrics pm ON pm.session_id = tu.session_id
WHERE pm.metric_name = 'response_time'
    AND tu.created_at >= NOW() - INTERVAL '24 hours'
GROUP BY tu.cli_type
ORDER BY avg_response_time_ms ASC;
*/
