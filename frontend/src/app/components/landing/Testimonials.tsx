'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { Card } from '../ui/card';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Frontend Developer',
    company: 'Tech Startup',
    avatar: 'SC',
    rating: 5,
    text: 'CodeMentor AI completely transformed how I learn. The AI feedback is incredibly detailed and helped me catch security issues I never would have noticed.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Michael Rodriguez',
    role: 'Full Stack Engineer',
    company: 'Fortune 500',
    avatar: 'MR',
    rating: 5,
    text: 'The Hard Review mode is brutal but exactly what I needed. It pushed me to write production-grade code and improved my skills dramatically.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Priya Patel',
    role: 'Junior Developer',
    company: 'Startup',
    avatar: 'PP',
    rating: 5,
    text: 'As a beginner, the AI Mentorship mode was perfect. It explained concepts in a way I could understand and adapted to my learning pace.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    name: 'Alex Kim',
    role: 'Senior Developer',
    company: 'Tech Company',
    avatar: 'AK',
    rating: 5,
    text: 'The real-time code analysis is impressive. It caught performance issues and suggested optimizations I hadn\'t considered. Worth every penny.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    name: 'Emily Zhang',
    role: 'CS Student',
    company: 'University',
    avatar: 'EZ',
    rating: 5,
    text: 'This platform made learning algorithms so much easier. The interactive examples and instant feedback helped me ace my coding interviews.',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    name: 'David Brown',
    role: 'Tech Lead',
    company: 'Enterprise',
    avatar: 'DB',
    rating: 5,
    text: 'I use this to review my team\'s code patterns. The AI insights help us maintain consistent code quality across the entire organization.',
    gradient: 'from-teal-500 to-cyan-500',
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full mb-6 border border-blue-100">
            <Quote className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Wall of Love</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Loved by Developers
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Worldwide
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Join thousands of developers who have accelerated their learning journey with CodeMentor AI.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group relative overflow-hidden border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-xl h-full">
                <div className="p-6 space-y-4">
                  {/* Quote Icon */}
                  <div className="flex items-start justify-between">
                    <Quote className={`w-8 h-8 bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent opacity-50`} />
                    {/* Rating */}
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-slate-700 leading-relaxed">
                    &quot;{testimonial.text}&quot;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold shadow-lg`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-slate-600">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '4.9/5', label: 'Average Rating' },
            { value: '50K+', label: 'Happy Developers' },
            { value: '1M+', label: 'Code Reviews' },
            { value: '94%', label: 'Would Recommend' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-600">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
