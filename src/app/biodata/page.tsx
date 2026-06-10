"use client";

import React from "react";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { Printer, ArrowLeft, Mail, Phone, Globe, MapPin, Briefcase, Users, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { profileData } from "@/data/profile";

export default function Biodata() {
  const p = profileData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageWrapper>
      <div className="space-y-8 max-w-4xl mx-auto">
        
        {/* Header toolbar (Hidden in Print) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-card-border/80 no-print">
          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className="p-2 text-muted hover:text-foreground hover:bg-secondary/40 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </Link>
            <span className="text-xs text-muted">|</span>
            <span className="text-xs font-semibold text-muted">A4 Printable Format</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-grow sm:flex-grow-0 flex items-center justify-center space-x-2 px-5 py-2.5 bg-accent hover:bg-accent/90 text-white font-semibold text-xs rounded-xl shadow-lg shadow-accent/20 transition-all cursor-pointer"
            >
              <Printer size={14} />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Biodata Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="print-container bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-3xl p-8 sm:p-12 md:p-16 max-w-4xl mx-auto relative overflow-hidden transition-colors"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {/* Subtle design accents for printable view */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-accent to-highlight" />

          {/* Title & Name */}
          <div className="text-center space-y-3 pb-8 border-b border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent">
              Matrimonial Biodata
            </h2>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              {p.personal.name}
            </h1>
            <p className="text-sm font-semibold text-slate-500 max-w-md mx-auto">
              Senior MLOps Engineer • Born {p.personal.birth_display.split(" ")[2]} • {p.personal.gothra} Gotra
            </p>
          </div>

          {/* Grid Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            
            {/* Left Column: Personal Stats & Contact */}
            <div className="md:col-span-1 space-y-6 md:border-r md:border-slate-200 md:pr-6">
              
              {/* Photo Container */}
              <div className="relative aspect-[4/5] w-full max-w-[200px] mx-auto rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shadow-md">
                <Image
                  src="/images/profile-photo.jpg"
                  alt="Atul Choubey Portrait"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Personal Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-accent uppercase tracking-wider border-b border-slate-100 pb-1">
                  Personal Details
                </h3>
                <dl className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <dt className="font-semibold text-slate-500">Date of Birth:</dt>
                    <dd className="font-bold">{p.personal.birth_display}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-semibold text-slate-500">Birth Place:</dt>
                    <dd className="font-bold">{p.personal.birth_place}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-semibold text-slate-500">Age:</dt>
                    <dd className="font-bold">{p.personal.age} Years</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-semibold text-slate-500">Height:</dt>
                    <dd className="font-bold">{p.personal.height}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-semibold text-slate-500">Gotra:</dt>
                    <dd className="font-bold">{p.personal.gothra}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-semibold text-slate-500">Zodiac (Rashi):</dt>
                    <dd className="font-bold">{p.personal.rashi.split(" ")[0]}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-semibold text-slate-500">Marital Status:</dt>
                    <dd className="font-bold">Never Married</dd>
                  </div>
                </dl>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-accent uppercase tracking-wider border-b border-slate-100 pb-1">
                  Contact
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Mail size={12} className="text-slate-400 shrink-0" />
                    <span className="font-semibold">{p.personal.email}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone size={12} className="text-slate-400 shrink-0" />
                    <span className="font-semibold">{p.personal.phone}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Globe size={12} className="text-slate-400 shrink-0" />
                    <span className="font-semibold">{p.personal.linkedin.split("/")[0]}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin size={12} className="text-slate-400 shrink-0 mt-0.5" />
                    <span className="font-semibold leading-tight">{p.personal.native_place}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Career, Family & Values */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Career & Education */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-accent uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center gap-2">
                  <Briefcase size={14} className="text-slate-400" />
                  <span>Education & Professional Career</span>
                </h3>
                <div className="space-y-3">
                  <div className="text-xs space-y-1">
                    <h4 className="font-bold text-slate-800 text-sm">Senior MLOps / ML Platform Engineer</h4>
                    <p className="font-semibold text-slate-600">Accenture (Client: UBS) — 2025 - Present</p>
                    <p className="text-slate-500 leading-relaxed text-[11px]">
                      Architecting configuration-driven ML training and deployment pipelines using GitLab CI/CD, CDSW, and MLflow for automated versioning.
                    </p>
                  </div>
                  <div className="text-xs space-y-1">
                    <h4 className="font-bold text-slate-800 text-sm">Senior Software Engineer – DevOps & Automation</h4>
                    <p className="font-semibold text-slate-600">Bosch Global Software Technology — 2023 - 2024</p>
                    <p className="text-slate-500 leading-relaxed text-[11px]">
                      Built Python automation scripts integrating Jenkins REST APIs to stream build metrics into Grafana and InfluxDB.
                    </p>
                  </div>
                  <div className="text-xs space-y-1">
                    <h4 className="font-bold text-slate-800 text-sm">{p.education.ug.degree} in {p.education.ug.specialization}</h4>
                    <p className="font-semibold text-slate-600">{p.education.ug.institute} — {p.education.ug.period}</p>
                    <p className="text-slate-500 leading-relaxed text-[11px]">
                      Graduated from Anna University (Autonomous) in September {p.education.ug.passing_year} with {p.education.ug.classification}.
                    </p>
                  </div>
                </div>
              </div>

              {/* Family Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-accent uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center gap-2">
                  <Users size={14} className="text-slate-400" />
                  <span>Family Details</span>
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  <div>
                    <dt className="font-semibold text-slate-500">Father:</dt>
                    <dd className="font-bold">{p.family.father.name}</dd>
                    <dd className="text-slate-500 text-[10px]">{p.family.father.occupation}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-500">Mother:</dt>
                    <dd className="font-bold">{p.family.mother.name}</dd>
                    <dd className="text-slate-500 text-[10px]">{p.family.mother.occupation}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-500">Brother:</dt>
                    <dd className="font-bold">{p.family.brother.name}</dd>
                    <dd className="text-slate-500 text-[10px]">{p.family.brother.occupation}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-500">Native Place:</dt>
                    <dd className="font-bold">{p.family.roots.village}, {p.family.roots.district}, {p.family.roots.state}</dd>
                  </div>
                </dl>
              </div>

              {/* Core Values / Lifestyle */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-accent uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center gap-2">
                  <Heart size={14} className="text-slate-400" />
                  <span>Values & Lifestyle</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Highly disciplined lifestyle combining physical fitness, continuous learning, and software building. Anchored in traditional family values (integrity, education, respect) while practicing a modern, forward-thinking outlook.
                </p>
              </div>

            </div>

          </div>

          {/* Footer note */}
          <div className="mt-12 pt-6 border-t border-slate-200 text-center text-[10px] text-slate-400">
            Self-attested authentic details. Digitally verified at atulchoubey.com
          </div>
        </motion.div>

      </div>
    </PageWrapper>
  );
}
