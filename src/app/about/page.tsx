"use client";

import React from "react";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { MapPin, Compass, Sparkles } from "lucide-react";

interface Visual {
  src: string;
  title: string;
  caption: string;
}

interface TimelineItem {
  id: string;
  stageTitle: string;
  location: string;
  period: string;
  description: string;
  visuals: Visual[];
}

function VisualCard({ visual, delay = 0 }: { visual: Visual; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className="glass-panel rounded-2xl overflow-hidden border border-card-border/80 hover:border-accent/30 hover:shadow-xl transition-all duration-300 shadow-sm group"
    >
      <div className="overflow-hidden">
        <img
          src={visual.src}
          alt={visual.title}
          className="w-full h-auto block object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-3 sm:p-4 bg-card/40 border-t border-card-border/40">
        <h4 className="font-display font-semibold text-sm text-foreground group-hover:text-accent transition-colors">
          {visual.title}
        </h4>
        <p className="text-xs text-muted mt-0.5 leading-relaxed">{visual.caption}</p>
      </div>
    </motion.div>
  );
}

export default function About() {
  const timeline: TimelineItem[] = [
    {
      id: "patna",
      stageTitle: "Growing Up in Patna",
      location: "Patna, Bihar",
      period: "1997 – 2015",
      description: "I was born and raised in Patna, Bihar, in a close-knit family that valued education, discipline, and strong relationships. Patna shaped my early years, gave me drive, and instilled a deep belief that hard work and learning are the foundations of a good life.",
      visuals: [
        {
          src: "/images/contextual/patna-skyline.png",
          title: "Patna, Bihar",
          caption: "Growing up along the Ganges in Patna — where my curiosity for the world first sparked."
        }
      ]
    },
    {
      id: "roots",
      stageTitle: "Family Roots in Bihar",
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
      id: "school",
      stageTitle: "School Years",
      location: "Patna, Bihar",
      period: "2013 – 2015",
      description: "I completed my schooling at Radiant International School, Patna, where I developed a strong interest in science, technology, and problem-solving. Those years sharpened my thinking and made me hungry to learn beyond what school could offer.",
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
      description: "I completed my B.Tech in Information Technology from the Coimbatore Institute of Technology. Four years at CIT gave me a strong foundation in software engineering, system design, and problem-solving — and taught me how to learn independently. Coimbatore also gave me some of my most memorable experiences, including the iconic Adiyogi Shiva statue at the Isha Yoga Centre.",
      visuals: [
        {
          src: "/images/cit.jpg",
          title: "Coimbatore Institute of Technology",
          caption: "My engineering campus — four transformative years that shaped how I think and build."
        },
        {
          src: "/images/adiyogi-shiva-statue-coimbatore-tamil-nadu-city-1-hero.jpg",
          title: "Adiyogi, Isha Yoga Centre",
          caption: "One of my memorable experiences during my years in Coimbatore."
        }
      ]
    },
    {
      id: "kalycito",
      stageTitle: "Kalycito Technologies",
      location: "Coimbatore, Tamil Nadu",
      period: "2020 – 2022",
      description: "I started my professional career at Kalycito Technologies, a startup where I worked as a Software Engineer on DevOps and platform engineering projects. Deploying Kubernetes clusters and building CI/CD pipelines in a fast-moving startup environment was an exciting first chapter.",
      visuals: [
        {
          src: "/images/me-at-kalycito-office-early-days.jpg",
          title: "At Kalycito Office",
          caption: "Early career days at Kalycito — learning fast, building things, and loving every moment."
        }
      ]
    },
    {
      id: "bosch",
      stageTitle: "Bosch Global Software Technologies",
      location: "Coimbatore, Tamil Nadu",
      period: "2023 – 2024",
      description: "I joined Bosch as a Senior Software Engineer, focusing on Python automation, Jenkins pipeline optimization, and REST API metrics. Beyond engineering, I performed with our employee rock band at an interstate music competition — one of my proudest off-desk moments.",
      visuals: [
        {
          src: "/images/bosch-building.jpg",
          title: "Bosch Office, Coimbatore",
          caption: "The Bosch campus where I worked on enterprise automation and build pipeline optimization."
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
      description: "I currently work as a Senior MLOps / ML Platform Engineer at Accenture, supporting UBS in Pune. I build configuration-driven machine learning pipelines using GitLab CI/CD, CDSW, and MLflow — working at the intersection of AI, cloud infrastructure, and automation.",
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
      <div className="space-y-10 max-w-5xl mx-auto">

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
            I was born and raised in Patna, Bihar, in a family that valued education, integrity, and strong relationships. My journey has taken me from Bihar to Coimbatore and then to Pune, where I built a career in technology while staying deeply connected to my roots and family values.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Subtle vertical connector — desktop only */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-card-border/40 -translate-x-1/2 hidden lg:block" />

          <div className="space-y-10 lg:space-y-12">
            {timeline.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.55 }}
                  className={`flex flex-col lg:flex-row gap-6 lg:gap-10 items-start relative z-10 ${
                    isEven ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot — desktop */}
                  <div className="absolute left-1/2 top-2 w-3 h-3 rounded-full bg-accent border-4 border-background -translate-x-1/2 hidden lg:block shadow-sm" />

                  {/* Text side */}
                  <div className="w-full lg:w-1/2 space-y-3">
                    <div className="space-y-0.5">
                      <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
                        {item.period}
                      </span>
                      <h2 className="font-display font-bold text-xl sm:text-2xl text-foreground">
                        {item.stageTitle}
                      </h2>
                      <div className="flex items-center gap-1 text-xs text-muted font-medium">
                        <MapPin size={11} className="text-accent shrink-0" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-muted leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Image side */}
                  <div className={`w-full lg:w-1/2 ${
                    item.visuals.length === 1
                      ? ""
                      : "grid grid-cols-1 sm:grid-cols-2 gap-3"
                  }`}>
                    {item.visuals.map((visual, vIdx) => (
                      <VisualCard key={vIdx} visual={visual} delay={vIdx * 0.1} />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Looking Ahead */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
        >
          <div className="glass-panel rounded-3xl border border-accent/20 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-stretch">
              {/* Portrait — fixed width column on desktop, natural height on mobile */}
              <div className="w-full sm:w-52 shrink-0 bg-secondary/20 overflow-hidden">
                <img
                  src="/images/me.jpg"
                  alt="Atul Choubey"
                  className="w-full h-auto sm:h-full block object-cover object-center"
                  loading="lazy"
                />
              </div>

              {/* Text */}
              <div className="flex flex-col justify-center p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={15} className="text-accent" />
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
