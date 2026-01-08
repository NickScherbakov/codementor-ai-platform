export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'info'

export type NextStep = {
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  estimatedTime: string
}

export type Finding = {
  severity: SeverityLevel
  title: string
  description: string
  category?: string
  lineNumbers?: string
  impact?: string
  effort?: string
  codeSnippet?: string
}
