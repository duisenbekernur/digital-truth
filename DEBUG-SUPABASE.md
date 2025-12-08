# Отладка сохранения данных в Supabase

## Как проверить, что данные сохраняются

### 1. Откройте консоль браузера
- Нажмите `F12` или `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
- Перейдите на вкладку **Console**

### 2. Проверьте инициализацию Supabase
При загрузке страницы вы должны увидеть:
```
✅ Supabase клиент инициализирован: https://...
```

Если видите ошибку, проверьте:
- Правильно ли указаны `SUPABASE_URL` и `SUPABASE_ANON_KEY` в коде
- Доступен ли Supabase проект

### 3. Проверьте сохранение данных онбординга

После заполнения формы и нажатия "Активировать профиль агента" в консоли должно появиться:
```
Завершение онбординга, сохранение данных агента... {callsign: "...", gender: "...", ...}
✅ Данные агента успешно сохранены в Supabase, Agent ID: <uuid>
```

### 4. Проверьте сохранение игровой сессии

При нажатии "Начать расследование" должно появиться:
```
Начало новой игры, сохранение сессии...
Создание новой игровой сессии
Game Session ID сохранен: <uuid>
Игровая сессия успешно сохранена в Supabase: {...}
```

### 5. Проверьте сохранение ответов на дела

После каждого ответа на дело должно появиться:
```
Сохранение ответа на дело: {...}
Ответ на дело успешно сохранен в Supabase: {...}
```

### 6. Проверьте сохранение результата игры

После завершения игры должно появиться:
```
Сохранение результата игры: {...}
Результат игры успешно сохранен в Supabase: {...}
```

## Проверка данных в Supabase Dashboard

1. Откройте [Supabase Dashboard](https://app.supabase.com)
2. Выберите ваш проект
3. Перейдите в **Table Editor**
4. Проверьте таблицы:
   - **agents** - должны быть записи с данными онбординга
   - **game_sessions** - должны быть записи о начатых играх
   - **case_answers** - должны быть записи о каждом ответе на дело
   - **game_results** - должны быть записи о завершенных играх

## Частые проблемы

### Ошибка: "Agent ID not found"
**Причина:** Данные онбординга не были сохранены или `agentId` не был сохранен в localStorage.

**Решение:**
1. Проверьте, что онбординг был завершен успешно
2. Откройте консоль и проверьте наличие ошибок
3. Проверьте в Application → Local Storage, есть ли ключ `agentId`

### Ошибка: "relation does not exist"
**Причина:** Таблицы не созданы в Supabase.

**Решение:**
1. Выполните SQL скрипт из `supabase-schema.sql` в SQL Editor
2. Проверьте, что все таблицы созданы в Table Editor

### Ошибка: "new row violates row-level security policy"
**Причина:** RLS политики не настроены правильно.

**Решение:**
1. Проверьте, что RLS политики созданы (см. `supabase-schema.sql`)
2. В SQL Editor выполните:
   ```sql
   SELECT * FROM agents LIMIT 1;
   ```
   Если ошибка, значит политики не работают.

### Данные не сохраняются, но ошибок нет
**Причина:** Возможно, Supabase клиент не инициализирован.

**Решение:**
1. Проверьте консоль на наличие предупреждений
2. Убедитесь, что `SUPABASE_URL` и `SUPABASE_ANON_KEY` указаны правильно
3. Проверьте Network tab в DevTools - должны быть запросы к `*.supabase.co`

## SQL запросы для проверки данных

### Проверить всех агентов
```sql
SELECT * FROM agents ORDER BY created_at DESC;
```

### Проверить игровые сессии
```sql
SELECT * FROM game_sessions ORDER BY started_at DESC;
```

### Проверить ответы на дела
```sql
SELECT * FROM case_answers ORDER BY answered_at DESC;
```

### Проверить результаты игр
```sql
SELECT * FROM game_results ORDER BY completed_at DESC;
```

### Статистика по агентам
```sql
SELECT 
    a.callsign,
    a.region,
    COUNT(DISTINCT gr.id) as games_played,
    MAX(gr.final_reputation) as best_reputation
FROM agents a
LEFT JOIN game_results gr ON a.id = gr.agent_id
GROUP BY a.id, a.callsign, a.region
ORDER BY best_reputation DESC NULLS LAST;
```

## Включение детального логирования

Все функции уже содержат `console.log` для отладки. Если нужно больше информации, можно добавить:

```javascript
// В начале каждой функции сохранения
console.log('=== Начало сохранения ===');
console.log('Данные для сохранения:', JSON.stringify(data, null, 2));
```

## Проверка через Network tab

1. Откройте DevTools → Network
2. Отфильтруйте по `supabase`
3. При сохранении данных должны появляться POST запросы к:
   - `/rest/v1/agents`
   - `/rest/v1/game_sessions`
   - `/rest/v1/case_answers`
   - `/rest/v1/game_results`
4. Проверьте статус ответа (должен быть 201 Created)

