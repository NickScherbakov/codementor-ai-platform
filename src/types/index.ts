// User types
export interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  profileImage?: string
  role?: string
  level?: string
  preferredLanguages?: string[]
  learningPath?: string[]
  createdAt: Date
  updatedAt: Date
  preferences?: UserPreferences
  progress: LearningProgress
  achievements: Achievement[]
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  preferredProgrammingLanguages: string[]
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  notifications: NotificationSettings
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  achievements: boolean
  reminders: boolean
  weeklyProgress: boolean
}

// Learning types
export interface LearningProgress {
  totalXP: number
  level: number
  currentStreak: number
  longestStreak: number
  completedChallenges: number
  totalChallenges: number
  completedProjects: number
  languageProgress: LanguageProgress[]
  skillProgress: SkillProgress[]
}

export interface LanguageProgress {
  language: string
  xp: number
  level: number
  completedLessons: number
  totalLessons: number
  completedChallenges: number
  totalChallenges: number
  lastActivity: Date
}

export interface SkillProgress {
  skill: string
  level: number
  xp: number
  masteryPercentage: number
}

// Challenge types
export interface Challenge {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  language: string
  category: string
  tags: string[]
  xpReward: number
  timeEstimate: number
  starterCode: string
  solution: string
  testCases: TestCase[]
  hints: Hint[]
  createdBy?: string
  createdAt: Date
  updatedAt: Date
}

export interface TestCase {
  id: string
  input: any
  expectedOutput: any
  isHidden: boolean
  explanation?: string
}

export interface Hint {
  id: string
  content: string
  unlockAfter: number // seconds
  xpCost: number
}

// Achievement types
export interface Achievement {
  id: string
  name?: string
  title?: string
  description: string
  icon: string
  category: string
  points?: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  xpReward: number
  unlockedAt?: Date
  progress?: number
  maxProgress?: number
}

// Code execution types
export interface CodeExecution {
  id: string
  code: string
  language: string
  input?: string
  output?: string
  error?: string
  executionTime?: number
  memoryUsage?: number
  status: 'pending' | 'running' | 'completed' | 'error' | 'timeout'
  createdAt: Date
}

// AI Tutor types
export interface AIResponse {
  id: string
  type: 'explanation' | 'hint' | 'feedback' | 'suggestion'
  content: string
  confidence: number
  sources?: string[]
  followUpQuestions?: string[]
}

export interface LearningPath {
  id: string
  title: string
  description: string
  difficulty: string
  estimatedTime: number
  prerequisites: string[]
  modules: LearningModule[]
  progress: number
}

export interface LearningModule {
  id: string
  title: string
  description: string
  type: 'lesson' | 'challenge' | 'project' | 'quiz'
  content: string
  estimatedTime: number
  isCompleted: boolean
  xpReward: number
}

// Real-time collaboration types
export interface CollaborationSession {
  id: string
  title: string
  participants: User[]
  code: string
  language: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ChatMessage {
  id: string
  userId: string
  username: string
  content: string
  timestamp: Date
  type: 'text' | 'code' | 'system'
}

// Notification types
export interface Notification {
  id: string
  userId: string
  type: 'achievement' | 'challenge_completed' | 'level_up' | 'message' | 'reminder'
  title: string
  message: string
  data?: any
  read: boolean
  createdAt: Date
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
}

export interface ProfileUpdateForm {
  username?: string
  firstName?: string
  lastName?: string
  profileImage?: File
}

// Component props types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  theme?: 'light' | 'dark'
  readOnly?: boolean
  height?: string
  options?: any
}