# CodeMentor AI Console

## Интерактивная CLI консоль для ИИ движка

Консоль позволяет напрямую взаимодействовать с ИИ-наставником и анализатором кода **без запуска основного сервера**.

## 🚀 Быстрый старт

### 1. Установить зависимости
```bash
cd ai-engine
pip install -q torch --index-url https://download.pytorch.org/whl/cpu
pip install -q transformers flask flask-cors scikit-learn redis
```

### 2. Запустить консоль
```bash
python ai_console.py
```

### 3. Взаимодействовать с ИИ

```
You: How do I write a loop in Python?
AI Tutor:
To write a loop in Python, you can use either a for loop or a while loop...

💡 Suggestions:
  • Consider using appropriate loop structures
  • Break down the problem into smaller functions

📚 Learning Resources:
  • Mastering Loops in Programming
```

## 📝 Доступные команды

### Chat Mode (по умолчанию)
Просто введите вопрос, и ИИ-наставник ответит.

#### Смена личности наставника
```
/personality <name>
/personality analytical
```

Доступные личности:
- `encouraging` - поддерживающий, позитивный
- `analytical` - логический, точный
- `creative` - инновационный, творческий
- `practical` - практичный, ориентированный на результаты

#### Установка контекста обучения
```
/context topic <topic>
/context level <level>
/context language <language>

# Примеры
/context topic arrays
/context level intermediate
/context language javascript
```

### Code Analysis Mode
```
/analyze
```

Введите код (завершите строкой `END`):
```
/analyze
Enter code analysis mode
Language: python
Paste your code (type END on a new line to finish):

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

END
```

### Управление сессией
```
/help              - Справка и доступные команды
/context           - Показать текущий контекст
/history           - История разговоров
/clear             - Очистить историю
/chat              - Переключиться в режим чата
/exit              - Выход
```

## 🎯 Примеры использования

### Пример 1: Обучение начинающего
```
You: /context level beginner
✓ skill_level set to: beginner

You: /personality encouraging
✓ Personality set to: encouraging

You: How do I start learning Python?
AI Tutor: Python is a great language to start with! Here's a learning path...
```

### Пример 2: Анализ кода
```
You: /analyze
Enter code analysis mode
Language: python
Paste your code (type END on a new line to finish):

def bubble_sort(arr):
    for i in range(len(arr)):
        for j in range(len(arr)-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

END

Code Analysis:
Suggestions:
  • Consider using more efficient sorting algorithms
  • This has O(n²) time complexity
```

### Пример 3: Продвинутый режим
```
You: /context level advanced
You: /context topic algorithms
You: /personality analytical

You: Explain the difference between DFS and BFS
AI Tutor: DFS (Depth-First Search) and BFS (Breadth-First Search) are...
```

## 🔌 Архитектура

```
ai_console.py
    ├── AIConsole (основной класс)
    ├── initialize_models() - загрузка моделей
    ├── process_command() - обработка команд
    ├── chat_with_tutor() - диалог с наставником
    ├── analyze_code() - анализ кода
    └── Formatting & Display - красивый вывод
         ├── Colors (ANSI-коды)
         ├── _print_tutor_response()
         └── _print_code_analysis()
        
models.py (AI Models)
    ├── CustomAITutor
    │   └── generate_response()
    └── CustomCodeAnalyzer
        └── analyze_with_ai()
```

## 💾 История разговоров

Вся история сохраняется в памяти сессии:

```
You: /history

Conversation History (3 items):

[1] 2025-01-10 10:30:45 - chat
    User: How do I write a loop...

[2] 2025-01-10 10:31:22 - analyze
    Language: python

[3] 2025-01-10 10:32:15 - chat
    User: What is a class...
```

## ⚙️ Требования

- Python 3.9+
- PyTorch 2.1.2 (CPU или GPU)
- Transformers 4.36.2
- 1-2 GB свободной памяти для моделей

## 🔄 Первый запуск

При первом запуске модели будут загружены автоматически:

```
Initializing AI models...
✓ Models initialized successfully
```

Последующие запуски будут быстрее, так как модели кешируются.

## 🐛 Отладка

### Проблема: "No module named 'torch'"
```bash
pip install -q torch --index-url https://download.pytorch.org/whl/cpu
```

### Проблема: "Slow response on first message"
Первое использование может быть медленным, так как модели загружаются в память. Последующие запросы будут быстрее.

### Проблема: "Out of memory"
Если вам не хватает памяти, можно уменьшить размер моделей в `models.py` или использовать GPU:
```bash
pip install torch --index-url https://download.pytorch.org/whl/cu118
```

## 📊 Сравнение с REST API

| Функция | Консоль | REST API |
|---------|---------|----------|
| Прямое взаимодействие | ✓ | ✗ |
| Тестирование | ✓ | ✓ |
| Интеграция | ✗ | ✓ |
| История в памяти | ✓ | ✗ |
| Красивый вывод | ✓ | JSON |
| Персоналии наставника | ✓ | ✓ |
| Анализ кода | ✓ | ✓ |

## 🚀 Следующие шаги

1. **Тестирование**: Используйте консоль для тестирования функций перед интеграцией
2. **Разработка**: Добавьте новые команды и функции
3. **Производство**: Используйте REST API (`main.py`) для интеграции с другими сервисами

## 💡 Советы

- Используйте `/personality analytical` при работе с техническими вопросами
- Установите `/context level beginner` для новичков
- Регулярно используйте `/context topic` для улучшения рекомендаций
- Проверяйте `/history` для просмотра прогресса обучения

## 📞 Поддержка

Если у вас возникли проблемы:
1. Проверьте логи: `python ai_console.py 2>&1 | tail -50`
2. Убедитесь, что все зависимости установлены
3. Попробуйте переинициализировать модели

---

**Готово к использованию!** 🎉
