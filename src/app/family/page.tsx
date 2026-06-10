"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { Users, Heart, Shield, BookOpen, Compass, Scale, Landmark, ArrowRight, Camera } from "lucide-react";
import { profileData } from "@/data/profile";

interface FamilyMember {
  relation: string;
  name: string;
  occupation: string;
  imageSrc: string;
  details: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" as const }
  })
};

export default function Family() {
  const f = profileData.family;

  const familyMembers: FamilyMember[] = [
    {
      relation: "Father",
      name: "Shri Manoranjan Choubey",
      occupation: "Income Tax Advocate",
      imageSrc: "/images/papa-profile-photo.jpg",
      details: f.father.details
    },
    {
      relation: "Mother",
      name: "Smt. Anita Choubey",
      occupation: "Homemaker",
      imageSrc: "/images/mom-profile-photo.jpg",
      details: f.mother.details
    },
    {
      relation: "Brother",
      name: "Rahul Choubey",
      occupation: "Advocate",
      imageSrc: "/images/rahul-profile-photo.jpg",
      details: f.brother.details
    }
  ];

  const valueIcons: Record<string, React.ReactNode> = {
    "Integrity": <Shield className="text-accent" size={20} />,
    "Education": <BookOpen className="text-accent" size={20} />,
    "Respect": <Heart className="text-accent" size={20} />,
    "Tradition": <Landmark className="text-accent" size={20} />,
    "Continuous Growth": <Compass className="text-accent" size={20} />,
    "Family First": <Users className="text-accent" size={20} />,
  };

  return (
    <PageWrapper>
      <div className="space-y-16 max-w-5xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-1.5 px-3 py-1 bg-secondary text-accent rounded-full text-xs font-semibold uppercase tracking-wider"
          >
            <Users size={14} />
            <span>Family & Roots</span>
          </motion.div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-foreground">
            My Family
          </h1>
          <p className="text-base sm:text-lg text-muted">
            Rooted in heritage, driven by education, and guided by family values. Meet my parents and my brother who support and inspire me.
          </p>
        </div>

        {/* Family Member Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {familyMembers.map((member, idx) => (
            <motion.div
              key={member.name}
              custom={idx}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="glass-panel rounded-2xl overflow-hidden border border-card-border hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300 flex flex-col group shadow-sm"
            >
              {/* Photo Area */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary/10">
                <img
                  src={member.imageSrc}
                  alt={member.name}
                  className="w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-full bg-accent text-white shadow-lg">
                  {member.relation}
                </span>
              </div>

              {/* Detail Area */}
              <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-xl text-foreground group-hover:text-accent transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-highlight uppercase tracking-wider">
                    {member.occupation}
                  </p>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  {member.details}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gallery CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center pt-2"
        >
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/80 border border-card-border/80 text-foreground font-semibold rounded-xl transition-all duration-300 group"
          >
            <Camera size={16} className="text-accent" />
            <span>View Family Photos in Gallery</span>
            <ArrowRight size={14} className="text-accent group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Heritage Roots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 rounded-2xl border border-card-border hover:border-accent/20 transition-colors"
          >
            <h3 className="font-display font-bold text-lg text-foreground mb-2 flex items-center gap-2">
              <Landmark size={18} className="text-accent" />
              <span>Native Origins & Gotra</span>
            </h3>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              We belong to <strong className="text-foreground">{f.roots.village}</strong> village, situated in the Buxar district of Bihar. Our lineage is associated with the <strong className="text-foreground">{f.roots.gotra} Gotra</strong>, representing our family tradition and roots.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 rounded-2xl border border-card-border hover:border-accent/20 transition-colors"
          >
            <h3 className="font-display font-bold text-lg text-foreground mb-2 flex items-center gap-2">
              <Scale size={18} className="text-accent" />
              <span>Professional Foundations</span>
            </h3>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Our household deeply values education and professional integrity. Both my father and brother practice law in taxation and advocacy, while I focus my efforts in engineering AI and machine learning infrastructure.
            </p>
          </motion.div>
        </div>

        {/* Core Values Section */}
        <div className="space-y-8 pt-4">
          <h2 className="font-display font-bold text-2xl text-foreground border-l-4 border-accent pl-3">
            Core Beliefs & Values
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {f.values.map((val, idx) => (
              <motion.div
                key={val}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="glass-panel p-5 rounded-2xl border border-card-border flex flex-col items-start space-y-3 hover:border-accent/20 transition-colors"
              >
                <div className="p-2 bg-accent/10 rounded-xl">
                  {valueIcons[val] || <Shield className="text-accent" size={18} />}
                </div>
                <h3 className="font-display font-bold text-base text-foreground">
                  {val}
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  Upholding our principles in daily life and work, emphasizing integrity, education, and respect in all we do.
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
