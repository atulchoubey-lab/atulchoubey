"use client";

import React from "react";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { Cpu, Terminal, ShieldCheck, Zap, Briefcase, Award, Database, Layers } from "lucide-react";
import { profileData } from "@/data/profile";

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "MLOps & Cloud Platforms",
    icon: <Database size={18} />,
    skills: ["MLflow", "Azure ML", "Model Registry", "CDSW", "uv", "Azure"],
  },
  {
    title: "Programming & Machine Learning",
    icon: <Cpu size={18} />,
    skills: ["Python", "Bash", "SQL", "PyTorch", "Scikit-Learn", "YAML"],
  },
  {
    title: "DevOps & Infrastructure",
    icon: <Layers size={18} />,
    skills: ["Kubernetes", "Docker", "Ansible", "GitLab CI", "Jenkins", "Git", "Linux", "Grafana", "InfluxDB", "RTC", "REST", "Node.js"],
  },
];

interface Job {
  company: string;
  role: string;
  period: string;
  logoColor: string;
  description: string[];
  skills: string[];
}

const jobProgression: Job[] = [
  {
    company: "Accenture (Client: UBS)",
    role: "Senior MLOps / ML Platform Engineer",
    period: "01/2025 - Present",
    logoColor: "from-purple-600 to-indigo-600",
    description: [
      "Architect configuration-driven ML training and deployment pipelines using GitLab CI/CD, CDSW, and MLflow for automated versioning and tracking.",
      "Redesign model pipelines from branch-per-model to single parameterized CI/CD system, enabling N-model × M-environment deployments.",
      "Develop 'aes_cdsw_api', an internal Python library abstracting CDSW deployment APIs to standardize model releases from GitLab CI.",
      "Design dual-workspace Azure ML promotion architectures (training + inference) with Ansible-based orchestration and uv package management.",
    ],
    skills: ["Azure ML", "MLflow", "GitLab CI", "Ansible", "Python", "Kubernetes"],
  },
  {
    company: "Bosch Global Software Technology",
    role: "Senior Software Engineer – DevOps & Python Automation",
    period: "01/2023 - 12/2024",
    logoColor: "from-blue-500 to-sky-500",
    description: [
      "Built Python automation integrating RTC, RQM, and Jenkins REST APIs to stream operational build metrics into Grafana and InfluxDB.",
      "Maintained over 50 CI build pipelines, reducing resolution times to ~20 minutes through python-based automated triage tooling.",
      "Developed data ingestion utilities for large-scale enterprise build infrastructures, improving workflow observability.",
    ],
    skills: ["Python", "Jenkins", "Grafana", "InfluxDB", "RTC", "REST"],
  },
  {
    company: "Kalycito Infotech",
    role: "DevOps & Platform Engineer",
    period: "10/2020 - 12/2022",
    logoColor: "from-emerald-500 to-teal-500",
    description: [
      "Deployed and managed multi-node Kubernetes clusters supporting 20+ containerized services at 99.9% uptime.",
      "Configured autoscaling, resource quotas, and workload scheduling parameters.",
      "Built Docker packaging pipelines for consistent containerized deployments and developed Python test scripts.",
    ],
    skills: ["Kubernetes", "Docker", "Python", "Linux", "Git"],
  },
];

interface Achievement {
  title: string;
  client: string;
  impact: string;
  details: string;
  icon: React.ReactNode;
}

const achievements: Achievement[] = [
  {
    title: "Innovative ML Pipeline Automation",
    client: "Accenture (Client: UBS)",
    impact: "Parameterised Deployment",
    details: "Successfully redesigned multi-model deployment and developed a custom Python library that completely automated the model release process.",
    icon: <ShieldCheck size={20} className="text-emerald-500" />,
  },
  {
    title: "CI Metrics & Triage Automation",
    client: "Bosch Global Software Technology",
    impact: "~20 Min Triage Resolution",
    details: "Replaced manual reporting with live Grafana dashboards and created a triage system to troubleshoot and fix CI pipeline failures rapidly.",
    icon: <Zap size={20} className="text-amber-500" />,
  },
];

const stats = [
  { label: "Years Experience", val: "6+" },
  { label: "Pipelines Maintained", val: "50+" },
  { label: "Deployment Configurations", val: "Single parameterized" },
  { label: "Kubernetes Uptime SLA", val: "99.9%" },
];

export default function Career() {
  return (
    <PageWrapper>
      <div className="space-y-16">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-1.5 px-3 py-1 bg-secondary text-accent rounded-full text-xs font-semibold uppercase tracking-wider"
          >
            <Briefcase size={14} />
            <span>Professional Career</span>
          </motion.div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-foreground">
            Professional Story
          </h1>
          <p className="text-base sm:text-lg text-muted">
            Designing MLOps and cloud automation infrastructure for financial banking environments and automotive software groups.
          </p>
        </div>

        {/* Dynamic Counters Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="glass-panel p-6 rounded-2xl border border-card-border text-center flex flex-col justify-center items-center space-y-1.5 hover:border-accent/30 transition-all duration-300"
            >
              <span className="font-display font-extrabold text-2xl sm:text-3xl text-accent">
                {stat.val}
              </span>
              <span className="text-xs sm:text-sm text-muted font-medium">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Main Work History */}
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="font-display font-bold text-2xl text-foreground border-l-4 border-accent pl-3">
            Career Progression
          </h2>
          
          <div className="space-y-6">
            {jobProgression.map((job, idx) => (
              <motion.div
                key={job.company}
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-panel p-6 sm:p-8 rounded-2xl border border-card-border hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
              >
                {/* Visual Company Strip */}
                <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${job.logoColor}`} />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pl-2">
                  <div>
                    <h3 className="font-display font-bold text-xl text-foreground group-hover:text-accent transition-colors">
                      {job.role}
                    </h3>
                    <p className="text-sm font-semibold text-highlight">
                      {job.company}
                    </p>
                  </div>
                  <span className="inline-block px-3 py-1 bg-secondary text-muted font-mono text-xs font-semibold rounded-lg self-start sm:self-center">
                    {job.period}
                  </span>
                </div>

                <ul className="space-y-2 mb-6 pl-2 list-disc list-outside text-sm sm:text-base text-muted ml-4">
                  {job.description.map((desc, dIdx) => (
                    <li key={dIdx} className="leading-relaxed">
                      {desc}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5 pl-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] sm:text-xs px-2.5 py-1 bg-secondary/70 text-foreground font-semibold rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tech Cloud */}
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="font-display font-bold text-2xl text-foreground border-l-4 border-accent pl-3">
            Technology Competence
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skillCategories.map((cat, idx) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-panel p-6 rounded-2xl border border-card-border flex flex-col h-full hover:border-accent/40 transition-all duration-300"
              >
                <div className="flex items-center space-x-2 text-accent mb-4 border-b border-card-border/60 pb-2">
                  {cat.icon}
                  <h3 className="font-display font-bold text-base text-foreground">
                    {cat.title}
                  </h3>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1.5 bg-background border border-card-border/60 text-muted hover:text-foreground hover:border-accent/40 rounded-xl transition-colors font-medium cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="font-display font-bold text-2xl text-foreground border-l-4 border-accent pl-3">
            Featured Achievements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-panel p-6 rounded-2xl border border-card-border flex flex-col justify-between hover:border-accent/40 transition-all duration-300 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-accent/10 rounded-xl">
                      {item.icon}
                    </div>
                    <span className="text-xs font-bold text-success px-2.5 py-0.5 bg-success/10 rounded-full">
                      {item.impact}
                    </span>
                  </div>
                  
                  <h3 className="font-display font-bold text-lg text-foreground group-hover:text-accent transition-colors pt-2">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-highlight uppercase tracking-wider">
                    {item.client}
                  </p>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.details}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
