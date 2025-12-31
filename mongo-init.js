// MongoDB initialization script
db = db.getSiblingDB('codementor-ai');

// Create collections
db.createCollection('users');
db.createCollection('challenges');
db.createCollection('submissions');
db.createCollection('progress');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.challenges.createIndex({ category: 1, difficulty: 1 });
db.submissions.createIndex({ userId: 1, challengeId: 1 });
db.progress.createIndex({ userId: 1 });

print('MongoDB initialized successfully!');
