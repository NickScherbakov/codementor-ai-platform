/**
 * Seed Challenge Library
 * Populates the database with a comprehensive set of coding challenges
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Challenge = require('../models/Challenge');
const User = require('../models/User');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codementor-ai';

async function seedChallenges() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find or create admin user for challenge creation
    let adminUser = await User.findOne({ email: 'admin@codementor-ai.com' });
    
    if (!adminUser) {
      console.log('Creating admin user...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      adminUser = new User({
        username: 'admin',
        email: 'admin@codementor-ai.com',
        password: hashedPassword,
        isAdmin: true,
        firstName: 'Admin',
        lastName: 'User'
      });
      await adminUser.save();
      console.log('✅ Admin user created');
    }

    // Load challenge library
    const challengeLibraryPath = path.join(__dirname, '../data/challenge-library.json');
    const challengeData = JSON.parse(fs.readFileSync(challengeLibraryPath, 'utf8'));

    console.log(`📚 Loading ${challengeData.length} challenges...`);

    // Clear existing challenges (optional - comment out if you want to preserve existing)
    // await Challenge.deleteMany({ isCommunityGenerated: false });
    // console.log('🗑️  Cleared existing system challenges');

    let addedCount = 0;
    let skippedCount = 0;

    for (const challengeInfo of challengeData) {
      // Check if challenge already exists
      const existing = await Challenge.findOne({ 
        title: challengeInfo.title,
        difficulty: challengeInfo.difficulty 
      });

      if (existing) {
        console.log(`⏭️  Skipped: ${challengeInfo.title} (already exists)`);
        skippedCount++;
        continue;
      }

      // Generate starter code and test cases for each challenge
      const starterCode = new Map();
      const solution = new Map();
      
      challengeInfo.languages.forEach(lang => {
        starterCode.set(lang, generateStarterCode(lang, challengeInfo.title));
        solution.set(lang, '// Solution hidden');
      });

      const challenge = new Challenge({
        title: challengeInfo.title,
        description: challengeInfo.description,
        difficulty: challengeInfo.difficulty,
        category: challengeInfo.category,
        tags: challengeInfo.tags,
        languages: challengeInfo.languages,
        starterCode: starterCode,
        solution: solution,
        testCases: generateTestCases(challengeInfo.title, challengeInfo.category),
        hints: generateHints(challengeInfo.title, challengeInfo.difficulty),
        xpReward: challengeInfo.xpReward,
        estimatedTime: challengeInfo.estimatedTime,
        learningObjectives: challengeInfo.learningObjectives,
        createdBy: adminUser._id,
        isPublished: true,
        isCommunityGenerated: false,
        featured: ['Two Sum', 'Valid Parentheses', 'Maximum Subarray', 'LRU Cache', 'Serialize and Deserialize Binary Tree'].includes(challengeInfo.title)
      });

      await challenge.save();
      console.log(`✅ Added: ${challengeInfo.title} (${challengeInfo.difficulty})`);
      addedCount++;
    }

    console.log(`\n🎉 Seeding complete!`);
    console.log(`   Added: ${addedCount} challenges`);
    console.log(`   Skipped: ${skippedCount} challenges`);
    console.log(`   Total in library: ${challengeData.length}`);

  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
  }
}

function generateStarterCode(language, title) {
  const functionName = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_');

  switch (language) {
    case 'python':
      return `def ${functionName}(input_data):\n    \"\"\"\n    TODO: Implement your solution here\n    \"\"\"\n    pass`;
    case 'javascript':
      return `function ${functionName.replace(/_/g, '')}(inputData) {\n    // TODO: Implement your solution here\n}`;
    case 'java':
      const javaFunctionName = functionName.replace(/_(\w)/g, (_, c) => c.toUpperCase());
      return `public static Object ${javaFunctionName}(Object inputData) {\n    // TODO: Implement your solution here\n    return null;\n}`;
    case 'cpp':
      return `#include <vector>\n#include <string>\nusing namespace std;\n\nauto ${functionName}(auto input_data) {\n    // TODO: Implement your solution here\n}`;
    case 'typescript':
      return `function ${functionName.replace(/_/g, '')}(inputData: any): any {\n    // TODO: Implement your solution here\n}`;
    default:
      return `// ${language} starter code\n// TODO: Implement your solution here`;
  }
}

function generateTestCases(title, category) {
  // Generate basic test cases (these would be customized per challenge in production)
  return [
    {
      input: 'example_input_1',
      expectedOutput: 'example_output_1',
      isHidden: false,
      weight: 1
    },
    {
      input: 'test_input_2',
      expectedOutput: 'test_output_2',
      isHidden: false,
      weight: 1
    },
    {
      input: 'edge_case_1',
      expectedOutput: 'edge_output_1',
      isHidden: true,
      weight: 2
    },
    {
      input: 'edge_case_2',
      expectedOutput: 'edge_output_2',
      isHidden: true,
      weight: 2
    }
  ];
}

function generateHints(title, difficulty) {
  const hints = [];
  
  if (difficulty === 'beginner') {
    hints.push(
      {
        order: 1,
        content: 'Start by understanding the problem requirements. What is the input and what should the output be?',
        unlockedAfterAttempts: 0
      },
      {
        order: 2,
        content: 'Think about the simplest approach first, even if it\'s not the most efficient.',
        unlockedAfterAttempts: 1
      },
      {
        order: 3,
        content: 'Consider edge cases: empty input, single element, negative numbers, etc.',
        unlockedAfterAttempts: 2
      }
    );
  } else if (difficulty === 'intermediate') {
    hints.push(
      {
        order: 1,
        content: 'What data structures would be most appropriate for this problem?',
        unlockedAfterAttempts: 0
      },
      {
        order: 2,
        content: 'Can you optimize the time complexity? Think about trading space for time.',
        unlockedAfterAttempts: 1
      },
      {
        order: 3,
        content: 'Consider using dynamic programming, two pointers, or hash maps if applicable.',
        unlockedAfterAttempts: 2
      }
    );
  } else {
    hints.push(
      {
        order: 1,
        content: 'This problem requires advanced techniques. Consider graph algorithms, advanced dynamic programming, or system design patterns.',
        unlockedAfterAttempts: 0
      },
      {
        order: 2,
        content: 'Analyze the time and space complexity requirements carefully.',
        unlockedAfterAttempts: 2
      },
      {
        order: 3,
        content: 'Look for patterns in similar problems and adapt known solutions.',
        unlockedAfterAttempts: 3
      }
    );
  }
  
  return hints;
}

// Run the seeder
if (require.main === module) {
  seedChallenges();
}

module.exports = { seedChallenges };
