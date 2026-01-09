// Sample code snippets for testing Hard Code Review

export const sampleSnippets = {
  // JavaScript - Multiple Issues
  badJavaScript: `function getUserData(userId) {
  var users = [{id: 1, name: "John"}, {id: 2, name: "Jane"}];
  const user = users.find(u => u.id == userId);
  return {
    name: user.name,
    email: user.email,
    posts: user.posts.map(p => ({
      title: p.title,
      content: p.content
    }))
  };
}

function processPayment(amount, userId) {
  var user = users.find(u => u.id == userId);
  if (user.balance >= amount) {
    user.balance = user.balance - amount;
    return true;
  }
  return false;
}`,

  // TypeScript - Better but still has issues
  mediocreTypeScript: `interface User {
  id: number;
  name: string;
  email?: string;
  balance: number;
}

function getUserData(userId: number, users: User[]) {
  const user = users.find(u => u.id === userId);
  return {
    name: user.name,
    email: user.email,
    balance: user.balance
  };
}

function processUsers(userIds: number[]) {
  for (let i = 0; i < userIds.length; i++) {
    for (let j = 0; j < userIds.length; j++) {
      if (userIds[i] === userIds[j] && i !== j) {
        console.log("Duplicate found");
      }
    }
  }
}`,

  // Python - Multiple Issues
  badPython: `def get_user_data(user_id):
    users = [{"id": 1, "name": "John"}, {"id": 2, "name": "Jane"}]
    user = [u for u in users if u["id"] == user_id][0]
    return {
        "name": user["name"],
        "email": user["email"],
        "posts": [{"title": p["title"]} for p in user["posts"]]
    }

def process_payment(amount, user_id):
    user = get_user(user_id)
    if user["balance"] >= amount:
        user["balance"] = user["balance"] - amount
        save_user(user)
        return True
    return False`,

  // Good Code Example
  goodCode: `/**
 * Retrieves user data by ID with proper error handling
 * @param {number} userId - The user identifier
 * @param {User[]} users - Array of users
 * @returns {UserData | null} User data or null if not found
 */
function getUserData(userId, users) {
  if (!userId || !Array.isArray(users)) {
    throw new Error('Invalid parameters');
  }

  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return null;
  }

  return {
    name: user.name ?? 'Unknown',
    email: user.email ?? '',
    posts: user.posts?.map(p => ({
      title: p.title,
      content: p.content
    })) ?? []
  };
}

/**
 * Processes payment with transaction safety
 * @param {number} amount - Amount in cents
 * @param {number} userId - User identifier
 * @returns {Promise<boolean>} Success status
 */
async function processPayment(amount, userId) {
  if (amount <= 0) {
    throw new Error('Invalid amount');
  }

  const transaction = await db.beginTransaction();
  
  try {
    const user = await getUserWithLock(userId, transaction);
    
    if (!user) {
      throw new Error(\`User not found: \${userId}\`);
    }
    
    if (user.balance < amount) {
      throw new Error('Insufficient balance');
    }

    await updateBalance(userId, user.balance - amount, transaction);
    await transaction.commit();
    
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}`,

  // Security Vulnerability Example
  securityIssue: `const express = require('express');
const app = express();
const db = require('./database');

app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const query = "SELECT * FROM users WHERE id = " + userId;
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results[0]);
    }
  });
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const query = \`SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}'\`;
  db.query(query, (err, results) => {
    if (results.length > 0) {
      req.session.userId = results[0].id;
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false });
    }
  });
});`,

  // Performance Issue Example
  performanceIssue: `function findDuplicates(arr) {
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j] && duplicates.indexOf(arr[i]) === -1) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}

function getUsersByRole(users, role) {
  const result = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].roles.indexOf(role) !== -1) {
      result.push(users[i]);
    }
  }
  return result;
}

function processLargeDataset(data) {
  let processed = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const enriched = enrichData(item); // Expensive operation
    processed.push(enriched);
    
    // Update UI on every iteration
    updateProgress(i / data.length * 100);
  }
  return processed;
}`
};

export const snippetDescriptions = {
  badJavaScript: "JavaScript with multiple critical issues (null checks, type coercion, race conditions)",
  mediocreTypeScript: "TypeScript with design and performance issues (O(n²) complexity, missing null checks)",
  badPython: "Python with poor error handling and missing validations",
  goodCode: "Well-written code with proper error handling, documentation, and defensive programming",
  securityIssue: "Critical security vulnerabilities (SQL injection, password handling)",
  performanceIssue: "Severe performance problems (nested loops, inefficient algorithms)"
};
