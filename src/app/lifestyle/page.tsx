"use client";

import React from "react";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { Sun, Dumbbell, Briefcase, BookOpen, Heart, Moon, Compass, Trophy, Smile } from "lucide-react";
import { profileData } from "@/data/profile";

export default function Lifestyle() {
  const l = profileData.lifestyle;

  const getRoutineIcon = (activity: string) => {
    switch (activity.toLowerCase()) {
      case "wake up":
        return <Sun className="text-amber-500" size={18} />;
      case "gym":
      case "gym & fitness":
        return <Dumbbell className="text-red-500" size={18} />;
      case "work":
      case "engineering work":
        return <Briefcase className="text-accent" size={18} />;
      case "upskilling":
      case "upskilling & learning":
        return <BookOpen className="text-highlight" size={18} />;
      case "family":
      case "family connection":
        return <Heart className="text-emerald-500" size={18} />;
      default:
        return <Moon className="text-indigo-400" size={18} />;
    }
  };

  const pillars = [
    {
      title: "Fitness & Vitality",
      description: "Belief that physical health is the foundation of mental performance. Consistent workouts and balanced nutrition are non-negotiable standards.",
      stat: "5 Days / Week Strength Training",
      icon: <Dumbbell className="text-red-500" size={20} />,
    },
    {
      title: "Continuous Learning",
      description: "In technology, stagnancy is failure. Constantly reading research documentation, taking certifications, and executing custom weekend sandbox projects.",
      stat: "20+ Tech Papers/Books Read Yearly",
      icon: <Trophy className="text-amber-500" size={20} />,
    },
    {
      title: "Personal Growth",
      description: l.values_philosophy,
      stat: "Daily Mindfulness & Goal Sync",
      icon: <Compass className="text-accent" size={20} />,
    },
    {
      title: "Mindset & Values",
      description: "Living with empathy and respect. Approaching colleagues, family members, and peers with a collaborative and trustworthy attitude.",
      stat: "High Trust & Respect Mindset",
      icon: <Smile className="text-emerald-500" size={20} />,
    },
  ];

  return (
    <PageWrapper>
      <div className="space-y-16">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-1.5 px-3 py-1 bg-secondary text-accent rounded-full text-xs font-semibold uppercase tracking-wider"
          >
            <Compass size={14} />
            <span>Lifestyle & Routine</span>
          </motion.div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-foreground">
            Lifestyle & Routine
          </h1>
          <p className="text-base sm:text-lg text-muted">
            Discipline is not about restriction; it is the ultimate pathway to freedom, health, and career achievement.
          </p>
        </div>

        {/* Daily Schedule Timeline Grid */}
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="font-display font-bold text-2xl text-foreground border-l-4 border-accent pl-3">
            Daily Routine
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {l.routine.map((item, idx) => (
              <motion.div
                key={item.activity}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="glass-panel p-6 rounded-2xl border border-card-border flex items-start gap-4 hover:border-accent/30 transition-colors"
              >
                <div className="p-3 bg-secondary/55 rounded-2xl shrink-0">
                  {getRoutineIcon(item.activity)}
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-accent">
                    {item.time}
                  </span>
                  <h3 className="font-display font-bold text-lg text-foreground">
                    {item.activity}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Lifestyle Pillars */}
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="font-display font-bold text-2xl text-foreground border-l-4 border-accent pl-3">
            Core Lifestyle Pillars
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="glass-panel p-6 rounded-2xl border border-card-border hover:shadow-lg hover:border-accent/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="p-2 bg-accent/15 rounded-xl inline-block">
                    {pillar.icon}
                  </div>
                  <h3 className="font-display font-bold text-xl text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-card-border/60">
                  <span className="text-xs font-bold text-highlight uppercase tracking-wider block">
                    {pillar.stat}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
