# Инструкция по публикации приложения

## Вариант 1: GitHub Pages (Рекомендуется)

### Автоматическая публикация через GitHub Actions

1. **Активируйте GitHub Pages:**
   - Перейдите в репозиторий на GitHub: https://github.com/batrosa/Project
   - Откройте Settings → Pages
   - В разделе "Source" выберите "GitHub Actions"

2. **После активации:**
   - Workflow автоматически запустится и опубликует приложение
   - Приложение будет доступно по адресу: **https://batrosa.github.io/Project/**
   - При каждом push в ветку `claude/clinic-finder-app-01KBm9d7VoMpDZSS3EsX71Aa` приложение будет автоматически обновляться

### Ручная публикация

Если вы хотите опубликовать в ветку gh-pages вручную:

```bash
# Переключитесь на вашу рабочую ветку
git checkout claude/clinic-finder-app-01KBm9d7VoMpDZSS3EsX71Aa

# Создайте ветку gh-pages
git checkout --orphan gh-pages

# Добавьте только необходимые файлы
git add index.html clinic-finder.js README.md .nojekyll
git commit -m "Deploy to GitHub Pages"

# Отправьте на GitHub
git push origin gh-pages -f

# Вернитесь на рабочую ветку
git checkout claude/clinic-finder-app-01KBm9d7VoMpDZSS3EsX71Aa
```

## Вариант 2: Netlify

1. Зарегистрируйтесь на https://netlify.com
2. Нажмите "Add new site" → "Import an existing project"
3. Подключите GitHub репозиторий
4. Выберите ветку `claude/clinic-finder-app-01KBm9d7VoMpDZSS3EsX71Aa`
5. Build settings оставьте пустыми (статический сайт)
6. Deploy!

Netlify автоматически создаст URL вида: `https://your-site-name.netlify.app`

## Вариант 3: Vercel

1. Зарегистрируйтесь на https://vercel.com
2. Нажмите "Add New" → "Project"
3. Импортируйте GitHub репозиторий
4. Выберите ветку `claude/clinic-finder-app-01KBm9d7VoMpDZSS3EsX71Aa`
5. Framework Preset: Other
6. Deploy!

Vercel создаст URL вида: `https://your-project.vercel.app`

## Вариант 4: Локальный запуск

Просто откройте файл `index.html` в браузере:

```bash
# Linux/Mac
open index.html

# Windows
start index.html

# Или используйте простой HTTP сервер
python3 -m http.server 8000
# Затем откройте http://localhost:8000
```

## После публикации

После успешной публикации ваше приложение будет доступно по одному из указанных URL.

Поделитесь ссылкой с пользователями для доступа к приложению поиска клиник Краснодара!
