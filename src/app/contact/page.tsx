"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldAlert, Sparkles, MessageSquare } from "lucide-react";
import confetti from "canvas-confetti";

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
  securityAnswer: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  securityAnswer?: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
    securityAnswer: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Math challenge for anti-spam
  const securityQuestion = "What is 4 + 5?";
  const expectedAnswer = "9";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (10-15 digits)";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 15) {
      newErrors.message = "Please write a slightly longer message (min 15 chars)";
    }

    if (formData.securityAnswer.trim() !== expectedAnswer) {
      newErrors.securityAnswer = "Security answer is incorrect";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API route handler call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
      
      // Trigger canvas-confetti success explosion
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#38bdf8", "#22c55e", "#f59e0b"],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", message: "", securityAnswer: "" });
    setErrors({});
    setIsSuccess(false);
  };

  return (
    <PageWrapper>
      <div className="space-y-12 max-w-5xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-1.5 px-3 py-1 bg-secondary text-accent rounded-full text-xs font-semibold uppercase tracking-wider"
          >
            <MessageSquare size={14} />
            <span>Connect</span>
          </motion.div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-foreground">
            Get In Touch
          </h1>
          <p className="text-base sm:text-lg text-muted">
            For professional collaboration or serious matrimonial inquiries, please complete the secure message registry.
          </p>
        </div>

        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* Left Block: Core coordinates */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-card-border/80 space-y-6">
              <h3 className="font-display font-bold text-xl text-foreground">
                Contact Directory
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Whether you represent a financial institution, machine learning venture, or are interested in a respectful family alliance, you can reach me directly.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-accent/10 rounded-xl text-accent shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="text-xs text-muted block font-semibold">Email Registry</span>
                    <a href="mailto:contact@atulchoubey.com" className="text-sm font-bold text-foreground hover:text-accent transition-colors">
                      contact@atulchoubey.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-accent/10 rounded-xl text-accent shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="text-xs text-muted block font-semibold">Voice Line</span>
                    <span className="text-sm font-bold text-foreground">
                      +91 (Secure mat-line)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-accent/10 rounded-xl text-accent shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="text-xs text-muted block font-semibold">Native Place</span>
                    <span className="text-sm font-bold text-foreground leading-tight block">
                      Ahirauli, Buxar, Bihar
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium details block */}
            <div className="glass-panel p-6 rounded-2xl border border-card-border/60 bg-secondary/10 flex items-start gap-3">
              <Sparkles size={18} className="text-accent shrink-0 mt-0.5" />
              <span className="text-xs text-muted leading-relaxed">
                All messages received are parsed securely and kept strictly confidential. I review responses daily and reply to verified submissions promptly.
              </span>
            </div>
          </div>

          {/* Right Block: Secure Contact Form */}
          <div className="lg:col-span-3">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-card-border shadow-xl relative min-h-[400px] flex flex-col justify-center">
              
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="contact-form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-muted uppercase tracking-wider block">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className={`w-full px-4 py-3 text-sm rounded-xl bg-background border ${
                            errors.name ? "border-red-500" : "border-card-border"
                          } focus:outline-none focus:border-accent transition-colors`}
                        />
                        {errors.name && <span className="text-[10px] text-red-500 font-bold block">{errors.name}</span>}
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-muted uppercase tracking-wider block">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@domain.com"
                          className={`w-full px-4 py-3 text-sm rounded-xl bg-background border ${
                            errors.email ? "border-red-500" : "border-card-border"
                          } focus:outline-none focus:border-accent transition-colors`}
                        />
                        {errors.email && <span className="text-[10px] text-red-500 font-bold block">{errors.email}</span>}
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted uppercase tracking-wider block">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        className={`w-full px-4 py-3 text-sm rounded-xl bg-background border ${
                          errors.phone ? "border-red-500" : "border-card-border"
                        } focus:outline-none focus:border-accent transition-colors`}
                      />
                      {errors.phone && <span className="text-[10px] text-red-500 font-bold block">{errors.phone}</span>}
                    </div>

                    {/* Message */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted uppercase tracking-wider block">Message Details</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Please elaborate on your inquiry (professional or matrimonial context)..."
                        className={`w-full px-4 py-3 text-sm rounded-xl bg-background border ${
                          errors.message ? "border-red-500" : "border-card-border"
                        } focus:outline-none focus:border-accent transition-colors resize-none`}
                      />
                      {errors.message && <span className="text-[10px] text-red-500 font-bold block">{errors.message}</span>}
                    </div>

                    {/* Anti-spam Verification */}
                    <div className="space-y-1 border-t border-card-border/60 pt-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <label className="text-xs font-bold text-muted uppercase tracking-wider block">
                          Spam Protection: <span className="text-accent">{securityQuestion}</span>
                        </label>
                        <input
                          type="text"
                          name="securityAnswer"
                          value={formData.securityAnswer}
                          onChange={handleChange}
                          placeholder="Your answer"
                          className={`w-28 px-3 py-1.5 text-sm rounded-lg bg-background border ${
                            errors.securityAnswer ? "border-red-500" : "border-card-border"
                          } focus:outline-none focus:border-accent transition-colors text-center font-bold`}
                        />
                      </div>
                      {errors.securityAnswer && <span className="text-[10px] text-red-500 font-bold block text-right">{errors.securityAnswer}</span>}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center space-x-2 py-3.5 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl shadow-lg shadow-accent/25 hover:shadow-accent/35 transition-all duration-300 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Transmit Secure Registry</span>
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-screen"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-6 py-6"
                  >
                    <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto border border-success/20">
                      <CheckCircle2 size={36} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display font-extrabold text-2xl text-foreground">
                        Transmission Successful
                      </h3>
                      <p className="text-sm text-muted max-w-sm mx-auto leading-relaxed">
                        Thank you for your message, <strong className="text-foreground">{formData.name}</strong>. Your query has been logged securely. Atul will review it and reply back to <strong className="text-foreground">{formData.email}</strong> soon.
                      </p>
                    </div>

                    <button
                      onClick={resetForm}
                      className="px-6 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-xs rounded-xl border border-card-border/80 transition-colors cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </PageWrapper>
  );
}
