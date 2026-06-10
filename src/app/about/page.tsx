"use client";

import React from "react";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { MapPin, Briefcase, GraduationCap, Heart, Sparkles, Compass } from "lucide-react";

interface TimelineItem {
  id: string;
  stageTitle: string;
  location: string;
  period: string;
  description: string;
  visuals: {
    src: string;
    title: string;
    caption: string;
  }[];
}

export default function About() {
  const timeline: TimelineItem[] = [
    {
      id: "origins",
      stageTitle: "Origins & Schooling",
      location: "Patna, Bihar",
      period: "1997 - 2015",
      description: "I was born and raised in Patna, Bihar, in a family that prioritized strong values, education, and self-discipline. I completed my schooling here at Radiant International School, passing my Class X exams in 2013 and Class XII in 2015. Growing up in Patna shaped my personality and instilled a deep respect for learning.",
      visuals: [
        {
          src: "/images/contextual/patna-skyline.png",
          title: "Patna Heritage Skyline",
          caption: "Growing up in Patna along the Ganges, where my education and values took shape."
        }
      ]
    },
    {
      id: "buxar",
      stageTitle: "Family Roots",
      location: "Ahirauli, Buxar, Bihar",
      period: "Roots",
      description: "My ancestral roots trace back to Ahirauli, a historic village in the Buxar district of Bihar. Our family gotra is Bhargav. Buxar is a place close to my heart, representing our lineage, traditional heritage, and family values that keep me grounded no matter where my professional journey takes me.",
      visuals: [
        {
          src: "/images/contextual/buxar-heritage.png",
          title: "Buxar Ancestral Roots",
          caption: "Buxar district, Bihar – the land of my ancestors."
        }
      ]
    },
    {
      id: "engineering",
      stageTitle: "Engineering Studies",
      location: "Coimbatore, Tamil Nadu",
      period: "2016 - 2020",
      description: "I moved away from home to Coimbatore to pursue my Bachelor of Technology (B.Tech) in Information Technology at the Coimbatore Institute of Technology (CIT). Living in Coimbatore taught me independence and allowed me to build a strong foundation in computer science, system automation, and software engineering. I graduated with First Class honors in September 2020.",
      visuals: [
        {
          src: "/images/cit.jpg",
          title: "Coimbatore Institute of Technology",
          caption: "My engineering campus in Coimbatore, where I spent four formative academic years."
        },
        {
          src: "/images/adiyogi-shiva-statue-coimbatore-tamil-nadu-city-1-hero.jpg",
          title: "Adiyogi, Coimbatore",
          caption: "A memorable spiritual place in Coimbatore from my engineering years."
        }
      ]
    },
    {
      id: "kalycito",
      stageTitle: "Beginning My Career",
      location: "Coimbatore, Tamil Nadu",
      period: "2020 - 2022",
      description: "I began my professional career in Coimbatore at Kalycito Infotech, an exciting startup where I worked as a DevOps and Platform Engineer. I deployed and managed multi-node Kubernetes clusters supporting containerized services — an exhilarating transition from academia into real production-scale automation.",
      visuals: [
        {
          src: "/images/me-at-kalycito-office-early-days.jpg",
          title: "At Kalycito Office",
          caption: "Early days at Kalycito Infotech — building pipelines and managing Kubernetes clusters."
        }
      ]
    },
    {
      id: "bosch",
      stageTitle: "Software Automation at Bosch",
      location: "Coimbatore, Tamil Nadu",
      period: "2023 - 2024",
      description: "I joined Bosch Global Software Technologies in Coimbatore as a Senior Software Engineer. I built Python automation scripts to parse Jenkins and REST API metrics and stream them to dashboards. I also managed and optimized over 50 build pipelines. During my time at Bosch, I also had the opportunity to play guitar and perform with our employees' rock band, which was incredibly rewarding.",
      visuals: [
        {
          src: "/images/bosch-building.jpg",
          title: "Bosch Office, Coimbatore",
          caption: "Working on enterprise software automation at the Bosch Coimbatore campus."
        },
        {
          src: "/images/rock-band-performance-at-bosch-employees-interstate-competition.jpg",
          title: "Rock Band Performance",
          caption: "Performing live with our band at the Bosch employee music competition."
        }
      ]
    },
    {
      id: "ubs",
      stageTitle: "MLOps Platform Engineering",
      location: "Pune, India",
      period: "2025 - Present",
      description: "I currently work as a Senior MLOps / ML Platform Engineer at Accenture, supporting our client UBS in Pune. I build configuration-driven machine learning pipelines using GitLab CI/CD, CDSW, and MLflow. I love working at the intersection of AI platforms, cloud scalability, and automation, helping data scientists deploy and monitor models reliably.",
      visuals: [
        {
          src: "/images/ubs-pune.jpg",
          title: "UBS Office, Pune",
          caption: "The UBS campus in Pune where I work on ML platforms and AI infrastructure."
        },
        {
          src: "/images/contextual/ubs-fintech.png",
          title: "MLOps at UBS",
          caption: "Building configuration-driven machine learning pipelines and container architectures."
        }
      ]
    },
    {
      id: "future",
      stageTitle: "Looking Ahead",
      location: "Future Vision",
      period: "Future",
      description: "Looking forward, my goal is to continue growing as a leader in AI infrastructure and cloud platform engineering. Personally, I am focused on providing comfort and care to my parents, keeping our traditional roots alive, and building a happy, values-driven family based on mutual trust, respect, and growth.",
      visuals: [
        {
          src: "/images/contextual/future-ai-roadmap.png",
          title: "GenAI & Cloud Roadmap",
          caption: "Leading AI systems and scaling cloud solutions for the next generation of computing."
        }
      ]
    }
  ];

  return (
    <PageWrapper>
      <div className="space-y-16 max-w-5xl mx-auto">
        
        {/* Intro Section */}
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
            I was born in Patna, Bihar, and raised with strong family values and a focus on education. Here is a brief look at my roots, my studies, and my career journey.
          </p>
        </div>

        {/* Timeline Narrative */}
        <div className="space-y-20 pt-8 relative">
          {/* Vertical timeline line (Desktop only) */}
          <div className="absolute left-6 lg:left-1/2 top-4 bottom-4 w-[1px] bg-card-border/50 -translate-x-1/2 hidden lg:block" />

          {timeline.map((item, idx) => {
            const isEven = idx % 2 === 0;

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
                <div className="absolute left-6 lg:left-1/2 top-1.5 w-3 h-3 rounded-full bg-accent border-4 border-background -translate-x-1/2 hidden lg:block shadow-md" />

                {/* Left Side: Story text */}
                <div className="w-full lg:w-1/2 pl-12 lg:pl-0 space-y-4">
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

                {/* Right Side: Imagery grid */}
                <div className={`w-full lg:w-1/2 pl-12 lg:pl-0 ${item.visuals.length === 1 ? "flex" : "grid grid-cols-1 sm:grid-cols-2"} gap-4`}>
                  {item.visuals.map((visual, vIdx) => (
                    <motion.div
                      key={vIdx}
                      initial={{ opacity: 0, scale: 0.96 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: vIdx * 0.15 }}
                      className="glass-panel rounded-2xl overflow-hidden border border-card-border/80 flex flex-col hover:border-accent/30 hover:shadow-xl transition-all duration-300 shadow-sm group w-full"
                    >
                      <div className="relative w-full overflow-hidden bg-secondary/10" style={{ aspectRatio: visual.src.includes("cit.jpg") ? "2/3" : "4/3" }}>
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

      </div>
    </PageWrapper>
  );
}
