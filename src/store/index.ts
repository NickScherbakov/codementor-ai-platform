import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User, Challenge, LearningProgress, Achievement } from '@/types'

interface UserState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: { email: string; password: string }) => Promise<void>
  register: (userData: { email: string; password: string; username: string; firstName: string; lastName: string }) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>
  fetchProfile: () => Promise<void>
}

interface ChallengeState {
  challenges: Challenge[]
  currentChallenge: Challenge | null
  isLoadingChallenges: boolean
  submissions: any[]
  fetchChallenges: (filters?: any) => Promise<void>
  generateChallenge: (preferences: any) => Promise<Challenge>
  submitSolution: (challengeId: string, code: string, language: string) => Promise<any>
  setCurrentChallenge: (challenge: Challenge | null) => void
}

interface NotificationItem {
  id: string
  userId: string
  type: 'achievement' | 'challenge_completed' | 'level_up' | 'message' | 'reminder'
  title: string
  message: string
  data?: any
  read: boolean
  createdAt: Date
}

interface ProgressState {
  progress: LearningProgress | null
  achievements: Achievement[]
  notifications: NotificationItem[]
  isLoadingProgress: boolean
  fetchProgress: () => Promise<void>
  fetchAchievements: () => Promise<void>
  fetchNotifications: () => Promise<void>
  markNotificationAsRead: (notificationId: string) => Promise<void>
  addXP: (amount: number) => void
  unlockAchievement: (achievement: Achievement) => void
}

interface AppState {
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean
  currentPage: string
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleSidebar: () => void
  setCurrentPage: (page: string) => void
}

interface AITutorState {
  messages: ChatMessage[]
  isTyping: boolean
  currentTutor: AITutor | null
  sendMessage: (message: string) => Promise<void>
  clearChat: () => void
  changeTutor: (tutorId: string) => void
}

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  reactions?: string[]
}

interface AITutor {
  id: string
  name: string
  personality: string
  avatar: string
  specialization: string[]
}

// User Store
export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,

        login: async (credentials) => {
          set({ isLoading: true })
          try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            const mockUser: User = {
              id: '1',
              email: credentials.email,
              username: 'codementor_user',
              firstName: 'John',
              lastName: 'Doe',
              role: 'student',
              level: 'intermediate',
              preferredLanguages: ['python', 'javascript'],
              learningPath: ['web-development'],
              achievements: [],
              progress: {
                totalXP: 1250,
                level: 5,
                currentStreak: 7,
                longestStreak: 10,
                completedChallenges: 23,
                totalChallenges: 50,
                completedProjects: 8,
                languageProgress: [
                  {
                    language: 'python',
                    level: 4,
                    xp: 800,
                    completedChallenges: 15,
                    totalChallenges: 25,
                    completedLessons: 12,
                    totalLessons: 20,
                    lastActivity: new Date()
                  },
                  {
                    language: 'javascript',
                    level: 3,
                    xp: 450,
                    completedChallenges: 8,
                    totalChallenges: 25,
                    completedLessons: 8,
                    totalLessons: 20,
                    lastActivity: new Date()
                  }
                ],
                skillProgress: [
                  {
                    skill: 'algorithms',
                    level: 3,
                    xp: 600,
                    masteryPercentage: 60
                  },
                  {
                    skill: 'web-development',
                    level: 4,
                    xp: 650,
                    masteryPercentage: 75
                  }
                ]
              },
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date()
            }
            
            set({ 
              user: mockUser, 
              isAuthenticated: true, 
              isLoading: false 
            })
            
            // Store token in localStorage
            localStorage.setItem('authToken', 'mock-jwt-token')
            
          } catch (error) {
            set({ isLoading: false })
            throw error
          }
        },

        register: async (userData) => {
          set({ isLoading: true })
          try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            const newUser: User = {
              id: Date.now().toString(),
              email: userData.email,
              username: userData.username,
              firstName: userData.firstName,
              lastName: userData.lastName,
              role: 'student',
              level: 'beginner',
              preferredLanguages: [],
              learningPath: [],
              achievements: [],
              progress: {
                totalXP: 0,
                level: 1,
                currentStreak: 0,
                longestStreak: 0,
                completedChallenges: 0,
                totalChallenges: 0,
                completedProjects: 0,
                languageProgress: [],
                skillProgress: []
              },
              createdAt: new Date(),
              updatedAt: new Date()
            }
            
            set({ 
              user: newUser, 
              isAuthenticated: true, 
              isLoading: false 
            })
            
            localStorage.setItem('authToken', 'mock-jwt-token')
            
          } catch (error) {
            set({ isLoading: false })
            throw error
          }
        },

        logout: () => {
          set({ 
            user: null, 
            isAuthenticated: false 
          })
          localStorage.removeItem('authToken')
        },

        updateProfile: async (updates) => {
          const { user } = get()
          if (!user) return
          
          set({ isLoading: true })
          try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            const updatedUser = { ...user, ...updates, updatedAt: new Date() }
            set({ user: updatedUser, isLoading: false })
            
          } catch (error) {
            set({ isLoading: false })
            throw error
          }
        },

        fetchProfile: async () => {
          const token = localStorage.getItem('authToken')
          if (!token) return
          
          set({ isLoading: true })
          try {
            // Mock API call to refresh user data
            await new Promise(resolve => setTimeout(resolve, 500))
            set({ isLoading: false })
            
          } catch (error) {
            set({ isLoading: false, isAuthenticated: false, user: null })
            localStorage.removeItem('authToken')
          }
        }
      }),
      {
        name: 'user-storage',
        partialize: (state) => ({ 
          user: state.user, 
          isAuthenticated: state.isAuthenticated 
        })
      }
    )
  )
)

// Challenge Store
export const useChallengeStore = create<ChallengeState>()(
  devtools(
    (set, get) => ({
      challenges: [],
      currentChallenge: null,
      isLoadingChallenges: false,
      submissions: [],

      fetchChallenges: async (filters = {}) => {
        set({ isLoadingChallenges: true })
        try {
          // Mock API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const mockChallenges: Challenge[] = [
            {
              id: '1',
              title: 'Two Sum',
              description: 'Find two numbers that add up to target',
              difficulty: 'easy',
              language: 'python',
              category: 'arrays',
              tags: ['arrays', 'hash-table'],
              starterCode: 'def two_sum(nums, target):\n    pass',
              solution: 'def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []',
              testCases: [],
              hints: [],
              xpReward: 100,
              timeEstimate: 15,
              createdBy: 'system',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            // More mock challenges...
          ]
          
          set({ 
            challenges: mockChallenges, 
            isLoadingChallenges: false 
          })
          
        } catch (error) {
          set({ isLoadingChallenges: false })
          throw error
        }
      },

      generateChallenge: async (preferences) => {
        try {
          // Mock API call to AI engine
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          const generatedChallenge: Challenge = {
            id: Date.now().toString(),
            title: 'Generated Challenge',
            description: 'AI-generated personalized challenge',
            difficulty: preferences.difficulty || 'medium',
            language: preferences.language || 'python',
            category: preferences.topic || 'algorithms',
            tags: [preferences.topic || 'algorithms'],
            starterCode: '# AI-generated starter code',
            solution: '# AI-generated solution',
            testCases: [],
            hints: [],
            xpReward: 150,
            timeEstimate: 20,
            createdBy: 'ai-engine',
            createdAt: new Date(),
            updatedAt: new Date()
          }
          
          return generatedChallenge
          
        } catch (error) {
          throw error
        }
      },

      submitSolution: async (challengeId, code, language) => {
        try {
          // Mock API call
          await new Promise(resolve => setTimeout(resolve, 1500))
          
          const submission = {
            id: Date.now().toString(),
            challengeId,
            code,
            language,
            status: 'accepted',
            score: 100,
            executionTime: 45,
            submittedAt: new Date()
          }
          
          const { submissions } = get()
          set({ submissions: [...submissions, submission] })
          
          return submission
          
        } catch (error) {
          throw error
        }
      },

      setCurrentChallenge: (challenge) => {
        set({ currentChallenge: challenge })
      }
    })
  )
)

// Progress Store
export const useProgressStore = create<ProgressState>()(
  devtools(
    persist(
      (set, get) => ({
        progress: null,
        achievements: [],
        notifications: [],
        isLoadingProgress: false,

        fetchProgress: async () => {
          set({ isLoadingProgress: true })
          try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 800))
            
            // Progress would be fetched from API
            set({ isLoadingProgress: false })
            
          } catch (error) {
            set({ isLoadingProgress: false })
            throw error
          }
        },

        fetchAchievements: async () => {
          try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 500))
            
            const mockAchievements: Achievement[] = [
              {
                id: '1',
                name: 'First Steps',
                description: 'Complete your first coding challenge',
                icon: '🎯',
                category: 'learning',
                points: 50,
                rarity: 'common',
                xpReward: 50,
                unlockedAt: new Date()
              },
              // More achievements...
            ]
            
            set({ achievements: mockAchievements })
            
          } catch (error) {
            throw error
          }
        },

        fetchNotifications: async () => {
          try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 300))
            
            const mockNotifications: NotificationItem[] = [
              {
                id: '1',
                userId: '1',
                type: 'achievement',
                title: 'New Achievement!',
                message: 'You unlocked "Problem Solver" badge',
                read: false,
                createdAt: new Date()
              },
              // More notifications...
            ]
            
            set({ notifications: mockNotifications })
            
          } catch (error) {
            throw error
          }
        },

        markNotificationAsRead: async (notificationId) => {
          try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 200))
            
            const { notifications } = get()
            const updatedNotifications = notifications.map(notif =>
              notif.id === notificationId 
                ? { ...notif, read: true }
                : notif
            )
            
            set({ notifications: updatedNotifications })
            
          } catch (error) {
            throw error
          }
        },

        addXP: (amount) => {
          const { progress } = get()
          if (!progress) return
          
          const newTotalXP = progress.totalXP + amount
          const newLevel = Math.floor(newTotalXP / 250) + 1 // 250 XP per level
          
          set({
            progress: {
              ...progress,
              totalXP: newTotalXP,
              level: newLevel
            }
          })
        },

        unlockAchievement: (achievement) => {
          const { achievements } = get()
          set({ 
            achievements: [...achievements, achievement] 
          })
        }
      }),
      {
        name: 'progress-storage',
        partialize: (state) => ({ 
          progress: state.progress,
          achievements: state.achievements 
        })
      }
    )
  )
)

// App Store
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'system',
        sidebarOpen: true,
        currentPage: 'dashboard',

        setTheme: (theme) => {
          set({ theme })
          
          // Update document class
          const root = document.documentElement
          if (theme === 'dark') {
            root.classList.add('dark')
          } else if (theme === 'light') {
            root.classList.remove('dark')
          } else {
            // System theme
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            root.classList.toggle('dark', prefersDark)
          }
        },

        toggleSidebar: () => {
          set((state) => ({ sidebarOpen: !state.sidebarOpen }))
        },

        setCurrentPage: (page) => {
          set({ currentPage: page })
        }
      }),
      {
        name: 'app-storage',
        partialize: (state) => ({ 
          theme: state.theme,
          sidebarOpen: state.sidebarOpen 
        })
      }
    )
  )
)

// AI Tutor Store
export const useAITutorStore = create<AITutorState>()(
  devtools(
    (set, get) => ({
      messages: [],
      isTyping: false,
      currentTutor: {
        id: 'encouraging-tutor',
        name: 'Alex',
        personality: 'encouraging',
        avatar: '🤖',
        specialization: ['python', 'javascript', 'algorithms']
      },

      sendMessage: async (message) => {
        const { messages, currentTutor } = get()
        
        // Add user message
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'user',
          content: message,
          timestamp: new Date()
        }
        
        set({ 
          messages: [...messages, userMessage],
          isTyping: true 
        })
        
        try {
          // Mock AI response
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: `Great question! Let me help you with that. As your ${currentTutor?.personality} tutor, I'd suggest breaking this down step by step...`,
            timestamp: new Date()
          }
          
          const { messages: currentMessages } = get()
          set({ 
            messages: [...currentMessages, aiMessage],
            isTyping: false 
          })
          
        } catch (error) {
          set({ isTyping: false })
          throw error
        }
      },

      clearChat: () => {
        set({ messages: [] })
      },

      changeTutor: (tutorId) => {
        // Mock tutor data
        const tutors: { [key: string]: AITutor } = {
          'encouraging-tutor': {
            id: 'encouraging-tutor',
            name: 'Alex',
            personality: 'encouraging',
            avatar: '🤖',
            specialization: ['python', 'javascript']
          },
          'analytical-tutor': {
            id: 'analytical-tutor',
            name: 'Ada',
            personality: 'analytical',
            avatar: '🔬',
            specialization: ['algorithms', 'data-structures']
          }
        }
        
        const tutor = tutors[tutorId]
        if (tutor) {
          set({ currentTutor: tutor, messages: [] })
        }
      }
    })
  )
)