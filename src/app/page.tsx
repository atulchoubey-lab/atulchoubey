"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MessageSquare, ArrowRight, ArrowDownToLine, ChevronDown,
  MapPin, GraduationCap, Briefcase, Code2, Rocket, BookOpen, Camera, Heart,
  CheckCircle2, Cloud, Music, Activity, Users, Globe
} from "lucide-react";
import { profileData } from "@/data/profile";

const milestones = [
  { year: "1997", icon: <MapPin size={16} />, title: "Born in Patna", sub: "Bihar, India", color: "from-amber-500 to-orange-500" },
  { year: "2015", icon: <BookOpen size={16} />, title: "Class XII — CBSE", sub: "Radiant School, Patna", color: "from-yellow-500 to-amber-500" },
  { year: "2016", icon: <GraduationCap size={16} />, title: "B.Tech at CIT", sub: "Coimbatore, Tamil Nadu", color: "from-emerald-500 to-teal-500" },
  { year: "2020", icon: <Briefcase size={16} />, title: "Career at Kalycito", sub: "DevOps & Platform Eng.", color: "from-blue-500 to-cyan-500" },
  { year: "2023", icon: <Code2 size={16} />, title: "Bosch — Senior SE", sub: "Python & DevOps Automation", color: "from-indigo-500 to-violet-500" },
  { year: "2025", icon: <Rocket size={16} />, title: "MLOps at UBS", sub: "AI Platform Engineering", color: "from-accent to-highlight" },
];

const careerHighlights = [
  { icon: <CheckCircle2 size={18} className="text-accent" />, title: "6+ Years Experience", sub: "In technology and engineering" },
  { icon: <CheckCircle2 size={18} className="text-accent" />, title: "Senior MLOps Engineer", sub: "AI Platform Engineering" },
  { icon: <CheckCircle2 size={18} className="text-accent" />, title: "AI Platform Development", sub: "MLflow, CDSW, GitLab CI/CD" },
  { icon: <CheckCircle2 size={18} className="text-accent" />, title: "Azure & Cloud Technologies", sub: "Enterprise cloud deployments" },
  { icon: <CheckCircle2 size={18} className="text-accent" />, title: "MLOps Pipelines", sub: "End-to-end ML workflows" },
  { icon: <CheckCircle2 size={18} className="text-accent" />, title: "Enterprise AI Solutions", sub: "Large-scale AI implementations" },
  { icon: <CheckCircle2 size={18} className="text-accent" />, title: "Global Banking Client", sub: "Supporting UBS in Pune" },
];

const lifeCards = [
  {
    icon: <Users size={20} className="text-accent" />,
    title: "Family",
    desc: "Deeply rooted in family values. My parents and brother are my greatest strength.",
    img: "/images/family-photo-at-mahavir-mandir-patna.jpg",
    color: "from-rose-500/15 to-pink-500/15",
  },
  {
    icon: <Globe size={20} className="text-accent" />,
    title: "Travel & Exploration",
    desc: "From Rameshwaram to Isha Yoga Centre — I love visiting meaningful places.",
    img: "/images/explore.jpeg",
    color: "from-blue-500/15 to-cyan-500/15",
  },
  {
    icon: <Music size={20} className="text-accent" />,
    title: "Music & Hobbies",
    desc: "I play acoustic guitar and performed with our rock band at Bosch competitions.",
    img: "/images/music.png",
    color: "from-violet-500/15 to-purple-500/15",
  },
  {
    icon: <Activity size={20} className="text-accent" />,
    title: "Fitness & Lifestyle",
    desc: "Morning gym sessions and staying active are an important part of my daily routine.",
    img: "/images/fitness.jpg",
    color: "from-emerald-500/15 to-teal-500/15",
  },
];

const previewPhotoIds = [
  "photo_me-in-chath-puja",
  "photo_me-with-mom-in-rameshwaram-temple",
  "photo_me-with-my-mom-in-isha-yoga",
  "photo_me-with-my-brother-grand-father-and-grand-mother",
  "photo_me-with-my-pug-muffy",
  "photo_me-with-my-father-add-this-photo-in-family-intro",
];

export default function Home() {
  const galleryPreviewPhotos = (profileData.photos || [])
    .filter((p) => !p.exclude_from_gallery && previewPhotoIds.includes(p.id))
    .slice(0, 6);

  return (
    <div className="relative min-h-screen w-full bg-background overflow-x-hidden">

      {/* ── Hero Section ── */}
      <section className="min-h-screen flex flex-col justify-center relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-24 pb-16">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] rounded-full bg-accent/10 blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[30rem] h-[30rem] rounded-full bg-highlight/10 blur-[100px] pointer-events-none z-0" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10 w-full">

          {/* Left: Copy and CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 max-w-2xl"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent font-semibold text-xs tracking-wider uppercase mb-2">
              <Code2 size={13} />
              <span>AI &nbsp;•&nbsp; MLOps &nbsp;•&nbsp; Cloud Platforms</span>
            </div>

            <h1 className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl leading-tight text-foreground tracking-tight">
              {profileData.personal.name}
            </h1>

            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-accent to-highlight bg-clip-text text-transparent">
              Senior MLOps / ML Platform Engineer
            </p>

            <div className="flex items-center gap-1.5 text-muted justify-center lg:justify-start text-sm">
              <MapPin size={16} className="text-accent" />
              <span>Pune, Maharashtra</span>
            </div>

            <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">
              Passionate about building AI platforms, continuous learning, family values, travel, fitness and meaningful relationships.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
              <Link
                href="/about"
                className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl shadow-lg shadow-accent/25 hover:shadow-accent/35 transition-all duration-300 w-full sm:w-auto"
              >
                <span>Explore My Journey</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/chat"
                className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-xl transition-all duration-300 w-full sm:w-auto border border-card-border/80"
              >
                <MessageSquare size={16} className="text-accent" />
                <span>Ask Atul</span>
              </Link>
            </div>

            <div className="pt-2">
              <Link
                href="/biodata"
                className="inline-flex items-center space-x-1.5 text-sm font-semibold text-muted hover:text-foreground transition-colors group"
              >
                <ArrowDownToLine size={16} className="group-hover:translate-y-0.5 transition-transform" />
                <span>Download Matrimonial Biodata</span>
              </Link>
            </div>
          </motion.div>

          {/* Right: Photo + Personal Info Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex-1 w-full max-w-md flex flex-col gap-6 items-center"
          >
            {/* Profile Photo */}
            <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-card-border/90 group bg-secondary/10">
              <Image
                src="/images/profile-photo.jpg"
                alt="Atul Choubey"
                fill
                priority
                className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent pointer-events-none" />
            </div>

            {/* Personal snapshot card */}
            <div className="w-full glass-panel rounded-2xl border border-card-border/80 p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Current Role", value: "Senior MLOps Engineer" },
                  { label: "Company", value: "Accenture · UBS" },
                  { label: "Based In", value: "Pune, Maharashtra" },
                  { label: "Native Place", value: "Ahirauli, Buxar, Bihar" },
                  { label: "Experience", value: "6+ Years in Tech" },
                  { label: "Education", value: "B.Tech IT — CIT, Coimbatore" },
                ].map(({ label, value }) => (
                  <div key={label} className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{label}</p>
                    <p className="text-xs sm:text-sm font-semibold text-foreground leading-snug">{value}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-card-border/40 pt-3 flex flex-wrap gap-2">
                {["MLOps", "Cloud", "AI Platforms", "Family Values", "Guitar", "Travel"].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 text-[11px] font-semibold bg-secondary/70 text-muted rounded-lg border border-card-border/50">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center no-print">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-1">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
            <ChevronDown
              size={18}
              className="text-muted hover:text-foreground transition-colors cursor-pointer"
              onClick={() => document.getElementById("career-highlights")?.scrollIntoView({ behavior: "smooth" })}
            />
          </motion.div>
        </div>
      </section>

      {/* ── Career Highlights ── */}
      <section id="career-highlights" className="relative w-full py-20 z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center space-y-3">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-1.5 px-3 py-1 bg-secondary text-accent rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              <Briefcase size={13} />
              <span>Career</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight"
            >
              Career Highlights
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {careerHighlights.map((h, idx) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: idx * 0.07 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-panel rounded-2xl p-5 border border-card-border/80 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 flex items-start gap-4 group"
              >
                <div className="mt-0.5 shrink-0 p-2 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
                  {h.icon}
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-foreground group-hover:text-accent transition-colors leading-tight">
                    {h.title}
                  </h3>
                  <p className="text-xs text-muted mt-0.5">{h.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Life Beyond Work ── */}
      <section className="relative w-full py-20 bg-card/10 border-y border-card-border/40 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center space-y-3">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-1.5 px-3 py-1 bg-secondary text-accent rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              <Heart size={13} />
              <span>Beyond Work</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight"
            >
              Life Beyond Work
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted max-w-xl mx-auto text-sm sm:text-base"
            >
              Technology is what I do — but family, music, travel, and fitness are who I am.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {lifeCards.map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass-panel rounded-2xl overflow-hidden border border-card-border/80 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 flex flex-col group"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary/20">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover object-top group-hover:scale-[1.06] transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color} mix-blend-multiply opacity-40`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                </div>
                <div className="p-4 space-y-2 flex-grow">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-accent/10 rounded-lg">
                      {card.icon}
                    </div>
                    <h3 className="font-display font-bold text-sm text-foreground group-hover:text-accent transition-colors">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link
              href="/family"
              className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl shadow-lg shadow-accent/25 transition-all duration-300 group"
            >
              <Users size={16} />
              <span>Meet My Family</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/gallery"
              className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/80 border border-card-border/80 text-foreground font-semibold rounded-xl transition-all duration-300 group"
            >
              <Camera size={16} className="text-accent" />
              <span>View Gallery</span>
              <ArrowRight size={14} className="text-accent group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Life Story Gist ── */}
      <section id="life-story" className="relative w-full py-24 z-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">

          <div className="text-center space-y-3">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-1.5 px-3 py-1 bg-secondary text-accent rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              <Rocket size={13} />
              <span>Life in Brief</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight"
            >
              My Journey So Far
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted max-w-xl mx-auto text-sm sm:text-base"
            >
              From Patna to Coimbatore to Pune — a life shaped by education, discipline, and technology.
            </motion.p>
          </div>

          {/* Milestone Cards */}
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-card-border/60 to-transparent -translate-y-1/2 z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 relative z-10">
              {milestones.map((m, idx) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="glass-panel rounded-2xl p-5 border border-card-border/80 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 flex flex-col items-center text-center gap-3 group cursor-default"
                >
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {m.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-accent block">{m.year}</span>
                    <h3 className="font-display font-bold text-sm text-foreground leading-tight mt-0.5">{m.title}</h3>
                    <p className="text-[11px] text-muted mt-1 leading-snug">{m.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl shadow-lg shadow-accent/25 transition-all duration-300 group"
            >
              <span>Read Full Story</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Meet My Family ── */}
      <section id="meet-my-family" className="relative w-full py-24 bg-card/10 border-y border-card-border/40 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center space-y-3">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-1.5 px-3 py-1 bg-secondary text-accent rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              <Heart size={13} />
              <span>Family</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight"
            >
              Meet My Family
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted max-w-xl mx-auto text-sm sm:text-base leading-relaxed"
            >
              The people who anchor and inspire my personal and professional life.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Shri Manoranjan Choubey", relation: "Father", role: "Income Tax Advocate", img: "/images/me-with-my-father-add-this-photo-in-family-intro.jpg" },
              { name: "Smt. Anita Choubey", relation: "Mother", role: "Homemaker", img: "/images/mom-profile-photo.jpg" },
              { name: "Rahul Choubey", relation: "Brother", role: "Advocate", img: "/images/rahul-profile-photo.jpg" },
            ].map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.55, delay: idx * 0.12 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="glass-panel p-5 rounded-2xl border border-card-border/80 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 flex flex-col items-center text-center space-y-4 group shadow-sm"
              >
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-accent/25 group-hover:border-accent/60 transition-colors shadow-lg bg-secondary/20">
                  <Image
                    src={member.img}
                    alt={member.name}
                    fill
                    sizes="96px"
                    className="object-contain object-center"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-accent">
                    {member.relation}
                  </span>
                  <h3 className="font-display font-bold text-base text-foreground leading-tight group-hover:text-accent transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs text-muted">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center pt-4"
          >
            <Link
              href="/family"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-secondary hover:bg-secondary/80 border border-card-border/80 text-foreground font-semibold rounded-xl transition-all duration-300 group"
            >
              <span>View Family Section</span>
              <ArrowRight size={14} className="text-accent group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Gallery Preview ── */}
      <section className="relative w-full py-24 z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/4 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center space-y-3">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-1.5 px-3 py-1 bg-secondary text-accent rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              <Camera size={13} />
              <span>Gallery</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight"
            >
              Life Through Pictures
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted max-w-xl mx-auto text-sm sm:text-base"
            >
              A few snapshots from my journey — family, traditions, and moments that matter.
            </motion.p>
          </div>

          {galleryPreviewPhotos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
              {galleryPreviewPhotos.map((photo, idx) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                  className="relative overflow-hidden rounded-2xl border border-card-border/80 hover:border-accent/40 shadow-sm hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 group cursor-pointer aspect-square"
                >
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="w-full h-full object-cover object-top group-hover:scale-[1.06] transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <p className="text-xs font-semibold text-white leading-tight line-clamp-2">{photo.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl shadow-lg shadow-accent/25 transition-all duration-300 group"
            >
              <Camera size={16} />
              <span>View Full Gallery</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
