'use client';

import { useHashScroll } from '@/hooks/useHashScroll';
import { CodeDemo } from './components/landing/CodeDemo';
import { Features } from './components/landing/Features';
import { Footer } from './components/landing/Footer';
import { Hero } from './components/landing/Hero';
import { LearningModes } from './components/landing/LearningModes';
import { Navigation } from './components/landing/Navigation';
import { Stats } from './components/landing/Stats';
import { Testimonials } from './components/landing/Testimonials';

export default function HomePage() {
  // Enable smooth anchor scrolling with fixed header offset
  useHashScroll(64); // 64px offset for fixed navigation

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <LearningModes />
      <Features />
      <CodeDemo />
      <Testimonials />
      <Stats />
      <Footer />
    </div>
  );
}
