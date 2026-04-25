"use client";
import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="relative w-12 h-12 flex items-center justify-center bg-bg-surface-low border border-border-color hover:border-primary-container transition-all group overflow-hidden rounded-full"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {theme === "light" ? (
          <motion.div
            key="sun"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-5 h-5 text-accent-yellow" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-5 h-5 text-accent-blue" />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-primary-container/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
    </button>
  );
}
