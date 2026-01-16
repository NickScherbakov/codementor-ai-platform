'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

const stats = [
  { label: 'Active Developers', value: '50K+', color: 'from-blue-500 to-cyan-500' },
  { label: 'Code Reviews', value: '1M+', color: 'from-purple-500 to-pink-500' },
  { label: 'Success Rate', value: '94%', color: 'from-green-500 to-emerald-500' },
  { label: 'Languages', value: '15+', color: 'from-orange-500 to-red-500' },
];

export function Stats() {
  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl transform group-hover:scale-105 transition-transform duration-300" />
              <div className="relative p-8 text-center">
                <div className={`text-5xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-white/90 font-medium">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Join the Future of
            <span className="block">Coding Education</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start your journey today and experience revolutionary AI-powered mentorship.
            No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl shadow-blue-900/20 group"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                Schedule Demo
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-blue-100">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Free forever plan
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
