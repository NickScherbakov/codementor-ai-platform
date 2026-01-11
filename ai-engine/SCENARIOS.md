# 📚 Сценарии использования AI Console

Коллекция реальных примеров использования AI Console для разных задач.

---

## 🎓 Сценарий 1: Студент учит Python с нуля

**Цель:** Новичок хочет выучить основы Python

```bash
# Установить начальный контекст
/context level beginner
✓ skill_level set to: beginner

/context topic basics
✓ current_topic set to: basics

/personality encouraging
✓ Personality set to: encouraging

# Начать обучение
You: What is Python and why should I learn it?

AI Tutor:
Python is a beginner-friendly programming language that...

💡 Suggestions:
  • Break down the problem into smaller functions
  • Use meaningful variable names

📚 Learning Resources:
  • Python Fundamentals
  • Why Learn Python in 2025

# Следующий вопрос
You: How do I install Python on my computer?

AI Tutor:
Great question! Here's how to install Python on your computer...

# Анализ первого кода
You: /analyze

Paste your code (type END on a new line to finish):

print("Hello, World!")

END

Code Analysis:
  ✓ Correct syntax
  ✓ Good for first program
  
Suggestions:
  • Add more print statements
  • Experiment with different strings
```

---

## 💼 Сценарий 2: Разработчик готовится к собеседованию

**Цель:** Подготовка к техническому интервью на позицию Middle Backend Developer

```bash
# Установить продвинутый уровень
/context level advanced
✓ skill_level set to: advanced

/context topic algorithms
✓ current_topic set to: algorithms

/context language python
✓ language set to: python

/personality analytical
✓ Personality set to: analytical

# Спросить о сложном алгоритме
You: Explain the difference between DFS and BFS, and when to use each

AI Tutor:
DFS (Depth-First Search) and BFS (Breadth-First Search) are fundamental graph traversal algorithms.

Time Complexity: Both O(V + E)
Space Complexity: DFS O(h), BFS O(V)

Use DFS when:
- Finding connected components
- Topological sorting
- Detecting cycles

Use BFS when:
- Shortest path in unweighted graphs
- Level-order traversal
- Finding nearest node

💡 Suggestions:
  • Implement both algorithms
  • Practice with LeetCode problems

# Практика с кодом
You: /analyze

Paste your code (type END on a new line to finish):

from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    
    while queue:
        node = queue.popleft()
        print(node, end=' ')
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

END

Code Analysis:

Algorithm: BFS (Breadth-First Search)
Time Complexity: O(V + E) - Optimal for this operation
Space Complexity: O(V) - Queue stores at most V nodes

Code Quality: ✓ Excellent
  • Clear variable names
  • Correct algorithm implementation
  • Proper use of deque

Suggestions:
  • Add function docstring
  • Handle edge cases (empty graph)
  • Add type hints for Python 3.9+
```

---

## 🔧 Сценарий 3: Code Review собственного проекта

**Цель:** Получить рекомендации по улучшению кода

```bash
# Установить контекст для рецензирования
/context level intermediate
✓ skill_level set to: intermediate

/context topic code-quality
✓ current_topic set to: code-quality

/personality analytical
✓ Personality set to: analytical

# Анализ кода проекта
You: /analyze

Paste your code (type END on a new line to finish):

class User:
    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password
    
    def validate_email(self):
        if '@' in self.email:
            return True
        return False
    
    def validate_password(self):
        if len(self.password) >= 8:
            return True
        return False
    
    def save_to_db(self):
        # TODO: implement database saving
        pass

END

Code Analysis:

Code Quality Issues:
  • Missing docstrings
  • No input validation in __init__
  • Storing password in plaintext (SECURITY RISK!)
  • Methods should be more DRY

Suggestions:
  • Use regex for email validation
  • Hash passwords with bcrypt
  • Combine validators into single method
  • Add type hints

📚 Learning Resources:
  • Secure Password Storage
  • Email Validation Best Practices
  • Object-Oriented Design Patterns

# Следующая проблема
You: What's the best way to handle authentication in a web application?

AI Tutor:
Authentication is critical for security. Here are the best practices...
```

---

## 🎯 Сценарий 4: Помощь с домашним заданием

**Цель:** Студент застрял на задаче, нужны подсказки

```bash
# Установить контекст
/context level beginner
✓ skill_level set to: beginner

/context topic loops
✓ current_topic set to: loops

/personality encouraging
✓ Personality set to: encouraging

# Спросить подсказку
You: I need to write a function that prints numbers from 1 to 10, but I don't know how to do it

AI Tutor:
Great question! This is a perfect opportunity to learn about loops.

You have two options:

1. For Loop (most common for counting):
   for i in range(1, 11):
       print(i)

2. While Loop (good for conditions):
   i = 1
   while i <= 10:
       print(i)
       i += 1

💡 Suggestions:
  • Try both approaches
  • Understand range() function
  • Notice the difference in syntax

📚 Learning Resources:
  • Understanding Python's range() function
  • For Loops vs While Loops

# Студент попробовал и хочет улучшить
You: Now I need to print only even numbers from 1 to 20

You: /analyze

Paste your code (type END on a new line to finish):

for i in range(1, 21):
    if i % 2 == 0:
        print(i)

END

Code Analysis:

Code: ✓ Correct!

Algorithm:
  • Range from 1 to 20
  • Check if divisible by 2 (modulo operator)
  • Print if condition is true

Suggestions:
  • Could use range(2, 21, 2) for efficiency
  • Try list comprehension: [i for i in range(1, 21) if i % 2 == 0]

💡 Educational Value:
  • You understand conditionals
  • You understand modulo operator
  • Next: Learn about step parameter in range()
```

---

## 🏗️ Сценарий 5: Архитектор тестирует новую идею

**Цель:** Обсудить архитектурные решения

```bash
# Установить контекст для архитектуры
/context level advanced
✓ skill_level set to: advanced

/context topic architecture
✓ current_topic set to: architecture

/personality creative
✓ Personality set to: creative

# Обсудить идею
You: I'm thinking about using microservices architecture for a new project. What are the pros and cons?

AI Tutor:
Microservices is an interesting architectural choice!

Advantages:
  • Independent scaling of services
  • Technology flexibility per service
  • Faster deployment cycles
  • Better fault isolation

Disadvantages:
  • Distributed system complexity
  • Network latency concerns
  • Data consistency challenges
  • Operational overhead

When to use:
  • Large teams working on different domains
  • Services with different scaling needs
  • Technology heterogeneity requirement

💡 Suggestions:
  • Consider message queues (RabbitMQ, Kafka)
  • Implement service discovery
  • Plan for monitoring and logging

# Обсудить конкретный сценарий
You: Our team is 5 people. Is microservices overkill?

AI Tutor:
For a team of 5, I'd lean towards a monolithic architecture first...
```

---

## 🧪 Сценарий 6: QA инженер ищет баги

**Цель:** Обсудить тестовые сценарии и баги

```bash
# Установить контекст
/context level intermediate
✓ skill_level set to: intermediate

/context topic testing
✓ current_topic set to: testing

/personality analytical
✓ Personality set to: analytical

# Анализ багового кода
You: /analyze

Paste your code (type END on a new line to finish):

def calculate_discount(price, discount_percent):
    final_price = price * (1 - discount_percent / 100)
    return final_price

# Test cases
print(calculate_discount(100, 10))  # Expected: 90
print(calculate_discount(100, 0))   # Expected: 100
print(calculate_discount(100, 100)) # Expected: 0
print(calculate_discount(100, 150)) # Expected: -50 (BUG!)

END

Code Analysis:

Issues Found:
  • No validation for negative discount_percent
  • No validation for negative price
  • Allows discount > 100% (resulting in negative price)

Edge Cases NOT Handled:
  • discount_percent > 100%
  • price < 0
  • Non-numeric inputs

Test Failures:
  • calculate_discount(100, 150) returns -50 ✗

Suggestions:
  • Add input validation
  • Clamp discount_percent to 0-100%
  • Add unit tests
  • Handle edge cases

📚 Learning Resources:
  • Unit Testing Best Practices
  • Defensive Programming
  • Property-Based Testing
```

---

## 🎨 Сценарий 7: Фронтенд разработчик изучает новый язык

**Цель:** Перейти с JavaScript на TypeScript

```bash
# Установить контекст
/context level intermediate
✓ skill_level set to: intermediate

/context topic typescript
✓ current_topic set to: typescript

/context language typescript
✓ language set to: typescript

/personality practical
✓ Personality set to: practical

# Спросить о TypeScript
You: I know JavaScript but want to learn TypeScript. What are the main differences?

AI Tutor:
TypeScript is a superset of JavaScript that adds static typing.

Key Differences:
1. Type Safety
   const name: string = "John";  // Type specified

2. Interfaces
   interface User {
     name: string;
     age: number;
   }

3. Classes (proper OOP)
4. Generics (reusable components)
5. Better IDE support

Benefits in production:
  • Catch errors before runtime
  • Better code documentation
  • Improved refactoring
  • Team collaboration

💡 Suggestions:
  • Start with simple types (string, number)
  • Gradually introduce interfaces
  • Use strict mode: "strict": true

📚 Learning Resources:
  • TypeScript Handbook
  • From JavaScript to TypeScript
  • Real-world TypeScript Patterns

# Анализ первого TypeScript кода
You: /analyze

Paste your code (type END on a new line to finish):

interface User {
  id: number;
  name: string;
  email: string;
}

function getUserInfo(user: User): string {
  return `${user.name} - ${user.email}`;
}

const myUser: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

console.log(getUserInfo(myUser));

END

Code Analysis:

Code Quality: ✓ Excellent
  • Proper interface definition
  • Type annotations on parameters
  • Return type specified
  • Correct implementation

TypeScript Features Used:
  • Interface for type safety
  • Function parameter typing
  • Variable typing

Next Steps:
  • Learn generics for reusable interfaces
  • Explore utility types (Partial, Pick, etc.)
  • Experiment with classes
```

---

## 🚀 Сценарий 8: Пакетная обработка классических вопросов

**Цель:** Быстро ответить на часто задаваемые вопросы

```bash
# Установить контекст для FAQ
/personality encouraging
✓ Personality set to: encouraging

# Вопрос 1
You: What's the difference between let, const, and var in JavaScript?

AI Tutor:
Great question! This is important to understand...

# Вопрос 2
You: Why do people say Python is slow?

AI Tutor:
Python is indeed slower than C++, but here's why...

# Вопрос 3
You: /context language python
You: Should I learn Python or Java?

AI Tutor:
Both are excellent choices. Here's how to decide...

# Просмотреть всё в истории
You: /history

Conversation History (3 items):
[1] 2025-01-10 14:15:30 - chat
    User: What's the difference between let, const, and var...
[2] 2025-01-10 14:16:15 - chat
    User: Why do people say Python is slow...
[3] 2025-01-10 14:17:45 - chat
    User: Should I learn Python or Java...
```

---

## 💾 Сценарий 9: Сохранение важной информации

**Цель:** Записать важный совет в историю для последующей ссылки

```bash
# Сессия 1: Изучение
You: /context topic database-design

You: What are database normalization forms?

AI Tutor:
Database normalization is crucial for good data design...

# Просмотреть историю после окончания
You: /history

# Сессия 2: Вспомнить информацию
You: /history

Conversation History (1 items):

[1] 2025-01-10 14:30:00 - chat
    User: What are database normalization forms...
    
(Вы видите ответ, который дал ИИ)
```

---

## 🎓 Сценарий 10: Обучение через практику

**Цель:** Школьник выполняет серию практических упражнений

```bash
# Установка
/context level beginner
/personality encouraging

# Упражнение 1
You: Can you give me a simple exercise to practice loops?

AI Tutor:
Great! Here's an exercise:

Exercise 1:
Write a program that prints a multiplication table for 5...

# Решение
You: /analyze

Paste your code (type END on a new line to finish):

for i in range(1, 11):
    print(f"5 x {i} = {5 * i}")

END

Code Analysis: ✓ Correct!

# Упражнение 2
You: Do you have a harder one?

AI Tutor:
Sure! Try this:

Exercise 2:
Write a program that finds prime numbers between 1 and 100...

# И так далее...
```

---

## 📊 Таблица сравнения сценариев

| Сценарий | Тип | Личность | Уровень |
|----------|-----|----------|---------|
| 1. Студент + Python | 🎓 Обучение | Encouraging | Beginner |
| 2. Интервью | 💼 Профессиональный | Analytical | Advanced |
| 3. Code Review | 🔧 Разработка | Analytical | Intermediate |
| 4. Домашнее задание | 📚 Обучение | Encouraging | Beginner |
| 5. Архитектура | 🏗️ Дизайн | Creative | Advanced |
| 6. QA/Тестирование | 🧪 Тестирование | Analytical | Intermediate |
| 7. Новый язык | 🎨 Обучение | Practical | Intermediate |
| 8. FAQ | ❓ Помощь | Encouraging | Any |
| 9. Заметки | 💾 Справка | Any | Any |
| 10. Практика | 🎓 Обучение | Encouraging | Beginner |

---

## 🎯 Рекомендации

1. **Выберите сценарий**, который соответствует вашей ситуации
2. **Установите контекст** (`/context`)
3. **Выберите личность** (`/personality`)
4. **Начните диалог** с конкретного вопроса
5. **Используйте `/analyze`** для кода
6. **Сохраняйте `/history`** полезной информации

---

**Удачи в обучении и разработке!** 🚀
