import React, { useState } from 'react';
import { SectionHeading } from './SectionHeading';
import { ContactData } from '../types';
import { Mail, Linkedin, Instagram, Youtube, Facebook, Send, CheckCircle2, ArrowUpRight, ChevronUp } from 'lucide-react';
import { Button } from './Button';
import { motion } from 'motion/react';
import { EditableText, EditableAnchor, EditableLink } from '../admin/Editable';
import { useIsEditMode } from '../admin/EditModeGuard';

interface ContactSectionProps {
  contact: ContactData;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ contact }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Project Inquiry / Discussion',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const isEditMode = useIsEditMode();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) return;
    if (!formData.name || !formData.email || !formData.message) return;

    const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${formData.subject}`);
    const mailtoBody = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
    window.location.href = `mailto:${contact.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 sm:py-28 bg-[#0a0c0f] relative overflow-hidden border-t border-[#1e232e]">
      
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#c5a880]/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          eyebrow={contact.eyebrow ?? 'DIRECT ENGAGEMENT'}
          title={contact.sectionHeading}
          subtitle={contact.subheading}
          editPaths={{
            eyebrow: 'contact.eyebrow',
            title: 'contact.sectionHeading',
            subtitle: 'contact.subheading',
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            
            {/* Mobile: Email | LinkedIn | Instagram | YouTube */}
            <div className="sm:hidden bg-[#14171f] p-4 rounded-sm border border-[#232835] shadow-xl">
              <div className="grid grid-cols-2 gap-3 text-center">
                <EditableAnchor path="contact.email" href={`mailto:${contact.email}`} className="flex flex-col items-center px-1 group cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-[#1c212c] border border-[#c5a880]/40 text-[#c5a880] flex items-center justify-center mb-1.5 group-hover:bg-[#c5a880] group-hover:text-[#0d0f12] transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono text-[#8c92a0] uppercase tracking-wider block">Email</span>
                  <span className="text-[11px] font-sans-body font-semibold text-[#f3f2ee] break-all group-hover:text-[#c5a880] transition-colors leading-tight mt-0.5">
                    <EditableText path="contact.email">{contact.email}</EditableText>
                  </span>
                </EditableAnchor>

                <EditableAnchor path="contact.linkedIn" href={contact.linkedIn || '#'} external className="flex flex-col items-center px-1 group cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-[#1c212c] border border-[#0077b5]/40 text-[#0077b5] flex items-center justify-center mb-1.5 group-hover:bg-[#0077b5] group-hover:text-white transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono text-[#8c92a0] uppercase tracking-wider block">LinkedIn</span>
                  <EditableLink path="contact.linkedIn" href={contact.linkedIn || '#'} className="text-[11px] font-sans-body font-semibold text-[#c5a880] group-hover:underline inline-flex items-center gap-0.5 leading-tight mt-0.5">
                    <span>Connect</span>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </EditableLink>
                </EditableAnchor>

                <EditableAnchor path="contact.instagram" href={contact.instagram || '#'} external className="flex flex-col items-center px-1 group cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-[#1c212c] border border-[#E1306C]/40 text-[#E1306C] flex items-center justify-center mb-1.5 group-hover:bg-[#E1306C] group-hover:text-white transition-colors">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono text-[#8c92a0] uppercase tracking-wider block">Instagram</span>
                  <EditableLink path="contact.instagram" href={contact.instagram || '#'} className="text-[11px] font-sans-body font-semibold text-[#c5a880] group-hover:underline inline-flex items-center gap-0.5 leading-tight mt-0.5">
                    <span>Follow</span>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </EditableLink>
                </EditableAnchor>

                <EditableAnchor path="contact.youtube" href={contact.youtube || '#'} external className="flex flex-col items-center px-1 group cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-[#1c212c] border border-[#FF0000]/40 text-[#FF0000] flex items-center justify-center mb-1.5 group-hover:bg-[#FF0000] group-hover:text-white transition-colors">
                    <Youtube className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono text-[#8c92a0] uppercase tracking-wider block">YouTube</span>
                  <EditableLink path="contact.youtube" href={contact.youtube || '#'} className="text-[11px] font-sans-body font-semibold text-[#c5a880] group-hover:underline inline-flex items-center gap-0.5 leading-tight mt-0.5">
                    <span>Watch</span>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </EditableLink>
                </EditableAnchor>

                <EditableAnchor path="contact.facebook" href={contact.facebook || '#'} external className="flex flex-col items-center px-1 group cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-[#1c212c] border border-[#1877F2]/40 text-[#1877F2] flex items-center justify-center mb-1.5 group-hover:bg-[#1877F2] group-hover:text-white transition-colors">
                    <Facebook className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono text-[#8c92a0] uppercase tracking-wider block">Facebook</span>
                  <EditableLink path="contact.facebook" href={contact.facebook || '#'} className="text-[11px] font-sans-body font-semibold text-[#c5a880] group-hover:underline inline-flex items-center gap-0.5 leading-tight mt-0.5">
                    <span>Follow</span>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </EditableLink>
                </EditableAnchor>
              </div>
            </div>

            {/* Desktop contact card */}
            <div className="hidden sm:flex sm:flex-col gap-6">
              <div className="bg-[#14171f] p-4 sm:p-6 rounded-sm border border-[#232835] hover:border-[#c5a880]/40 transition-colors shadow-xl space-y-3 sm:space-y-6">
                
                <h3 className="text-base sm:text-lg font-serif-title font-semibold text-[#f3f2ee] pb-2 sm:pb-3 border-b border-[#202532]">
                  Contact Information
                </h3>

                <EditableAnchor path="contact.email" href={`mailto:${contact.email}`} className="flex items-center gap-3 sm:gap-4 group p-2 sm:p-3 rounded-xs hover:bg-[#1a1e28] transition-colors">
                  <div className="p-2 sm:p-3 bg-[#1c212c] rounded-sm text-[#c5a880] border border-[#c5a880]/30 group-hover:border-[#c5a880] shrink-0">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-[#8c92a0] block">
                      Email Address
                    </span>
                    <p className="text-xs sm:text-sm font-sans-body font-semibold text-[#f3f2ee] group-hover:text-[#c5a880] transition-colors truncate">
                      <EditableText path="contact.email">{contact.email}</EditableText>
                    </p>
                  </div>
                </EditableAnchor>

                <EditableAnchor path="contact.linkedIn" href={contact.linkedIn || '#'} external className="flex items-center gap-3 sm:gap-4 group p-2 sm:p-3 rounded-xs hover:bg-[#1a1e28] transition-colors">
                  <div className="p-2 sm:p-3 bg-[#1c212c] rounded-sm text-[#0077b5] border border-[#0077b5]/30 group-hover:border-[#0077b5] shrink-0">
                    <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-[#8c92a0] block">
                        LinkedIn Profile
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                    </div>
                    <EditableLink path="contact.linkedIn" href={contact.linkedIn || '#'} className="text-xs sm:text-sm font-sans-body font-semibold text-[#f3f2ee] group-hover:text-[#c5a880] transition-colors truncate block">
                      {contact.linkedIn || 'Add LinkedIn URL'}
                    </EditableLink>
                  </div>
                </EditableAnchor>

                <EditableAnchor path="contact.instagram" href={contact.instagram || '#'} external className="flex items-center gap-3 sm:gap-4 group p-2 sm:p-3 rounded-xs hover:bg-[#1a1e28] transition-colors">
                  <div className="p-2 sm:p-3 bg-[#1c212c] rounded-sm text-[#E1306C] border border-[#E1306C]/30 group-hover:border-[#E1306C] shrink-0">
                    <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-[#8c92a0] block">
                        Instagram
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                    </div>
                    <EditableLink path="contact.instagram" href={contact.instagram || '#'} className="text-xs sm:text-sm font-sans-body font-semibold text-[#f3f2ee] group-hover:text-[#c5a880] transition-colors truncate block">
                      {contact.instagram || 'Add Instagram URL'}
                    </EditableLink>
                  </div>
                </EditableAnchor>

                <EditableAnchor path="contact.youtube" href={contact.youtube || '#'} external className="flex items-center gap-3 sm:gap-4 group p-2 sm:p-3 rounded-xs hover:bg-[#1a1e28] transition-colors">
                  <div className="p-2 sm:p-3 bg-[#1c212c] rounded-sm text-[#FF0000] border border-[#FF0000]/30 group-hover:border-[#FF0000] shrink-0">
                    <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-[#8c92a0] block">
                        YouTube
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                    </div>
                    <EditableLink path="contact.youtube" href={contact.youtube || '#'} className="text-xs sm:text-sm font-sans-body font-semibold text-[#f3f2ee] group-hover:text-[#c5a880] transition-colors truncate block">
                      {contact.youtube || 'Add YouTube URL'}
                    </EditableLink>
                  </div>
                </EditableAnchor>

                <EditableAnchor path="contact.facebook" href={contact.facebook || '#'} external className="flex items-center gap-3 sm:gap-4 group p-2 sm:p-3 rounded-xs hover:bg-[#1a1e28] transition-colors">
                  <div className="p-2 sm:p-3 bg-[#1c212c] rounded-sm text-[#1877F2] border border-[#1877F2]/30 group-hover:border-[#1877F2] shrink-0">
                    <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-[#8c92a0] block">
                        Facebook
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                    </div>
                    <EditableLink path="contact.facebook" href={contact.facebook || '#'} className="text-xs sm:text-sm font-sans-body font-semibold text-[#f3f2ee] group-hover:text-[#c5a880] transition-colors truncate block">
                      {contact.facebook || 'Add Facebook URL'}
                    </EditableLink>
                  </div>
                </EditableAnchor>

              </div>
            </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            {!isMobileExpanded && (
              <div className="lg:hidden bg-[#14171f] p-5 rounded-sm border border-[#c5a880]/40 shadow-xl text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#1c212c] border border-[#c5a880]/30 text-[#c5a880] flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif-title font-semibold text-[#f3f2ee]">
                    Send a Direct Message
                  </h3>
                  <p className="text-xs text-[#8c92a0] mt-1 font-sans-body">
                    Connect directly regarding real estate developments, partnerships, or consulting.
                  </p>
                </div>
                <Button
                  onClick={() => setIsMobileExpanded(true)}
                  variant="primary"
                  size="lg"
                  className="w-full justify-center"
                  showIcon
                >
                  Get In Touch
                </Button>
              </div>
            )}

            <div className={`bg-[#14171f] p-5 sm:p-8 md:p-10 rounded-sm border border-[#232835] shadow-2xl relative ${!isMobileExpanded ? 'hidden lg:block' : 'block'}`}>
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <h3 className="text-xl sm:text-2xl font-serif-title font-semibold text-[#f3f2ee]">
                  Send a Direct Message
                </h3>
                <button
                  onClick={() => setIsMobileExpanded(false)}
                  className="lg:hidden text-xs font-mono text-[#8c92a0] hover:text-[#c5a880] flex items-center gap-1 bg-[#1a1e28] px-2.5 py-1 rounded-xs border border-[#272d3c] transition-colors cursor-pointer"
                  aria-label="Collapse contact form"
                >
                  <span>Close</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-[#8c92a0] mb-6 sm:mb-8 font-sans-body">
                Fill out the form below to connect directly regarding development opportunities, joint ventures, or consulting.
              </p>

              {submitted ? (
                <div className="p-6 sm:p-8 rounded-sm bg-[#1a231c] border border-emerald-500/30 text-emerald-300 flex flex-col items-center text-center gap-3">
                  <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400" />
                  <h4 className="text-base sm:text-lg font-serif-title font-semibold">
                    Thank You for Reaching Out
                  </h4>
                  <p className="text-xs text-emerald-200/80 max-w-md">
                    Your message has been initiated. If your mail client did not automatically open, feel free to write directly to <span className="font-semibold text-white">{contact.email}</span>.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-3 text-xs underline text-emerald-400 hover:text-white"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#a2a8b8] block">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Anand Sharma"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0d0f12] border border-[#272d3c] rounded-xs text-xs sm:text-sm text-[#f3f2ee] focus:outline-none focus:border-[#c5a880] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#a2a8b8] block">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. anand@company.com"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0d0f12] border border-[#272d3c] rounded-xs text-xs sm:text-sm text-[#f3f2ee] focus:outline-none focus:border-[#c5a880] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#a2a8b8] block">
                      Subject / Topic
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Real Estate Development / Strategic Partnership"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0d0f12] border border-[#272d3c] rounded-xs text-xs sm:text-sm text-[#f3f2ee] focus:outline-none focus:border-[#c5a880] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#a2a8b8] block">
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share brief details about your inquiry or proposal..."
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0d0f12] border border-[#272d3c] rounded-xs text-xs sm:text-sm text-[#f3f2ee] focus:outline-none focus:border-[#c5a880] transition-colors resize-none"
                    />
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full" showIcon>
                    Get In Touch
                  </Button>

                </form>
              )}
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
