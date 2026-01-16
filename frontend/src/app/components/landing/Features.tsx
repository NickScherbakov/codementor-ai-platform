'use client';

import { motion } from 'framer-motion';
import { Brain, Code, Target, Users, Zap, Trophy, BookOpen, Lightbulb, Shield, Rocket } from 'lucide-react';
import { Card } from '../ui/card';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Mentorship',
    description: 'Get personalized guidance from advanced AI that adapts to your learning style and pace.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Code,
    title: 'Real-time Code Review',
    description: 'Receive instant feedback on your code with suggestions for improvement and best practices.',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Target,
    title: 'Adaptive Learning Paths',
    description: 'Follow customized tracks that adjust difficulty based on your progress and goals.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Instant Feedback',
    description: 'Get immediate insights on your code quality, performance, and potential improvements.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Trophy,
    title: 'Skill Assessment',
    description: 'Track your progress with comprehensive assessments and coding challenges.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Users,
    title: 'Collaborative Learning',
    description: 'Code together with peers and mentors in real-time collaborative environment.',
    gradient: 'from-red-500 to-pink-500',
  },
  {
    icon: Shield,
    title: 'Security Analysis',
    description: 'Automated security vulnerability scanning and best practice recommendations.',
    gradient: 'from-slate-500 to-zinc-500',
  },
  {
    icon: BookOpen,
    title: 'Multi-Language Support',
    description: 'Learn multiple programming languages including JavaScript, Python, and more.',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Rocket,
    title: 'Career Growth',
    description: 'Build your portfolio and track achievements to showcase your progress.',
    gradient: 'from-violet-500 to-fuchsia-500',
  },
];

export function Features() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Revolutionary Features</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Everything You Need to
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Master Programming
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Powerful AI-driven tools designed to accelerate your learning journey
            and help you become a better developer.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group relative overflow-hidden border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-xl h-full">
                <div className="p-6 space-y-4">
                  {/* Icon with Gradient Background */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} p-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover Effect Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-slate-600 mb-4">Ready to experience the future of coding education?</p>
          <div className="inline-flex items-center gap-2 text-blue-600 font-semibold cursor-pointer group">
            <span>Explore all features</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
