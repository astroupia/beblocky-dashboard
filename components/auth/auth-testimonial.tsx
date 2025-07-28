"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useState, useEffect } from "react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
}

interface AuthTestimonialProps {
  mode: "signin" | "signup";
}

export function AuthTestimonial({ mode }: AuthTestimonialProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const testimonials: Testimonial[] = [
    {
      quote:
        "This platform has completely transformed how we deliver education. The course creation tools are incredible and the mobile app makes learning accessible anywhere.",
      author: "Sarah Johnson",
      role: "Education Director",
      avatar: "SJ",
      rating: 5,
    },
    {
      quote:
        "The analytics and student management features have saved us countless hours. Our engagement rates have increased by 300% since switching to this platform.",
      author: "Michael Chen",
      role: "Training Manager",
      avatar: "MC",
      rating: 5,
    },
    {
      quote:
        "As a student, I love how intuitive the interface is. The mobile app lets me learn during my commute, and the progress tracking keeps me motivated.",
      author: "Emma Rodriguez",
      role: "Graduate Student",
      avatar: "ER",
      rating: 5,
    },
  ];

  const currentTest = testimonials[currentTestimonial];

  if (!isMounted) {
    return (
      <div className="relative z-10">
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 shadow-lg">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center mb-4">
            <Quote className="h-5 w-5 text-primary" />
          </div>
          <div className="flex gap-1 mb-4">
            {[...Array(currentTest.rating)].map((_, i) => (
              <div key={i} className="h-4 w-4 text-yellow-400">
                ★
              </div>
            ))}
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            "{currentTest.quote}"
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <span className="text-white font-semibold text-sm">
                  {currentTest.avatar}
                </span>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {currentTest.author}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {currentTest.role}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "bg-primary w-6"
                      : "bg-slate-300 dark:bg-slate-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="relative z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 shadow-lg">
        {/* Quote icon */}
        <motion.div
          className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center mb-4"
          whileHover={{ scale: 1.1, rotate: 180 }}
          transition={{ duration: 0.3 }}
        >
          <Quote className="h-5 w-5 text-primary" />
        </motion.div>

        {/* Rating stars */}
        <div className="flex gap-1 mb-4">
          {[...Array(currentTest.rating)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              <div className="h-4 w-4 text-yellow-400">★</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonial content */}
        <motion.p
          key={currentTestimonial}
          className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          "{currentTest.quote}"
        </motion.p>

        {/* Author info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-white font-semibold text-sm">
                {currentTest.avatar}
              </span>
            </motion.div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                {currentTest.author}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {currentTest.role}
              </p>
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? "bg-primary w-6"
                    : "bg-slate-300 dark:bg-slate-600 hover:bg-primary/50"
                }`}
                onClick={() => setCurrentTestimonial(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
