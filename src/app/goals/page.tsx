"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { Compass, CheckCircle2, Circle, Target, Heart, Sparkles, DollarSign, Plane } from "lucide-react";
import { profileData } from "@/data/profile";

interface GoalDetails {
  description: string;
  milestones: string[];
}

// Additional descriptive details mapped by goal title to expand the database array
const goalMeta: Record<string, GoalDetails> = {
  "AI & Infrastructure Leadership": {
    description: "Lead enterprise engineering departments driving custom MLOps scaling and deploying large-scale multimodal models.",
    milestones: ["Design open-source MLOps orchestrator", "Scale large-language model pipelines", "Mentor junior infrastructure engineers"],
  },
  "Supporting Parents (Healthcare & comfort)": {
    description: "Providing maximum comfort, healthcare security, and peace of mind to parents (Shri Manoranjan & Smt. Anita Choubey) as they age.",
    milestones: ["Establish complete family health trust", "Maintain annual cultural pilgrimages", "Create peaceful native estate upgrades"],
  },
  "Financial Independence": {
    description: "Achieving wealth metrics allowing freedom of choice, venture investments, and lifelong family comfort.",
    milestones: ["Diversify equity and real estate holdings", "Establish passive capital returns", "Zero liability asset structure"],
  },
  "Healthy Values-driven Family": {
    description: "Finding a compatible life partner, establishing a values-driven home, and continuing our cultural lineage with mutual respect.",
    milestones: ["Establish mutual support structures", "Healthy active lifestyle balance", "Nurturing shared values and traditions"],
  },
  "Continuous Learning & Upskilling": {
    description: "Consistently learning deep technical paradigms to remain at the peak of the machine learning field.",
    milestones: ["Complete advanced statistics courses", "Publish practical infrastructure articles", "Master cloud-native security certifications"],
  }
};

export default function Goals() {
  const [activeCategory, setActiveCategory] = useState<"all" | "professional" | "family" | "financial" | "personal">("all");

  const filteredGoals = profileData.goals.filter(
    (g) => activeCategory === "all" || g.category === activeCategory
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "professional":
        return <Sparkles className="text-accent" size={16} />;
      case "family":
        return <Heart className="text-red-400" size={16} />;
      case "financial":
        return <DollarSign className="text-emerald-500" size={16} />;
      case "personal":
        return <Plane className="text-highlight" size={16} />;
      default:
        return <Target className="text-muted" size={16} />;
    }
  };

  const getStatusIcon = (time: string) => {
    if (time === "Ongoing") {
      return (
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
        </span>
      );
    }
    return <Circle size={14} className="text-muted" />;
  };

  return (
    <PageWrapper>
      <div className="space-y-12">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-1.5 px-3 py-1 bg-secondary text-accent rounded-full text-xs font-semibold uppercase tracking-wider"
          >
            <Target size={14} />
            <span>Future Roadmap</span>
          </motion.div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-foreground">
            Future Goals & Vision
          </h1>
          <p className="text-base sm:text-lg text-muted">
            A balanced overview of targets across professional mastery, family security, financial stability, and personal exploration.
          </p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
          {["all", "professional", "family", "financial", "personal"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-accent text-white shadow-lg shadow-accent/20"
                  : "bg-secondary/60 text-muted hover:text-foreground hover:bg-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Goals Roadmap grid layout */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {filteredGoals.map((goal, idx) => {
            const meta = goalMeta[goal.title] || {
              description: "Working towards established objectives with discipline and clear planning.",
              milestones: ["Define action milestones", "Track development benchmarks"]
            };
            
            return (
              <motion.div
                layout
                key={goal.title + idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="glass-panel p-6 rounded-2xl border border-card-border hover:border-accent/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  
                  {/* Header detail */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-secondary/50 rounded-lg">
                        {getCategoryIcon(goal.category)}
                      </div>
                      <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                        {goal.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-muted uppercase tracking-widest bg-secondary/40 px-2 py-0.5 rounded">
                        {goal.time}
                      </span>
                      {getStatusIcon(goal.time)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-lg text-foreground group-hover:text-accent transition-colors">
                      {goal.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted leading-relaxed">
                      {meta.description}
                    </p>
                  </div>

                  {/* Sub milestones list */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-bold text-highlight uppercase tracking-wider block">
                      Key Milestones:
                    </span>
                    <ul className="space-y-1.5">
                      {meta.milestones.map((mil, mIdx) => (
                        <li key={mIdx} className="text-xs text-muted flex items-start space-x-2">
                          <CheckCircle2 size={12} className="text-accent shrink-0 mt-0.5" />
                          <span>{mil}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </PageWrapper>
  );
}
