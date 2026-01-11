# 🚀 Быстрый старт с AI Console

## За 2 минуты до первого диалога

### Шаг 1: Перейти в директорию
```bash
cd ai-engine
```

### Шаг 2: Установить зависимости (если ещё не установлены)
```bash
# PyTorch для CPU (достаточно быстро)
pip install -q torch --index-url https://download.pytorch.org/whl/cpu

# Остальные зависимости
pip install -q transformers flask flask-cors scikit-learn redis
```

### Шаг 3: Запустить консоль
```bash
python ai_console.py
```

### Шаг 4: Взаимодействовать с ИИ
```
You: Hello! How do I get started with Python?

AI Tutor:
Python is a great language to start with! Here's a learning path...

💡 Suggestions:
  • Consider using appropriate loop structures
  • Break down the problem into smaller functions

📚 Learning Resources:
  • Mastering Loops in Programming
```

---

## 🎮 Основные команды

| Команда | Описание |
|---------|----------|
| `/help` | Справка по всем командам |
| `/personality <имя>` | Смена личности (encouraging, analytical, creative, practical) |
| `/context <ключ> <значение>` | Установить контекст обучения |
| `/analyze` | Режим анализа кода |
| `/history` | История разговоров |
| `/clear` | Очистить историю |
| `/exit` | Выход |

---

## 📝 Примеры

### Пример 1: Изменить личность наставника
```bash
You: /personality analytical
✓ Personality set to: analytical

You: What is the time complexity of binary search?
AI Tutor: Binary search has O(log n) time complexity...
```

### Пример 2: Установить уровень обучения
```bash
You: /context level advanced
✓ skill_level set to: advanced

You: Explain the difference between synchronous and asynchronous programming
AI Tutor: Synchronous programming means operations are executed one by one...
```

### Пример 3: Анализ кода
```bash
You: /analyze

Enter code analysis mode
Language: python
Paste your code (type END on a new line to finish):

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

END

Code Analysis:
Issues Found:
  • This implementation has exponential time complexity
  • Consider using memoization for better performance

Suggestions:
  • Use dynamic programming approach
  • Cache results to avoid recalculation
```

---

## ✨ Особенности

✅ **Без сервера** — работает локально без запуска REST API  
✅ **Быстро** — 1-3 секунды на ответ  
✅ **Красиво** — цветной вывод, хорошее форматирование  
✅ **История** — все разговоры сохраняются в сессии  
✅ **Гибко** — 4 типа личности, настраиваемый контекст  
✅ **Бесплатно** — никаких API ключей  

---

## 🔄 Переключение между режимами

### Режим чата (по умолчанию)
```bash
You: /chat
✓ Chat mode active
```

### Режим анализа кода
```bash
You: /analyze
Enter code analysis mode...
```

---

## 💾 История разговоров

Просмотреть всю историю:
```bash
You: /history

Conversation History (5 items):

[1] 2025-01-10 10:30:45 - chat
    User: How do I write a loop...

[2] 2025-01-10 10:31:22 - chat
    User: What is a function...

...
```

Очистить историю:
```bash
You: /clear
✓ History cleared
```

---

## 🎯 Рекомендуемые настройки

### Для начинающих
```bash
/context level beginner
/context topic basics
/personality encouraging
```

### Для промежуточного уровня
```bash
/context level intermediate
/context topic data-structures
/personality analytical
```

### Для продвинутых
```bash
/context level advanced
/context topic algorithms
/personality creative
```

---

## ⚡ Советы по производительности

1. **Первый запуск медленнее** — модели загружаются в память
2. **Последующие запросы быстрее** — модели остаются в памяти
3. **Используйте CPU** для начала (достаточно быстро)
4. **Переключитесь на GPU** если нужна большая скорость

---

## 🐛 Решение проблем

### Модули не найдены
```bash
pip install -q torch --index-url https://download.pytorch.org/whl/cpu
pip install -q transformers flask flask-cors scikit-learn redis
```

### Медленные ответы
- Это нормально для первого запроса
- Последующие запросы будут быстрее
- Используйте GPU для улучшения производительности

### Консоль зависает
- Нажмите `Ctrl+C` для выхода
- Проверьте логи для отладки

---

## 📚 Дополнительные ресурсы

- **[CONSOLE.md](CONSOLE.md)** — полная документация консоли
- **[README.md](README.md)** — информация об AI движке
- **[main.py](main.py)** — REST API сервер
- **[models.py](models.py)** — определение моделей

---

## 🎓 Обучающие примеры

### Пример: Помощь с домашним заданием
```bash
/context level beginner
/context topic arrays
/personality encouraging

You: I need help with array sorting. How do I start?

AI Tutor: Great! Arrays are fundamental in programming. 
Let me help you understand sorting...
```

### Пример: Разбор сложного кода
```bash
/personality analytical
/context level advanced

You: /analyze
[Вставить сложный код для анализа]

Code Analysis:
  • Algorithm: Merge Sort
  • Time Complexity: O(n log n)
  • Space Complexity: O(n)
```

---

**Готово к использованию!** 🎉

Для интерактивной консоли:
```bash
python ai_console.py
```

Для демонстрации:
```bash
python ai_console_demo.py
```
