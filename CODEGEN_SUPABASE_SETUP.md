# 🔗 Настройка Supabase PostgreSQL для Codegen

## ✅ Правильные настройки подключения

### 1. Основные параметры подключения

**Credential Name:** `supabase`

**Description:** `Supabase PostgreSQL Database`

**Host:** `aws-0-us-east-1.pooler.supabase.co` (Transaction Pooler для IPv4)

**Port:** `5432`

**Database Name:** `postgres`

**Username:** `postgres.akrtujqlsmhwfzycyadc` (ВАЖНО: с префиксом проекта)

**Password:** `[ваш-пароль-от-supabase]`

**SSL Mode:** `prefer`

### 2. ⚠️ Важные моменты

- **НЕ** включайте "Enable SSH Tunnel" - снимите галочку
- **НЕ** используйте Direct Connection (`db.akrtujqlsmhwfzycyadc.supabase.co`) - он работает только через IPv6
- **ИСПОЛЬЗУЙТЕ** Transaction Pooler (`aws-0-us-east-1.pooler.supabase.co`) - работает через IPv4
- **Username** должен содержать префикс проекта: `postgres.akrtujqlsmhwfzycyadc`

## 🔑 Получение пароля из Supabase

1. Зайдите в [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект
3. Перейдите в **Settings** → **Database**
4. В секции **Database Password** нажмите **"Reset database password"**
5. Скопируйте новый пароль

## 🛡️ Настройка Firewall (если потребуется)

Если Codegen попросит добавить IP адреса в whitelist:

```
34.203.69.113
3.225.104.139
54.159.17.107
54.157.127.218
54.235.83.57
```

Добавьте эти IP в **Settings** → **Database** → **Network Restrictions** в Supabase.

## 🚫 Частые ошибки и решения

### Ошибка: "PRIVATE_KEY is not a valid SSHAuthMethod"

**Решение:** Снимите галочку "Enable SSH Tunnel (Optional)"

### Ошибка: "could not translate host name"

**Решение:** Используйте Transaction Pooler вместо Direct Connection

### Ошибка: "No route to host"

**Решение:** Используйте IPv4-совместимый Transaction Pooler

## 📋 Финальные настройки

```
Credential Name: supabase
Description: Supabase PostgreSQL Database
Host: aws-0-us-east-1.pooler.supabase.co
Port: 5432
Database Name: postgres
Username: postgres.akrtujqlsmhwfzycyadc
Password: [ваш-пароль]
SSL Mode: prefer
Enable SSH Tunnel: ❌ (НЕ ВКЛЮЧАТЬ)
```

## ✅ Проверка подключения

1. Введите все данные
2. Нажмите **"Test Connection"**
3. Если успешно - нажмите **"Save"**
4. Готово! 🎉

## 🔧 Альтернативные варианты

Если Transaction Pooler не работает, попробуйте Session Pooler:

**Host:** `aws-0-us-east-1.pooler.supabase.co`
**Username:** `postgres.akrtujqlsmhwfzycyadc`

Но Transaction Pooler обычно работает лучше для большинства случаев.
