# 🤝 Contributing to CodeMentor AI

Thank you for your interest in contributing to CodeMentor AI! This project thrives on community contributions and we welcome developers of all skill levels.

## 🎯 Ways to Contribute

### 🐛 Bug Reports & Feature Requests
- Report bugs via [GitHub Issues](https://github.com/codementor-ai/platform/issues)
- Suggest new features or improvements
- Help with documentation improvements

### 💻 Code Contributions
- Fix bugs and implement new features
- Improve AI algorithms and learning paths
- Enhance user interface and experience
- Add support for new programming languages

### 🎓 Educational Content
- Create new coding challenges
- Design learning paths and curricula
- Write tutorials and guides
- Contribute to AI tutor knowledge base

### 🌍 Community Support
- Help newcomers in discussions
- Review pull requests
- Mentor other contributors
- Share CodeMentor AI with others

## 🚀 Getting Started

### 1. Set Up Development Environment

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/codementor-ai-platform.git
cd codementor-ai-platform

# Install dependencies
npm install
cd backend && npm install && cd ..
cd ai-engine && pip install -r requirements.txt && cd ..

# Set up environment variables
cp .env.example .env
cp backend/.env.example backend/.env
cp ai-engine/.env.example ai-engine/.env

# Start development servers
npm run dev:all
```

### 2. Project Structure
```
codementor-ai/
├── src/                    # Frontend (Next.js + TypeScript)
│   ├── app/               # App router pages
│   ├── components/        # Reusable components
│   ├── hooks/            # Custom React hooks
│   └── store/            # State management
├── backend/               # Backend (Node.js + Express)
│   ├── models/           # Database models
│   ├── routes/           # API endpoints
│   └── middleware/       # Custom middleware
├── ai-engine/            # AI Service (Python + Flask)
│   ├── services/         # AI/ML services
│   └── models/           # ML models
└── docs/                 # Documentation
```

## 📋 Contribution Guidelines

### Code Standards

#### Frontend (TypeScript/React)
```typescript
// Use TypeScript with strict mode
interface ChallengeProps {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  onComplete: (result: CompletionResult) => void
}

// Follow React best practices
const Challenge: React.FC<ChallengeProps> = ({ id, title, difficulty, onComplete }) => {
  const [isLoading, setIsLoading] = useState(false)
  
  // Use custom hooks for logic
  const { submitSolution, isSubmitting } = useChallenge(id)
  
  return (
    <div className="challenge-container">
      {/* Component JSX */}
    </div>
  )
}

// Export with proper typing
export default Challenge
export type { ChallengeProps }
```

#### Backend (Node.js)
```javascript
// Use async/await consistently
const createChallenge = async (req, res) => {
  try {
    const { title, description, difficulty } = req.body
    
    // Validate input
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      })
    }
    
    // Create challenge
    const challenge = new Challenge({ title, description, difficulty })
    await challenge.save()
    
    res.status(201).json({
      success: true,
      data: challenge
    })
    
  } catch (error) {
    console.error('Create challenge error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

module.exports = { createChallenge }
```

#### AI Engine (Python)
```python
"""
AI Engine Contribution Guidelines
"""

class ChallengeGenerator:
    """
    Generate adaptive programming challenges based on user profile.
    
    Attributes:
        difficulty_levels: Supported difficulty levels
        languages: Supported programming languages
    """
    
    def __init__(self):
        self.difficulty_levels = ['easy', 'medium', 'hard', 'expert']
        self.languages = ['python', 'javascript', 'java', 'cpp']
    
    def generate_challenge(
        self, 
        user_profile: Dict[str, Any], 
        topic: str,
        difficulty: str = 'medium'
    ) -> Dict[str, Any]:
        """
        Generate a personalized challenge.
        
        Args:
            user_profile: User's learning history and preferences
            topic: Challenge topic (algorithms, data-structures, etc.)
            difficulty: Target difficulty level
            
        Returns:
            Dict containing challenge data
            
        Raises:
            ValueError: If invalid difficulty or topic provided
        """
        if difficulty not in self.difficulty_levels:
            raise ValueError(f"Unsupported difficulty: {difficulty}")
        
        # Implementation here
        challenge_data = self._create_challenge_content(user_profile, topic, difficulty)
        
        return challenge_data
    
    def _create_challenge_content(
        self, 
        user_profile: Dict[str, Any],
        topic: str, 
        difficulty: str
    ) -> Dict[str, Any]:
        """Private method to create challenge content."""
        # Implementation details
        pass
```

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(ai-tutor): add personality-based response generation

- Implement different tutor personalities (encouraging, analytical, creative)
- Add personality selection in user preferences
- Update AI response templates for each personality type

Closes #123
```

```
fix(backend): resolve memory leak in WebSocket connections

- Properly clean up event listeners on disconnect
- Add connection timeout handling
- Implement graceful shutdown for WebSocket server

Fixes #456
```

## 🎯 Specific Contribution Areas

### 1. 🤖 AI/ML Improvements

#### Challenge Generation Algorithm
```python
# Example: Improve difficulty estimation
def estimate_challenge_difficulty(challenge_data):
    """
    Contribute to making difficulty estimation more accurate.
    
    Current factors:
    - Code complexity metrics
    - Required algorithm knowledge
    - Time complexity analysis
    
    Areas for improvement:
    - User success rate analysis
    - Cognitive load assessment
    - Learning curve prediction
    """
    complexity_score = analyze_code_complexity(challenge_data['solution'])
    algorithm_difficulty = rate_algorithm_difficulty(challenge_data['concepts'])
    
    # Your improvements here
    enhanced_score = your_difficulty_algorithm(complexity_score, algorithm_difficulty)
    
    return enhanced_score
```

#### AI Tutor Personality Enhancement
```python
# Example: Add new tutor personality
class CreativeTutor(BaseTutor):
    """
    Creative and inspiring tutor personality.
    
    Characteristics:
    - Uses analogies and metaphors
    - Encourages creative problem-solving
    - Focuses on multiple solution approaches
    """
    
    def generate_response(self, user_question, context):
        """
        Generate creative, inspiring responses to user questions.
        """
        # Use creative language patterns
        response = self._add_creative_analogies(user_question, context)
        response = self._suggest_alternative_approaches(response, context)
        response = self._add_inspirational_elements(response)
        
        return response
    
    def _add_creative_analogies(self, question, context):
        """Add programming analogies to explanations."""
        # Your creative implementations here
        pass
```

### 2. 🎮 Gamification Features

#### New Achievement Types
```typescript
// Example: Add collaborative achievements
interface CollaborativeAchievement extends BaseAchievement {
  type: 'collaborative'
  requirements: {
    sessionsCompleted: number
    peersHelped: number
    mentorshipHours: number
  }
}

const newAchievements: CollaborativeAchievement[] = [
  {
    id: 'team_player',
    name: '🤝 Team Player',
    description: 'Complete 10 collaborative coding sessions',
    type: 'collaborative',
    rarity: 'common',
    requirements: {
      sessionsCompleted: 10,
      peersHelped: 0,
      mentorshipHours: 0
    },
    xpReward: 250
  },
  
  {
    id: 'mentor_extraordinaire', 
    name: '🎓 Mentor Extraordinaire',
    description: 'Provide 20 hours of mentorship to fellow learners',
    type: 'collaborative',
    rarity: 'legendary',
    requirements: {
      sessionsCompleted: 0,
      peersHelped: 0,
      mentorshipHours: 20
    },
    xpReward: 2000
  }
]
```

#### Progress Visualization Improvements
```typescript
// Example: Add skill radar chart
interface SkillRadarProps {
  skills: SkillProgress[]
  animated?: boolean
}

const SkillRadar: React.FC<SkillRadarProps> = ({ skills, animated = true }) => {
  // Contribute enhanced visualizations
  const chartData = useMemo(() => {
    return skills.map(skill => ({
      skill: skill.name,
      level: skill.level,
      progress: skill.progressPercentage
    }))
  }, [skills])
  
  return (
    <ResponsiveRadar
      data={chartData}
      // Your visualization improvements here
      animate={animated}
      motionStiffness={90}
      motionDamping={15}
    />
  )
}
```

### 3. 🌐 New Programming Language Support

#### Adding Language Support
```typescript
// Example: Add Rust language support
interface LanguageConfig {
  id: string
  name: string
  extension: string
  monacoLanguage: string
  executeCommand: string
  starterTemplate: string
  commonPatterns: CodePattern[]
}

const rustConfig: LanguageConfig = {
  id: 'rust',
  name: 'Rust',
  extension: '.rs',
  monacoLanguage: 'rust',
  executeCommand: 'rustc {file} && ./main',
  starterTemplate: `
fn main() {
    // Your Rust code here
    println!("Hello, CodeMentor AI!");
}
  `,
  commonPatterns: [
    {
      name: 'ownership',
      description: 'Rust ownership and borrowing patterns',
      examples: ['&str vs String', 'mutable references', 'lifetime parameters']
    }
  ]
}

// Register new language
registerLanguage(rustConfig)
```

#### Challenge Templates for New Languages
```rust
// Example: Rust challenge template
/*
Challenge: Implement a simple vector operations library

Learning objectives:
- Understand Rust ownership model
- Practice with generic types
- Learn error handling with Result<T, E>
*/

#[derive(Debug, Clone)]
pub struct Vector3D<T> {
    pub x: T,
    pub y: T,
    pub z: T,
}

impl<T> Vector3D<T> 
where 
    T: Copy + std::ops::Add<Output = T> + std::ops::Mul<Output = T>
{
    pub fn new(x: T, y: T, z: T) -> Self {
        // Your implementation here
    }
    
    pub fn dot_product(&self, other: &Vector3D<T>) -> T {
        // Your implementation here
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_vector_creation() {
        let v = Vector3D::new(1.0, 2.0, 3.0);
        assert_eq!(v.x, 1.0);
        assert_eq!(v.y, 2.0);
        assert_eq!(v.z, 3.0);
    }
}
```

## 🧪 Testing Guidelines

### Frontend Testing
```typescript
// Example: Component testing with Jest and RTL
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CodingChallenge } from '@/components/CodingChallenge'

describe('CodingChallenge Component', () => {
  const mockChallenge = {
    id: 'test-challenge',
    title: 'Two Sum',
    description: 'Find two numbers that add up to target',
    difficulty: 'easy' as const,
    starterCode: 'def two_sum(nums, target):\n    pass'
  }

  test('renders challenge information correctly', () => {
    render(<CodingChallenge challenge={mockChallenge} />)
    
    expect(screen.getByText('Two Sum')).toBeInTheDocument()
    expect(screen.getByText(/Find two numbers/)).toBeInTheDocument()
    expect(screen.getByText('easy')).toBeInTheDocument()
  })

  test('allows code editing and submission', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    
    render(<CodingChallenge challenge={mockChallenge} onSubmit={onSubmit} />)
    
    // Type in the code editor
    const codeEditor = screen.getByRole('textbox')
    await user.type(codeEditor, 'return [0, 1]')
    
    // Submit solution
    const submitButton = screen.getByRole('button', { name: /run code/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          code: expect.stringContaining('return [0, 1]')
        })
      )
    })
  })
})
```

### Backend Testing
```javascript
// Example: API endpoint testing
const request = require('supertest')
const app = require('../server')
const Challenge = require('../models/Challenge')

describe('POST /api/challenges', () => {
  beforeEach(async () => {
    await Challenge.deleteMany({})
  })

  test('should create new challenge with valid data', async () => {
    const challengeData = {
      title: 'Test Challenge',
      description: 'Test description',
      difficulty: 'medium',
      language: 'python'
    }

    const response = await request(app)
      .post('/api/challenges')
      .send(challengeData)
      .expect(201)

    expect(response.body.success).toBe(true)
    expect(response.body.data.title).toBe(challengeData.title)
    
    // Verify database
    const savedChallenge = await Challenge.findById(response.body.data.id)
    expect(savedChallenge).toBeTruthy()
    expect(savedChallenge.title).toBe(challengeData.title)
  })

  test('should reject challenge with missing required fields', async () => {
    const invalidData = {
      description: 'Missing title and difficulty'
    }

    const response = await request(app)
      .post('/api/challenges')
      .send(invalidData)
      .expect(400)

    expect(response.body.success).toBe(false)
    expect(response.body.errors).toContain('Title is required')
  })
})
```

### AI Engine Testing
```python
# Example: AI service testing
import pytest
from unittest.mock import patch, MagicMock
from ai_engine.services.challenge_generator import ChallengeGenerator

class TestChallengeGenerator:
    
    def setup_method(self):
        self.generator = ChallengeGenerator()
        
    def test_generate_easy_python_challenge(self):
        """Test basic challenge generation for Python beginners."""
        user_profile = {
            'level': 'beginner',
            'preferred_language': 'python',
            'completed_topics': ['variables', 'loops']
        }
        
        challenge = self.generator.generate_challenge(
            user_profile=user_profile,
            topic='arrays',
            difficulty='easy'
        )
        
        assert challenge['difficulty'] == 'easy'
        assert challenge['language'] == 'python'
        assert 'def ' in challenge['starter_code']
        assert len(challenge['test_cases']) >= 3
        assert challenge['xp_reward'] > 0
        
    @patch('ai_engine.services.openai_client.ChatCompletion.create')
    def test_ai_powered_challenge_creation(self, mock_openai):
        """Test AI integration for challenge content generation."""
        mock_response = MagicMock()
        mock_response.choices[0].message.content = "Generated challenge content"
        mock_openai.return_value = mock_response
        
        user_profile = {'level': 'intermediate'}
        
        challenge = self.generator.generate_challenge(
            user_profile=user_profile,
            topic='algorithms',
            difficulty='medium'
        )
        
        mock_openai.assert_called_once()
        assert challenge is not None
        
    def test_difficulty_validation(self):
        """Test that invalid difficulty levels are rejected."""
        with pytest.raises(ValueError, match="Unsupported difficulty"):
            self.generator.generate_challenge(
                user_profile={},
                topic='arrays',
                difficulty='impossible'
            )
```

## 📚 Documentation Contributions

### API Documentation
```yaml
# Example: OpenAPI specification contribution
paths:
  /api/challenges/{id}/submissions:
    post:
      summary: Submit solution for a challenge
      description: |
        Submit a code solution for evaluation. The solution will be tested
        against predefined test cases and receive feedback from the AI tutor.
      parameters:
        - name: id
          in: path
          required: true
          description: Challenge unique identifier
          schema:
            type: string
            example: "challenge_12345"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - code
                - language
              properties:
                code:
                  type: string
                  description: The submitted solution code
                  example: |
                    def two_sum(nums, target):
                        seen = {}
                        for i, num in enumerate(nums):
                            complement = target - num
                            if complement in seen:
                                return [seen[complement], i]
                            seen[num] = i
                        return []
                language:
                  type: string
                  enum: [python, javascript, java, cpp, rust]
                  example: "python"
      responses:
        '200':
          description: Submission processed successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  submission_id:
                    type: string
                    example: "sub_67890"
                  results:
                    type: object
                    properties:
                      status:
                        type: string
                        enum: [accepted, wrong_answer, runtime_error, time_limit_exceeded]
                      test_results:
                        type: array
                        items:
                          type: object
                          properties:
                            test_case_id:
                              type: string
                            passed:
                              type: boolean
                            execution_time:
                              type: number
                            memory_used:
                              type: number
```

## 🎉 Recognition & Rewards

### Contributor Levels
- **🌱 Newcomer** (1-5 PRs): Welcome badge + Discord access
- **⭐ Regular** (6-20 PRs): Contributor badge + Beta feature access  
- **🚀 Champion** (21-50 PRs): Champion badge + Direct maintainer communication
- **💎 Core Team** (50+ PRs): Core team invitation + Decision making participation

### Hall of Fame
Contributors will be recognized in:
- Project README
- Annual contributor report
- CodeMentor AI platform credits
- Conference talk acknowledgments

### Special Contribution Opportunities
- **🎓 Educational Content Creator**: Design learning paths and tutorials
- **🤖 AI Trainer**: Help improve AI tutor responses and accuracy
- **🌍 Localization Lead**: Translate content for global accessibility
- **🎮 Gamification Designer**: Create engaging learning mechanics

## 📞 Getting Help

### Community Channels
- **GitHub Discussions**: Technical questions and feature discussions
- **Discord Server**: Real-time chat with maintainers and contributors
- **Monthly Contributor Calls**: Video meetings for planning and updates
- **Mentorship Program**: Pair new contributors with experienced ones

### Maintainer Contact
- **Project Lead**: @codementor-ai-team
- **Technical Lead**: @ai-architect
- **Community Manager**: @community-lead

---

## 🚀 Ready to Contribute?

1. **Pick an Issue**: Browse [good first issues](https://github.com/codementor-ai/platform/labels/good%20first%20issue)
2. **Join Discord**: Get real-time help from the community
3. **Fork & Clone**: Set up your development environment
4. **Make Magic**: Build something awesome
5. **Share**: Submit your PR and celebrate! 🎉

**Together, we're building the future of programming education!**

---

*Thank you for considering contributing to CodeMentor AI. Every contribution, no matter how small, makes a difference in helping people learn to code more effectively.*