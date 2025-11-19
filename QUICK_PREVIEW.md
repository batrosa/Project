# Быстрый предварительный просмотр

## Варианты для немедленного тестирования:

### Вариант 1: Локальный запуск (самый быстрый)

Просто откройте файл `index.html` двойным кликом в браузере, или выполните:

```bash
# Для Linux/Mac
open index.html

# Для Windows
start index.html
```

Приложение работает полностью автономно и не требует сервера!

### Вариант 2: Локальный HTTP сервер

```bash
# Запустите из директории проекта
python3 -m http.server 8000

# Затем откройте в браузере:
# http://localhost:8000
```

### Вариант 3: Используйте онлайн IDE

Скопируйте содержимое `index.html` в любой из этих сервисов:

1. **CodePen** - https://codepen.io/pen/
2. **JSFiddle** - https://jsfiddle.net/
3. **CodeSandbox** - https://codesandbox.io/

### Вариант 4: GitHub Raw Content (если репозиторий публичный)

После того как репозиторий будет на настоящем GitHub:

```
https://htmlpreview.github.io/?https://github.com/batrosa/Project/blob/claude/clinic-finder-app-01KBm9d7VoMpDZSS3EsX71Aa/index.html
```

### Вариант 5: Мгновенная публикация через Surge.sh

```bash
# Установите surge
npm install -g surge

# Опубликуйте приложение
cd /home/user/Project
surge

# Surge создаст случайный URL типа:
# https://somename-1234.surge.sh
```

## Рекомендация

Самый простой и быстрый способ - просто открыть `index.html` в браузере двойным кликом!
Все зависимости подключены через CDN, поэтому приложение работает без сервера.
