"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { Award, ExternalLink, Download, Eye, ShieldCheck, X, FileText } from "lucide-react";
import { profileData } from "@/data/profile";

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credential_id: string;
  src: string;
  type: string;
  verified: boolean;
}

export default function Certifications() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const certs: Certificate[] = profileData.certificates || [];

  return (
    <PageWrapper>
      <div className="space-y-16">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-1.5 px-3 py-1 bg-secondary text-accent rounded-full text-xs font-semibold uppercase tracking-wider"
          >
            <Award size={14} />
            <span>Credentials & Proofs</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-extrabold text-4xl sm:text-5xl leading-tight text-foreground"
          >
            Verified Certifications
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-muted leading-relaxed"
          >
            Educational degrees, high school marksheets, and professional qualifications. Click any credential to preview or download.
          </motion.p>
        </div>

        {/* Certificate Wall Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {certs.map((cert, idx) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-panel p-6 rounded-2xl border border-card-border flex flex-col justify-between hover:border-accent/40 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
            >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-accent/10 rounded-xl">
                    <Award size={20} className="text-accent" />
                  </div>
                  {cert.verified && (
                    <span className="flex items-center space-x-1 text-[10px] font-bold text-success px-2.5 py-1 bg-success/10 rounded-full border border-success/20">
                      <ShieldCheck size={10} />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-highlight">
                    {cert.type}
                  </span>
                  <h3 className="font-display font-bold text-lg text-foreground group-hover:text-accent transition-colors leading-tight">
                    {cert.name}
                  </h3>
                  <p className="text-sm font-semibold text-muted">
                    {cert.issuer}
                  </p>
                  <p className="text-xs text-muted/80">
                    Issued: {cert.date}
                  </p>
                </div>
              </div>

              {/* Card Footer & Action Triggers */}
              <div className="mt-8 pt-4 border-t border-card-border/60 flex items-center justify-between relative z-10 text-xs font-semibold">
                <span className="text-muted text-[10px] font-mono select-all">
                  {cert.credential_id}
                </span>

                <div className="flex items-center gap-2">
                  {cert.src ? (
                    <>
                      <button
                        onClick={() => setSelectedCert(cert)}
                        className="p-2 bg-secondary/80 text-muted hover:text-foreground hover:bg-secondary rounded-lg transition-colors cursor-pointer"
                        title="Preview document"
                      >
                        <Eye size={14} />
                      </button>
                      <a
                        href={cert.src}
                        download
                        className="p-2 bg-secondary/80 text-muted hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                        title="Download document"
                      >
                        <Download size={14} />
                      </a>
                    </>
                  ) : (
                    // For certifications without file upload (e.g. professional Microsoft badge)
                    <span className="text-[10px] text-accent/80 flex items-center gap-0.5">
                      <ShieldCheck size={12} />
                      <span>ID Verified</span>
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Preview Lightbox Modal */}
        <AnimatePresence>
          {selectedCert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setSelectedCert(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-4xl bg-card rounded-3xl border border-card-border/80 p-6 flex flex-col items-center shadow-2xl h-[85vh]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="w-full flex items-center justify-between pb-4 border-b border-card-border/60 mb-4">
                  <div className="space-y-0.5">
                    <h2 className="font-display font-bold text-lg sm:text-xl text-foreground">
                      {selectedCert.name}
                    </h2>
                    <p className="text-xs text-muted">
                      {selectedCert.issuer} • {selectedCert.credential_id}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="p-2 bg-secondary/80 text-foreground rounded-full hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Content Preview (Support Image or PDF) */}
                <div className="flex-1 w-full relative bg-secondary/15 rounded-2xl overflow-hidden flex items-center justify-center border border-card-border/40">
                  {selectedCert.src.endsWith(".pdf") ? (
                    <iframe
                      src={`${selectedCert.src}#toolbar=0`}
                      className="w-full h-full rounded-2xl border-none bg-white"
                      title={selectedCert.name}
                    />
                  ) : (
                    <img
                      src={selectedCert.src}
                      alt={selectedCert.name}
                      className="max-w-full max-h-full object-contain rounded-2xl"
                    />
                  )}
                </div>

                {/* Modal Footer Controls */}
                <div className="w-full flex justify-end gap-3 pt-4 border-t border-card-border/60 mt-4">
                  <a
                    href={selectedCert.src}
                    download
                    className="flex items-center space-x-2 px-5 py-2.5 bg-accent hover:bg-accent/90 text-white font-semibold text-xs rounded-xl shadow-lg shadow-accent/20 transition-all cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Download Original</span>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageWrapper>
  );
}
