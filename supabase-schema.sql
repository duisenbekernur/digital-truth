-- ============================================
-- Digital Truth: Supabase Database Schema
-- ============================================
-- 
-- Инструкция по настройке:
-- 1. Откройте Supabase Dashboard (https://app.supabase.com)
-- 2. Перейдите в SQL Editor
-- 3. Скопируйте и выполните этот скрипт
-- 4. Обновите URL и ANON_KEY в digital-truth.html
--
-- ============================================

-- Таблица: agents (данные онбординга)
CREATE TABLE IF NOT EXISTS agents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    callsign TEXT NOT NULL,
    gender TEXT NOT NULL,
    age TEXT NOT NULL,
    region TEXT NOT NULL,
    gender_other TEXT, -- если gender = 'other'
    completed_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица: game_sessions (игровые сессии)
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    reputation INTEGER DEFAULT 0,
    total_cases INTEGER DEFAULT 0,
    current_case_index INTEGER DEFAULT 0,
    answers JSONB, -- { ev: [...], choice: "..." }
    cases_played JSONB, -- массив объектов с информацией о делах
    started_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed BOOLEAN DEFAULT FALSE
);

-- Таблица: game_results (результаты завершенных игр)
CREATE TABLE IF NOT EXISTS game_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    final_reputation INTEGER NOT NULL,
    total_cases INTEGER NOT NULL,
    max_reputation INTEGER NOT NULL,
    accuracy_ratio NUMERIC(5, 4) NOT NULL, -- от 0.0000 до 1.0000
    rank TEXT NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица: case_answers (ответы на отдельные дела)
CREATE TABLE IF NOT EXISTS case_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    case_tag TEXT NOT NULL,
    case_title TEXT NOT NULL,
    case_difficulty TEXT NOT NULL,
    evidence_answers JSONB NOT NULL, -- массив ответов на доказательства [true, false, ...]
    choice_made TEXT NOT NULL,
    correct_choice TEXT NOT NULL,
    points_earned INTEGER DEFAULT 0,
    answered_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Индексы для оптимизации запросов
-- ============================================

CREATE INDEX IF NOT EXISTS idx_agents_created_at ON agents(created_at);
CREATE INDEX IF NOT EXISTS idx_game_sessions_agent_id ON game_sessions(agent_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_started_at ON game_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_game_results_agent_id ON game_results(agent_id);
CREATE INDEX IF NOT EXISTS idx_game_results_completed_at ON game_results(completed_at);
CREATE INDEX IF NOT EXISTS idx_case_answers_agent_id ON case_answers(agent_id);
CREATE INDEX IF NOT EXISTS idx_case_answers_answered_at ON case_answers(answered_at);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================
-- Включаем RLS для всех таблиц
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_answers ENABLE ROW LEVEL SECURITY;

-- Политики для agents: разрешаем всем вставлять и читать свои данные
CREATE POLICY "Anyone can insert agents" ON agents
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read agents" ON agents
    FOR SELECT USING (true);

-- Политики для game_sessions: разрешаем всем вставлять и читать
CREATE POLICY "Anyone can insert game_sessions" ON game_sessions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read game_sessions" ON game_sessions
    FOR SELECT USING (true);

-- Политики для game_results: разрешаем всем вставлять и читать
CREATE POLICY "Anyone can insert game_results" ON game_results
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read game_results" ON game_results
    FOR SELECT USING (true);

-- Политики для case_answers: разрешаем всем вставлять и читать
CREATE POLICY "Anyone can insert case_answers" ON case_answers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read case_answers" ON case_answers
    FOR SELECT USING (true);

-- ============================================
-- Функция для автоматического обновления updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_sessions_updated_at BEFORE UPDATE ON game_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Полезные запросы для анализа данных
-- ============================================

-- Статистика по агентам
-- SELECT 
--     COUNT(*) as total_agents,
--     COUNT(DISTINCT region) as unique_regions,
--     AVG(CASE WHEN age = 'under18' THEN 16
--              WHEN age = '18-25' THEN 21.5
--              WHEN age = '26-35' THEN 30.5
--              WHEN age = '36-45' THEN 40.5
--              WHEN age = '46plus' THEN 50 END) as avg_age_midpoint
-- FROM agents;

-- Топ игроков по репутации
-- SELECT 
--     a.callsign,
--     a.region,
--     gr.final_reputation,
--     gr.rank,
--     gr.completed_at
-- FROM game_results gr
-- JOIN agents a ON gr.agent_id = a.id
-- ORDER BY gr.final_reputation DESC
-- LIMIT 10;

-- Статистика по делам
-- SELECT 
--     case_tag,
--     case_difficulty,
--     COUNT(*) as total_answers,
--     AVG(points_earned) as avg_points,
--     SUM(CASE WHEN choice_made = correct_choice THEN 1 ELSE 0 END) as correct_choices
-- FROM case_answers
-- GROUP BY case_tag, case_difficulty
-- ORDER BY total_answers DESC;

