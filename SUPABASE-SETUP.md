# Инструкция по настройке Supabase для Digital Truth

## Шаг 1: Создание проекта в Supabase

1. Перейдите на [https://app.supabase.com](https://app.supabase.com)
2. Войдите или зарегистрируйтесь
3. Нажмите "New Project"
4. Заполните:
   - **Name**: `digital-truth` (или любое другое имя)
   - **Database Password**: создайте надежный пароль (сохраните его!)
   - **Region**: выберите ближайший регион
5. Нажмите "Create new project" и дождитесь создания (1-2 минуты)

## Шаг 2: Создание таблиц

1. В Supabase Dashboard перейдите в **SQL Editor** (иконка в левом меню)
2. Откройте файл `supabase-schema.sql` из этого проекта
3. Скопируйте весь SQL код
4. Вставьте в SQL Editor в Supabase
5. Нажмите **Run** (или F5)
6. Должно появиться сообщение "Success. No rows returned"

## Шаг 3: Получение ключей API

1. В Supabase Dashboard перейдите в **Settings** → **API**
2. Найдите следующие значения:
   - **Project URL** (например: `https://xxxxx.supabase.co`)
   - **anon public** key (длинная строка под "Project API keys")

## Шаг 4: Настройка в коде

1. Откройте файл `digital-truth.html`
2. Найдите строки (примерно строка 574-575):
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```
3. Замените на ваши реальные значения:
   ```javascript
   const SUPABASE_URL = 'https://xxxxx.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
   ```

## Шаг 5: Проверка работы

1. Откройте `digital-truth.html` в браузере
2. Заполните форму онбординга
3. Завершите онбординг
4. Откройте консоль браузера (F12 → Console)
5. Должны увидеть успешные запросы к Supabase (без ошибок)

## Структура данных

### Таблица `agents`
Хранит данные онбординга:
- `callsign` - позывной агента
- `gender` - пол
- `age` - возрастная группа
- `region` - регион
- `completed_at` - дата завершения онбординга

### Таблица `game_sessions`
Хранит активные игровые сессии:
- `agent_id` - ссылка на агента
- `reputation` - текущая репутация
- `cases_played` - массив дел в этой сессии
- `answers` - ответы игрока

### Таблица `game_results`
Хранит результаты завершенных игр:
- `agent_id` - ссылка на агента
- `final_reputation` - итоговая репутация
- `rank` - полученный ранг
- `accuracy_ratio` - точность (0.0 - 1.0)

### Таблица `case_answers`
Хранит ответы на отдельные дела:
- `agent_id` - ссылка на агента
- `case_tag` - тег дела
- `evidence_answers` - ответы на доказательства
- `choice_made` - сделанный выбор
- `points_earned` - заработанные очки

## Безопасность

- Используется **Row Level Security (RLS)** для защиты данных
- Политики настроены так, что любой может вставлять и читать данные (для публичного приложения)
- Если нужна авторизация, можно добавить аутентификацию Supabase Auth

## Fallback на localStorage

Если Supabase не настроен или недоступен, приложение автоматически использует `localStorage` как резервный вариант. Это позволяет приложению работать даже без подключения к базе данных.

## Полезные SQL запросы

### Статистика по агентам
```sql
SELECT 
    COUNT(*) as total_agents,
    COUNT(DISTINCT region) as unique_regions
FROM agents;
```

### Топ игроков
```sql
SELECT 
    a.callsign,
    gr.final_reputation,
    gr.rank
FROM game_results gr
JOIN agents a ON gr.agent_id = a.id
ORDER BY gr.final_reputation DESC
LIMIT 10;
```

### Статистика по делам
```sql
SELECT 
    case_tag,
    COUNT(*) as total_answers,
    AVG(points_earned) as avg_points
FROM case_answers
GROUP BY case_tag;
```

## Устранение проблем

### Ошибка: "relation does not exist"
- Убедитесь, что выполнили SQL скрипт из `supabase-schema.sql`
- Проверьте, что вы в правильном проекте Supabase

### Ошибка: "new row violates row-level security policy"
- Проверьте, что RLS политики созданы правильно
- В SQL Editor выполните: `SELECT * FROM agents LIMIT 1;` для проверки

### Данные не сохраняются
- Откройте консоль браузера (F12)
- Проверьте ошибки в Console
- Убедитесь, что URL и ANON_KEY указаны правильно
- Проверьте Network tab на наличие запросов к Supabase

## Дополнительная информация

- [Документация Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

