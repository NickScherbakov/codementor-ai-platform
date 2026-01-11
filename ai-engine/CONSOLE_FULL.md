# 🎮 AI Console - Полная документация

## Обзор

**AI Console** — это интерактивная CLI приложение для взаимодействия с ИИ движком CodeMentor без необходимости запускать REST сервер.

### Основные возможности:
- 💬 **Прямой диалог с ИИ-наставником**
- 📊 **Анализ кода с рекомендациями**
- 🎭 **4 типа личности наставника**
- 📚 **История разговоров**
- ⚙️ **Настраиваемый контекст обучения**
- 🎨 **Красивый цветной интерфейс**

---

## 📁 Файловая структура

```
ai-engine/
├── ai_console.py              # Основной интерактивный консоль
├── ai_console_demo.py         # Demo режим (показывает возможности)
├── setup_console.sh           # Script для автоматической установки
├── CONSOLE.md                 # Полная документация консоли
├── CONSOLE_QUICKSTART.md      # Быстрый старт (2-3 минуты)
├── models.py                  # Определение AI моделей
├── main.py                    # REST API сервер
└── test_interactive.py        # Тесты
```

---

## 🚀 Установка и запуск

### Автоматическая установка (рекомендуется)
```bash
cd ai-engine
bash setup_console.sh
```

### Ручная установка
```bash
cd ai-engine

# Установить PyTorch
pip install torch --index-url https://download.pytorch.org/whl/cpu

# Установить зависимости
pip install transformers flask flask-cors scikit-learn redis
```

### Запуск консоли
```bash
# Интерактивный режим
python ai_console.py

# Demo режим (показывает возможности)
python ai_console_demo.py
```

---

## 💻 Интерфейс консоли

```
╔════════════════════════════════════════════════════════╗
║                                                        ║
║          CodeMentor AI - Interactive Console          ║
║     AI-Powered Learning Assistant - Direct Mode      ║
║                                                        ║
╚════════════════════════════════════════════════════════╝

Available Commands:
  /help         - Show help and available commands
  /personality  - Change tutor personality
  /context      - Set learning context
  /analyze      - Switch to code analysis mode
  /chat         - Switch to chat mode
  /history      - Show conversation history
  /clear        - Clear conversation history
  /exit         - Exit the console

Type your question or command to get started!

You: How do I write a loop in Python?

AI Tutor:

To write a loop in Python, you have two main options:
a for loop or a while loop...

💡 Suggestions:
  • Consider using appropriate loop structures
  • Break down the problem into smaller functions

📚 Learning Resources:
  • Mastering Loops in Programming
    /learn/concepts/loops
```

---

## 🎯 Команды

### Chat Mode (обычные вопросы)

**Просто введите вопрос:**
```
You: What is a variable?
```

**Изменить личность:**
```
You: /personality analytical
```

Доступные личности:
| Тип | Описание |
|-----|----------|
| `encouraging` | Поддерживающий, позитивный, помогает строить уверенность |
| `analytical` | Логический, точный, фокус на решении задач |
| `creative` | Инновационный, поощряет нестандартное мышление |
| `practical` | Практичный, фокус на реальных применениях |

### Code Analysis Mode

**Включить режим анализа:**
```
You: /analyze

Enter code analysis mode
Language: python
Paste your code (type END on a new line to finish):

def bubble_sort(arr):
    for i in range(len(arr)):
        for j in range(len(arr)-1-i):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

END
```

**Результат:**
```
Code Analysis:

Code:
    1 def bubble_sort(arr):
    2     for i in range(len(arr)):
    3         for j in range(len(arr)-1-i):
    4             if arr[j] > arr[j+1]:
    5                 arr[j], arr[j+1] = arr[j+1], arr[j]
    6     return arr

Issues:
  • This is O(n²) algorithm
  • Not efficient for large arrays

Suggestions:
  • Consider using timsort or quicksort
  • Use built-in sort() when possible
```

### Context Management

**Установить контекст:**
```
You: /context topic arrays
✓ current_topic set to: arrays

You: /context level intermediate
✓ skill_level set to: intermediate

You: /context language javascript
✓ language set to: javascript
```

**Просмотреть текущий контекст:**
```
You: /context

Current Context:
  current_topic        arrays
  skill_level          intermediate
  language             javascript
  personality          analytical
  mode                 chat
```

### History Management

**Просмотреть историю:**
```
You: /history

Conversation History (5 items):

[1] 2025-01-10 10:30:45 - chat
    User: How do I write a loop...

[2] 2025-01-10 10:31:22 - analyze
    Language: python

[3] 2025-01-10 10:32:15 - chat
    User: What is a class...

[4] 2025-01-10 10:33:00 - chat
    User: Explain recursion...

[5] 2025-01-10 10:33:45 - analyze
    Language: python
```

**Очистить историю:**
```
You: /clear
✓ History cleared
```

### Session Control

```
You: /help          # Показать справку
You: /exit          # Выход из консоли
```

---

## 📝 Примеры использования

### Пример 1: Обучение начинающего

```
You: /context level beginner
✓ skill_level set to: beginner

You: /personality encouraging
✓ Personality set to: encouraging

You: I want to learn Python but I'm completely new to programming. Where should I start?

AI Tutor:
Welcome to programming! Python is an excellent language to start with.
Here's a recommended learning path:

1. Learn the basics:
   - Variables and data types
   - Operators
   - Control flow (if/else)

2. Practice with simple programs:
   - Calculators
   - Quiz games
   - Simple utilities

💡 Suggestions:
  • Break down the problem into smaller functions
  • Write test cases to verify your solution

📚 Learning Resources:
  • Mastering Loops in Programming
  • Functions and Code Organization
```

### Пример 2: Помощь с реальной задачей

```
You: /context topic algorithms
You: /context level intermediate
You: /personality analytical

You: /analyze

Enter code analysis mode
Language: python
Paste your code (type END on a new line to finish):

def find_max_subarray(arr):
    max_sum = 0
    current_sum = 0
    for num in arr:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum

END

Code Analysis:

Code:
    1 def find_max_subarray(arr):
    2     max_sum = 0
    3     current_sum = 0
    4     for num in arr:
    5         current_sum = max(num, current_sum + num)
    6         max_sum = max(max_sum, current_sum)
    7     return max_sum

Algorithm: Kadane's Algorithm
Time Complexity: O(n) - Very efficient!
Space Complexity: O(1) - No extra space used

Issues:
  • Assumes at least one positive number
  • Returns 0 for all-negative arrays

Suggestions:
  • Handle edge cases (empty array, all negatives)
  • Add input validation
  • Add docstring with examples
```

### Пример 3: Освоение новой темы

```
You: /context topic data-structures
You: /personality creative

You: Tell me about linked lists and why they're useful

AI Tutor:
Linked lists are fascinating data structures! 
Think of them as a chain where each element 
knows about the next one...

Why linked lists matter:
- Dynamic size (unlike arrays)
- Efficient insertion/deletion
- Foundation for queues and stacks
- Used in real applications

Creative use cases:
- Browser history (back button)
- Undo/redo functionality
- Playlist systems
- Task schedulers

💡 Suggestions:
  • Consider using appropriate data structures
  • Break down the problem into smaller functions

📚 Learning Resources:
  • Data Structures: Arrays vs Linked Lists
  • Implementing Linked Lists from Scratch
  • Real-world Applications of Linked Lists
```

---

## ⚙️ Архитектура

```
┌─────────────────────────────────────────┐
│      ai_console.py (Main)              │
│  Interactive CLI Interface & Commands   │
└──────────────┬──────────────────────────┘
               │
       ┌───────┼───────┐
       │       │       │
┌──────▼──┐ ┌──▼──────┐ ┌──▼──────────┐
│ Chat    │ │ Analyze │ │ Management  │
│ Mode    │ │ Mode    │ │ (history)   │
└──────┬──┘ └──┬──────┘ └──┬─────────┘
       │       │          │
       └───────┼──────────┘
               │
       ┌───────▼──────────┐
       │ models.py        │
       │ (AI Models)      │
       ├──────────────────┤
       │ TinyLlama-1.1B   │
       │ (Chat)           │
       │ CodeT5-Small     │
       │ (Analysis)       │
       └──────────────────┘
```

---

## 🔄 Workflow

1. **Инициализация**
   - Запуск ai_console.py
   - Загрузка моделей в память
   - Вывод приветствия

2. **Взаимодействие**
   - Пользователь вводит команду или вопрос
   - Консоль парсит команду или отправляет в ИИ
   - ИИ генерирует ответ
   - Результат красиво форматируется и выводится

3. **История**
   - Каждое взаимодействие сохраняется в памяти
   - Можно просмотреть через `/history`
   - Очистить через `/clear`

4. **Выход**
   - Команда `/exit`
   - Ctrl+C
   - EOF (конец ввода)

---

## 📊 Сравнение с другими способами

| Способ | AI Console | REST API | Python Script |
|--------|-----------|----------|---------------|
| **Простота** | ✓✓✓ | ✓✓ | ✓ |
| **Интерактив** | ✓✓✓ | ✗ | ✗ |
| **История** | ✓ | ✗ | ✗ |
| **Интеграция** | ✗ | ✓✓✓ | ✓ |
| **Параллелизм** | ✗ | ✓✓✓ | ✓ |
| **Масштабируемость** | ✗ | ✓✓✓ | ✗ |

---

## 🔧 Требования

- **Python 3.9+**
- **PyTorch 2.1.2** (CPU или GPU)
- **Transformers 4.36.2** от Hugging Face
- **1-2 GB RAM** для моделей
- **Интернет** для первой загрузки моделей

---

## ⏱️ Производительность

| Метрика | Значение |
|---------|----------|
| Первый запуск | 30-60 сек (загрузка моделей) |
| Обычный ответ | 2-3 сек (CPU) |
| GPU ответ | <1 сек (с CUDA) |
| Память | ~2-4 GB |
| Размер моделей | ~2.7 GB |

---

## 🎨 Цветовая схема

- 🔵 **Cyan** — заголовки и основная информация
- 🟢 **Green** — успешные операции, ответы ИИ
- 🟡 **Yellow** — предложения, ресурсы, процесс
- 🔴 **Red** — ошибки
- ⚫ **Dim** — дополнительная информация

---

## 🚨 Решение проблем

### Проблема: "ModuleNotFoundError: No module named 'torch'"
```bash
pip install -q torch --index-url https://download.pytorch.org/whl/cpu
```

### Проблема: Очень медленные ответы
- Нормально для первого запроса (идет загрузка моделей)
- Последующие запросы будут быстрее
- Рассмотрите использование GPU

### Проблема: "Out of memory"
- Закройте другие приложения
- Используйте более легкие модели
- Или используйте GPU

### Проблема: Консоль зависает
- Нажмите Ctrl+C для прерывания
- Проверьте логи
- Перезапустите консоль

---

## 💡 Советы и трюки

1. **Используйте `/context`** для улучшения рекомендаций
2. **Меняйте личность** в зависимости от задачи
3. **Сохраняйте `/history`** для отслеживания прогресса
4. **Комбинируйте режимы** — chat для вопросов, analyze для кода
5. **Используйте `/help`** если потеряетесь

---

## 🚀 Расширение функциональности

### Добавить новую команду

Отредактируйте `ai_console.py`, метод `process_command()`:

```python
elif command == 'my_command':
    # Ваш код здесь
    pass
```

### Добавить новую личность

В `models.py`, класс `CustomAITutor`:

```python
self.personality_prompts = {
    # ... существующие
    'my_personality': "You are a... [описание]"
}
```

---

## 📚 Дополнительные ресурсы

- **[CONSOLE_QUICKSTART.md](CONSOLE_QUICKSTART.md)** — 2-минутный старт
- **[main.py](main.py)** — REST API версия
- **[models.py](models.py)** — определение моделей
- **[README.md](README.md)** — общая информация об AI Engine

---

## 📞 Поддержка

Если возникли проблемы:

1. Проверьте документацию
2. Посмотрите примеры
3. Проверьте логи консоли
4. Попробуйте переустановить зависимости

---

**Готово к использованию!** 🎉

```bash
# Интерактивная консоль
python ai_console.py

# Демонстрация
python ai_console_demo.py

# Автоматическая установка
bash setup_console.sh
```
