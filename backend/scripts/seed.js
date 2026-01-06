const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../.env' });

// Import models
const User = require('../models/User');
const Challenge = require('../models/Challenge');
const Achievement = require('../models/Achievement');
const LearningPath = require('../models/LearningPath');
const Progress = require('../models/Progress');

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codementor-ai';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function clearDatabase() {
  console.log('\n🗑️  Clearing existing data...');
  
  await User.deleteMany({});
  await Challenge.deleteMany({});
  await Achievement.deleteMany({});
  await LearningPath.deleteMany({});
  await Progress.deleteMany({});
  
  console.log('✓ Database cleared');
}

async function createUsers() {
  console.log('\n👥 Creating users...');
  
  const users = [
    {
      username: 'admin',
      email: 'admin@codementor.ai',
      password: await bcrypt.hash('Admin123!', 10),
      fullName: 'Admin User',
      isAdmin: true,
      isVerified: true,
      role: 'admin'
    },
    {
      username: 'system',
      email: 'system@codementor.ai',
      password: await bcrypt.hash('System123!', 10),
      fullName: 'System User',
      isAdmin: true,
      isVerified: true,
      role: 'system'
    },
    {
      username: 'john_doe',
      email: 'john@example.com',
      password: await bcrypt.hash('Password123!', 10),
      fullName: 'John Doe',
      isVerified: true,
      bio: 'Aspiring software developer learning to code!',
      profile: {
        bio: 'Love coding and problem solving',
        location: 'New York, USA',
        skills: ['JavaScript', 'Python', 'React'],
        experience: 'beginner'
      }
    },
    {
      username: 'jane_smith',
      email: 'jane@example.com',
      password: await bcrypt.hash('Password123!', 10),
      fullName: 'Jane Smith',
      isVerified: true,
      bio: 'Full-stack developer passionate about clean code',
      profile: {
        bio: 'Full-stack developer with 3 years of experience',
        location: 'San Francisco, USA',
        skills: ['JavaScript', 'TypeScript', 'Node.js', 'React'],
        experience: 'intermediate'
      }
    }
  ];
  
  const createdUsers = await User.insertMany(users);
  console.log(`✓ Created ${createdUsers.length} users`);
  
  return createdUsers;
}

async function createChallenges(systemUser) {
  console.log('\n🎯 Creating challenges...');
  
  const challenges = [
    {
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
      difficulty: 'beginner',
      category: 'algorithms',
      tags: ['arrays', 'hash-table', 'two-pointers'],
      languages: ['python', 'javascript', 'java', 'cpp'],
      starterCode: new Map([
        ['python', 'def two_sum(nums, target):\n    # Your code here\n    pass'],
        ['javascript', 'function twoSum(nums, target) {\n    // Your code here\n}'],
        ['java', 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n    }\n}']
      ]),
      testCases: [
        { input: '[2,7,11,15], 9', expectedOutput: '[0,1]', isHidden: false, weight: 1 },
        { input: '[3,2,4], 6', expectedOutput: '[1,2]', isHidden: false, weight: 1 },
        { input: '[3,3], 6', expectedOutput: '[0,1]', isHidden: false, weight: 1 }
      ],
      hints: [
        { order: 1, content: 'A hash table can help you find the complement of each number.', unlockedAfterAttempts: 1 },
        { order: 2, content: 'For each number, check if target - number exists in your data structure.', unlockedAfterAttempts: 2 }
      ],
      xpReward: 100,
      estimatedTime: 15,
      learningObjectives: ['Understand hash tables', 'Learn time-space tradeoffs'],
      createdBy: systemUser._id,
      isPublished: true,
      featured: true
    },
    {
      title: 'Reverse String',
      description: 'Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.',
      difficulty: 'beginner',
      category: 'algorithms',
      tags: ['strings', 'two-pointers'],
      languages: ['python', 'javascript', 'java', 'cpp'],
      starterCode: new Map([
        ['python', 'def reverse_string(s):\n    # Your code here\n    pass'],
        ['javascript', 'function reverseString(s) {\n    // Your code here\n}']
      ]),
      testCases: [
        { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]', isHidden: false, weight: 1 },
        { input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]', isHidden: false, weight: 1 }
      ],
      hints: [
        { order: 1, content: 'Use two pointers, one at the start and one at the end.', unlockedAfterAttempts: 1 }
      ],
      xpReward: 80,
      estimatedTime: 10,
      learningObjectives: ['Two-pointer technique', 'In-place array modification'],
      createdBy: systemUser._id,
      isPublished: true,
      featured: true
    },
    {
      title: 'Valid Palindrome',
      description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string s, return true if it is a palindrome, or false otherwise.',
      difficulty: 'beginner',
      category: 'algorithms',
      tags: ['strings', 'two-pointers'],
      languages: ['python', 'javascript', 'java'],
      starterCode: new Map([
        ['python', 'def is_palindrome(s):\n    # Your code here\n    pass'],
        ['javascript', 'function isPalindrome(s) {\n    // Your code here\n}']
      ]),
      testCases: [
        { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true', isHidden: false, weight: 1 },
        { input: '"race a car"', expectedOutput: 'false', isHidden: false, weight: 1 }
      ],
      xpReward: 90,
      estimatedTime: 15,
      learningObjectives: ['String manipulation', 'Two-pointer technique'],
      createdBy: systemUser._id,
      isPublished: true
    },
    {
      title: 'Binary Search',
      description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.',
      difficulty: 'intermediate',
      category: 'algorithms',
      tags: ['binary-search', 'arrays'],
      languages: ['python', 'javascript', 'java', 'cpp'],
      starterCode: new Map([
        ['python', 'def binary_search(nums, target):\n    # Your code here\n    pass'],
        ['javascript', 'function binarySearch(nums, target) {\n    // Your code here\n}']
      ]),
      testCases: [
        { input: '[-1,0,3,5,9,12], 9', expectedOutput: '4', isHidden: false, weight: 1 },
        { input: '[-1,0,3,5,9,12], 2', expectedOutput: '-1', isHidden: false, weight: 1 }
      ],
      hints: [
        { order: 1, content: 'Use divide and conquer - split the search space in half each time.', unlockedAfterAttempts: 1 },
        { order: 2, content: 'Compare the middle element with the target to decide which half to search.', unlockedAfterAttempts: 2 }
      ],
      xpReward: 150,
      estimatedTime: 20,
      learningObjectives: ['Binary search algorithm', 'Logarithmic time complexity'],
      createdBy: systemUser._id,
      isPublished: true,
      featured: true
    },
    {
      title: 'Fizz Buzz',
      description: 'Given an integer n, return a string array answer (1-indexed) where:\n\n- answer[i] == "FizzBuzz" if i is divisible by 3 and 5.\n- answer[i] == "Fizz" if i is divisible by 3.\n- answer[i] == "Buzz" if i is divisible by 5.\n- answer[i] == i (as a string) if none of the above conditions are true.',
      difficulty: 'beginner',
      category: 'algorithms',
      tags: ['math', 'conditionals'],
      languages: ['python', 'javascript', 'java', 'cpp'],
      starterCode: new Map([
        ['python', 'def fizz_buzz(n):\n    # Your code here\n    pass'],
        ['javascript', 'function fizzBuzz(n) {\n    // Your code here\n}']
      ]),
      testCases: [
        { input: '3', expectedOutput: '["1","2","Fizz"]', isHidden: false, weight: 1 },
        { input: '5', expectedOutput: '["1","2","Fizz","4","Buzz"]', isHidden: false, weight: 1 },
        { input: '15', expectedOutput: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]', isHidden: false, weight: 1 }
      ],
      xpReward: 70,
      estimatedTime: 10,
      learningObjectives: ['Conditional logic', 'Modulo operator'],
      createdBy: systemUser._id,
      isPublished: true
    }
  ];
  
  const createdChallenges = await Challenge.insertMany(challenges);
  console.log(`✓ Created ${createdChallenges.length} challenges`);
  
  return createdChallenges;
}

async function createAchievements() {
  console.log('\n🏆 Creating achievements...');
  
  await Achievement.createDefaults();
  
  const count = await Achievement.countDocuments();
  console.log(`✓ Created ${count} achievements`);
}

async function createLearningPaths(systemUser, challenges) {
  console.log('\n📚 Creating learning paths...');
  
  await LearningPath.createDefaults();
  
  // Update one path with actual challenge steps
  const beginnerPath = await LearningPath.findOne({ title: 'Python Fundamentals' });
  if (beginnerPath && challenges.length > 0) {
    beginnerPath.steps = challenges.slice(0, 3).map((challenge, index) => ({
      order: index + 1,
      challenge: challenge._id,
      isOptional: false,
      estimatedTime: challenge.estimatedTime || 30
    }));
    await beginnerPath.save();
  }
  
  const count = await LearningPath.countDocuments();
  console.log(`✓ Created ${count} learning paths`);
}

async function createProgress(users) {
  console.log('\n📊 Creating user progress...');
  
  const progressData = [];
  
  // Create progress for demo users (not system/admin)
  const demoUsers = users.filter(u => !u.isAdmin);
  
  for (const user of demoUsers) {
    progressData.push({
      user: user._id,
      totalXP: Math.floor(Math.random() * 1000),
      level: Math.floor(Math.random() * 10) + 1,
      preferences: {
        preferredLanguages: ['python', 'javascript'],
        difficultyLevel: 'beginner',
        learningStyle: 'visual',
        aiTutorPersonality: 'encouraging'
      }
    });
  }
  
  const createdProgress = await Progress.insertMany(progressData);
  console.log(`✓ Created progress for ${createdProgress.length} users`);
}

async function seed() {
  console.log('🌱 Starting database seed...\n');
  
  try {
    await connectDB();
    await clearDatabase();
    
    const users = await createUsers();
    const systemUser = users.find(u => u.username === 'system');
    
    const challenges = await createChallenges(systemUser);
    await createAchievements();
    await createLearningPaths(systemUser, challenges);
    await createProgress(users);
    
    console.log('\n✨ Seed completed successfully!\n');
    console.log('📝 Login credentials:');
    console.log('   Admin: admin@codementor.ai / Admin123!');
    console.log('   Demo User: john@example.com / Password123!');
    console.log('   Demo User: jane@example.com / Password123!\n');
    
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('✓ Database connection closed');
  }
}

// Run seed if called directly
if (require.main === module) {
  seed();
}

module.exports = seed;
