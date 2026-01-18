'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Brain, Code, BookOpen, Target, Trophy } from 'lucide-react';
import { Button } from './ui/button';

interface HelpModalProps {
  show: boolean;
  onClose: () => void;
}

export function HelpModal({ show, onClose }: HelpModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl m-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5 text-slate-500" />
              </Button>
            </div>

            <div className="p-8 sm:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Добро пожаловать в CodeMentor!</h2>
                  <p className="text-slate-500">Ваш персональный AI-помощник в обучении программированию.</p>
                </div>
              </div>

              <div className="text-slate-600 space-y-4">
                <p>
                  Эта платформа создана, чтобы помочь вам стать лучшим инженером, а не просто писать код. 
                  Вот что вы можете здесь делать:
                </p>
                <ul className="space-y-5 my-6">
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">AI Менторство</h4>
                      <p className="text-sm">
                        Начните обучение с нуля. AI-наставник адаптируется к вашему темпу и поможет освоить новые технологии.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">"Жёсткий" разбор кода (Hard Code Review)</h4>
                      <p className="text-sm">
                        Получите честную и строгую оценку вашего кода, как от старшего разработчика. Найдите уязвимости и плохие практики.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Code className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Интерактивная песочница</h4>
                      <p className="text-sm">
                        Пишите код прямо в браузере и получайте мгновенный AI-анализ. Экспериментируйте без страха что-то сломать.
                      </p>
                    </div>
                  </li>
                </ul>
                <p>
                  Начните с выбора одного из режимов на главной странице или перейдите в свой профиль, чтобы увидеть путь обучения. Удачи!
                </p>
              </div>

              <div className="mt-8 text-right">
                <Button 
                  onClick={onClose}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  Понятно, спасибо!
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
