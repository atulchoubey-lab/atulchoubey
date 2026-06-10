"use client";

import React from "react";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { MapPin, Compass, Sparkles } from "lucide-react";

interface TimelineItem {
  id: string;
  type?: "memory";
  stageTitle: string;
  location: string;
  period: string;
  description: string;
  visuals: {
    src: string;
    title: string;
    caption: string;
    aspectRatio?: string;
  }[];
}

export default function About() {
  const timeline: TimelineItem[] = [
    {
      id: "roots",
      stageTitle: "Roots in Bihar",
      location: "Ahirauli, Buxar, Bihar",
      period: "Ancestral Roots",
      description: "My roots trace back to Ahirauli, a village in the Buxar district of Bihar. Our family gotra is Bhargav, and our values — integrity, education, and respect — come from this land. No matter where life has taken me, I carry this heritage with pride.",
      visuals: [
        {
          src: "/images/contextual/buxar-heritage.png",
          title: "Buxar, Bihar",
          caption: "My ancestral village in Buxar district — the land where our family's story began."
        }
      ]
    },
    {
      id: "patna",
      stageTitle: "Growing Up in Patna",
      location: "Patna, Bihar",
      period: "1997 – 2015",
      description: "I was born and raised in Patna, Bihar, in a close-knit family that valued education, discipline, and strong relationships. Patna shaped my early years and gave me the ambition to grow beyond what I could see around me.",
      visuals: [
        {
          src: "/images/contextual/patna-skyline.png",
          title: "Patna, Bihar",
          caption: "Growing up along the Ganges in Patna, where my curiosity for the world first sparked."
        }
      ]
    },
    {
      id: "school",
      stageTitle: "School Years",
      location: "Patna, Bihar",
      period: "2013 – 2015",
      description: "I completed my schooling at Radiant International School, Patna, where I developed a strong interest in science, technology, and problem-solving. Those years built my foundation and made me hungry to learn more.",
      visuals: [
        {
          src: "/images/me-school-time.jpg",
          title: "School Days",
          caption: "School life in Patna — where curiosity met structure and a love for technology began to form."
        }
      ]
    },
    {
      id: "engineering",
      stageTitle: "Engineering at CIT",
      location: "Coimbatore, Tamil Nadu",
      period: "2016 – 2020",
      description: "I completed my Bachelor of Technology in Information Technology from the Coimbatore Institute of Technology. Four years at CIT gave me a strong foundation in software engineering, system design, programming, and problem-solving — and taught me how to learn independently.",
      visuals: [
        {
          src: "/images/cit.jpg",
          title: "Coimbatore Institute of Technology",
          caption: "My engineering campus — four transformative years that shaped how I think and build.",
          aspectRatio: "2/3"
        }
      ]
    },
    {
      id: "adiyogi",
      type: "memory",
      stageTitle: "Memories from Coimbatore",
      location: "Coimbatore, Tamil Nadu",
      period: "A Favourite Place",
      description: "One of my favourite places during my years in Coimbatore — the Adiyogi Shiva statue at the Isha Yoga Centre. A place that always brought a sense of calm and perspective.",
      visuals: [
        {
          src: "/images/adiyogi-shiva-statue-coimbatore-tamil-nadu-city-1-hero.jpg",
          title: "Adiyogi, Isha Yoga Centre",
          caption: "A memorable landmark from my Coimbatore years.",
          aspectRatio: "16/9"
        }
      ]
    },
    {
      id: "kalycito",
      stageTitle: "Kalycito Technologies",
      location: "Coimbatore, Tamil Nadu",
      period: "2020 – 2022",
      description: "I started my professional career at Kalycito Technologies, a startup where I worked as a Software Engineer on DevOps and platform engineering projects. Deploying Kubernetes clusters and building CI/CD pipelines in a fast-paced environment was an exciting first chapter in my career.",
      visuals: [
        {
          src: "/images/me-at-kalycito-office-early-days.jpg",
          title: "At Kalycito Office",
          caption: "Early career days at Kalycito — learning fast, building things, and loving every moment of it."
        }
      ]
    },
    {
      id: "bosch",
      stageTitle: "Bosch Global Software Technologies",
      location: "Coimbatore, Tamil Nadu",
      period: "2023 – 2024",
      description: "I joined Bosch Global Software Technologies as a Senior Software Engineer, focusing on Python automation, Jenkins pipeline optimization, and REST API metrics dashboards. Beyond engineering, I also performed with our employee rock band at an interstate music competition — one of my proudest off-desk moments.",
      visuals: [
        {
          src: "/images/bosch-building.jpg",
          title: "Bosch Office, Coimbatore",
          caption: "The Bosch campus where I worked on enterprise automation and build pipelines."
        },
        {
          src: "/images/rock-band-performance-at-bosch-employees-interstate-competition.jpg",
          title: "Rock Band Performance",
          caption: "Performing live with our band at the Bosch employee interstate music competition."
        }
      ]
    },
    {
      id: "ubs",
      stageTitle: "Accenture · UBS — MLOps",
      location: "Pune, Maharashtra",
      period: "2025 – Present",
      description: "I currently work as a Senior MLOps / ML Platform Engineer at Accenture, supporting UBS in Pune. I build configuration-driven machine learning pipelines using GitLab CI/CD, CDSW, and MLflow — working at the intersection of AI, cloud infrastructure, and automation to help data scientists ship models reliably.",
      visuals: [
        {
          src: "/images/ubs-pune.jpg",
          title: "UBS Office, Pune",
          caption: "The UBS campus in Pune — where I now focus on ML platforms and AI infrastructure."
        }
      ]
    },
  ];

  return (
    <PageWrapper>
      <div className="space-y-16 max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-1.5 px-3 py-1 bg-secondary text-accent rounded-full text-xs font-semibold uppercase tracking-wider"
          >
            <Compass size={14} />
            <span>Profile & Timeline</span>
          </motion.div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-foreground">
            My Story
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            I was born and raised in Patna, Bihar, in a family that valued education, integrity, and strong relationships. Over the years, my journey has taken me from Bihar to Coimbatore and then to Pune, where I built a career in technology while staying deeply connected to my roots and family values.
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-16 pt-4 relative">
          {/* Vertical line — desktop only */}
          <div className="absolute left-1/2 top-4 bottom-4 w-[1px] bg-card-border/50 -translate-x-1/2 hidden lg:block" />

          {timeline.map((item, idx) => {
            const isEven = idx % 2 === 0;

            /* Memory card — centered, narrower, not part of alternating flow */
            if (item.type === "memory") {
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5 }}
                  className="flex justify-center relative z-10"
                >
                  <div className="w-full max-w-2xl glass-panel rounded-2xl overflow-hidden border border-accent/20 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 group shadow-sm">
                    <div className="relative w-full overflow-hidden bg-secondary/10" style={{ aspectRatio: "16/9" }}>
                      <img
                        src={item.visuals[0].src}
                        alt={item.visuals[0].title}
                        className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Sparkles size={12} className="text-accent" />
                          <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider">{item.period}</span>
                        </div>
                        <h3 className="font-display font-bold text-base text-white">{item.stageTitle}</h3>
                        <p className="text-xs text-white/70 mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col lg:flex-row gap-8 items-start relative z-10 ${
                  isEven ? "" : "lg:flex-row-reverse"
                }`}
              >
                {/* Timeline node */}
                <div className="absolute left-1/2 top-1.5 w-3 h-3 rounded-full bg-accent border-4 border-background -translate-x-1/2 hidden lg:block shadow-md" />

                {/* Story text */}
                <div className="w-full lg:w-1/2 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
                      {item.period}
                    </span>
                    <h2 className="font-display font-bold text-2xl text-foreground">
                      {item.stageTitle}
                    </h2>
                    <div className="flex items-center gap-1 text-xs text-muted font-medium">
                      <MapPin size={12} className="text-accent" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Imagery */}
                <div className={`w-full lg:w-1/2 ${item.visuals.length === 1 ? "flex" : "grid grid-cols-1 sm:grid-cols-2"} gap-4`}>
                  {item.visuals.map((visual, vIdx) => (
                    <motion.div
                      key={vIdx}
                      initial={{ opacity: 0, scale: 0.96 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: vIdx * 0.15 }}
                      className="glass-panel rounded-2xl overflow-hidden border border-card-border/80 flex flex-col hover:border-accent/30 hover:shadow-xl transition-all duration-300 shadow-sm group w-full"
                    >
                      <div
                        className="relative w-full overflow-hidden bg-secondary/10"
                        style={{ aspectRatio: visual.aspectRatio || "4/3" }}
                      >
                        <img
                          src={visual.src}
                          alt={visual.title}
                          className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-4 bg-card/40 border-t border-card-border/40">
                        <h4 className="font-display font-semibold text-sm text-foreground group-hover:text-accent transition-colors">
                          {visual.title}
                        </h4>
                        <p className="text-xs text-muted mt-0.5 leading-relaxed">
                          {visual.caption}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Looking Ahead */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative z-10 pt-8"
        >
          <div className="glass-panel rounded-3xl border border-accent/20 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-stretch">
              {/* Portrait */}
              <div className="relative w-full sm:w-56 shrink-0 aspect-[4/5] sm:aspect-auto bg-secondary/20">
                <img
                  src="/images/me.jpg"
                  alt="Atul Choubey"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/20 hidden sm:block" />
              </div>

              {/* Text */}
              <div className="flex flex-col justify-center p-8 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-accent" />
                  <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">Future Vision</span>
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
                  Looking Ahead
                </h2>
                <p className="text-sm sm:text-base text-muted leading-relaxed max-w-xl">
                  I believe in continuous learning, meaningful work, strong family values, and building a fulfilling life. My goal is to keep growing as an ML Platform and AI infrastructure leader, while staying deeply rooted in the relationships and principles that matter most.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </PageWrapper>
  );
}
