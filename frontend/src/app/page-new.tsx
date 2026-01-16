import { Navigation } from './components/landing/Navigation';
import { Hero } from './components/landing/Hero';
import { LearningModes } from './components/landing/LearningModes';
import { Features } from './components/landing/Features';
import { CodeDemo } from './components/landing/CodeDemo';
import { Testimonials } from './components/landing/Testimonials';
import { Stats } from './components/landing/Stats';
import { Footer } from './components/landing/Footer';

export default function HomePage() {
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
