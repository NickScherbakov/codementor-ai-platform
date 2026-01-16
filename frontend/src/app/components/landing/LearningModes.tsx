'use client';

import { motion } from 'framer-motion';
import { Brain, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';

export function LearningModes() {
  const modes = [
    {
      icon: Brain,
      title: 'AI Mentorship Mode',
      subtitle: 'Patient & Adaptive',
      description: 'A gentle, supportive AI tutor that adapts to your learning pace. Perfect for beginners or when learning new concepts.',
      features: [
        'Personalized learning paths',
        'Interactive code examples',
        'Step-by-step explanations',
        'Progress tracking',
      ],
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      buttonText: 'Start Learning',
      href: '/dashboard',
    },
    {
      icon: AlertTriangle,
      title: 'Hard Review Mode',
      subtitle: 'Brutal & Honest',
      description: 'Simulates a senior engineer code review. It won\'t hold back. Perfect for experienced developers who want real feedback.',
      features: [
        'Security vulnerability analysis',
        'Performance optimization tips',
        'Best practices enforcement',
        'Production-ready suggestions',
      ],
      gradient: 'from-red-500 via-orange-500 to-yellow-500',
      buttonText: 'Get Roasted',
      href: '/review',
    },
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Choose Your
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Learning Style
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Whether you need encouragement or tough love, we've got the perfect learning mode for you.
          </p>
        </motion.div>

        {/* Modes Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {modes.map((mode, index) => (
            <motion.div
              key={mode.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="group relative overflow-hidden border-2 hover:border-slate-300 transition-all duration-300 hover:shadow-2xl h-full">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Animated Gradient Border Effect */}
                <div className={`absolute -inset-[2px] bg-gradient-to-r ${mode.gradient} opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500`} />

                <div className="relative p-8 space-y-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mode.gradient} p-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <mode.icon className="w-full h-full text-white" />
                  </div>

                  {/* Title */}
                  <div>
                    <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      {mode.subtitle}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {mode.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 leading-relaxed">
                    {mode.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3">
                    {mode.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link href={mode.href}>
                    <Button 
                      className={`w-full group/btn ${
                        mode.href === '/dashboard' 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                          : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700'
                      } text-white shadow-lg`}
                      size="lg"
                    >
                      {mode.buttonText}
                      <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-600">
            Not sure which mode to choose? You can switch between them anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
