"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Sun, Moon, Menu, X, MessageSquare, ArrowDownToLine } from "lucide-react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Career", path: "/career" },
  { name: "Family", path: "/family" },
  { name: "Gallery", path: "/gallery" },
  { name: "Certifications", path: "/certifications" },
  { name: "Lifestyle", path: "/lifestyle" },
  { name: "Goals", path: "/goals" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.05], [0.8, 1]);
  const borderOpacity = useTransform(scrollYProgress, [0, 0.05], [0.1, 0.2]);

  // Track hydration
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
    } else {
      setTheme("dark");
      document.documentElement.className = "dark";
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.className = nextTheme;
    localStorage.setItem("theme", nextTheme);
  };

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/20 border-b border-secondary/10 backdrop-blur-md" />
    );
  }

  return (
    <>
      <motion.header
        style={{ opacity }}
        className="fixed top-0 left-0 right-0 z-50 h-16 glass-panel border-b border-card-border/80 transition-all duration-300 no-print"
      >
        {/* Scroll Progress Line */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-accent"
          style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo / Branding */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-accent to-highlight bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              ATUL CHOUBEY
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? "text-accent" : "text-muted hover:text-foreground"
                  }`}
                >
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent mx-3"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-muted hover:text-foreground hover:bg-secondary/40 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* AI Assistant Link */}
            <Link
              href="/chat"
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent font-medium text-sm rounded-lg transition-colors"
            >
              <MessageSquare size={16} />
              <span>Ask Atul AI</span>
            </Link>

            {/* Biodata Link */}
            <Link
              href="/biodata"
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground font-medium text-sm rounded-lg transition-colors"
            >
              <ArrowDownToLine size={16} />
              <span>Biodata</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-muted hover:text-foreground rounded-lg cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-muted hover:text-foreground rounded-lg cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu — slide-in drawer from right */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden no-print"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[80vw] max-w-[320px] bg-background border-l border-card-border/80 flex flex-col lg:hidden no-print shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 h-16 border-b border-card-border/50 shrink-0">
                <span className="font-display font-extrabold text-lg bg-gradient-to-r from-accent to-highlight bg-clip-text text-transparent">
                  Navigation
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-muted hover:text-foreground rounded-lg transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
                {navItems.map((item, idx) => {
                  const isActive = pathname === item.path;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.035, duration: 0.2 }}
                    >
                      <Link
                        href={item.path}
                        className={`flex items-center px-4 py-4 text-base font-semibold rounded-xl transition-colors min-h-[52px] ${
                          isActive
                            ? "bg-accent/10 text-accent"
                            : "text-muted hover:bg-secondary/40 hover:text-foreground"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* CTA buttons */}
              <div className="px-4 py-5 border-t border-card-border/50 space-y-3 shrink-0">
                <Link
                  href="/chat"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 py-4 bg-accent text-white font-semibold rounded-xl shadow-lg shadow-accent/25 hover:opacity-90 transition-opacity"
                >
                  <MessageSquare size={16} />
                  <span>Ask Atul</span>
                </Link>
                <Link
                  href="/biodata"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 py-4 bg-secondary text-foreground font-semibold rounded-xl hover:bg-secondary/80 transition-colors border border-card-border/60"
                >
                  <ArrowDownToLine size={16} />
                  <span>Download Biodata</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
