import React from 'react';
import { ArrowUpRight, Building2, ShieldCheck, Briefcase } from 'lucide-react';
import { Button } from './Button';
import { ImagePlaceholder } from './ImagePlaceholder';
import { motion } from 'motion/react';
import { EditableText } from '../admin/Editable';

interface HeroProps {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: { text: string; href: string };
  secondaryCta: { text: string; href: string };
  tertiaryCta: { text: string; href: string };
  image?: string;
  personalName?: string;
  personalTitle?: string;
}

function renderHeadline(headline: string) {
  const lines = headline.split(/\.\s+/).filter(Boolean);
  if (lines.length <= 1) return headline;
  return lines.map((line, i) => (
    <React.Fragment key={i}>
      {i === 1 ? <span className="text-[#c5a880] italic">{line}{i < lines.length - 1 ? '.' : ''}</span> : `${line}${i < lines.length - 1 ? '.' : ''}`}
      {i < lines.length - 1 && <br />}
    </React.Fragment>
  ));
}

export const Hero: React.FC<HeroProps> = ({
  eyebrow,
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  tertiaryCta,
  image,
  personalName = 'Nitesh M. Gangaramani',
  personalTitle = 'Managing Director · Nyshaa Realty',
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section id="hero" className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden bg-[#0d0f12] bg-grain border-b border-[#1e232e]">
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.09, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#c5a880]/10 blur-[140px] pointer-events-none rounded-full"
      />
      <div className="absolute -top-10 left-10 w-72 h-72 bg-[#1f2636]/30 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
        >
          <div className="lg:col-span-7 flex flex-col items-start">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181c24] border border-[#c5a880]/30 text-[#c5a880] text-xs font-mono tracking-wider uppercase mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#c5a880] animate-pulse" />
              <EditableText path="hero.eyebrow">{eyebrow}</EditableText>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-serif-title font-normal text-[#f3f2ee] tracking-tight leading-[1.1] mb-6">
              <EditableText path="hero.headline" inlineEdit={false}>
                {renderHeadline(headline)}
              </EditableText>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-base sm:text-lg text-[#a2a8b8] font-sans-body font-light leading-relaxed max-w-2xl mb-8">
              <EditableText path="hero.subheadline" as="span">{subheadline}</EditableText>
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
              <Button href={primaryCta.href} editPath="hero.primaryCta.href" variant="primary" size="lg" showIcon>
                <EditableText path="hero.primaryCta.text">{primaryCta.text}</EditableText>
              </Button>
              <Button href={secondaryCta.href} editPath="hero.secondaryCta.href" variant="secondary" size="lg" showIcon>
                <EditableText path="hero.secondaryCta.text">{secondaryCta.text}</EditableText>
              </Button>
              <Button href={tertiaryCta.href} editPath="hero.tertiaryCta.href" variant="ghost" size="lg">
                <EditableText path="hero.tertiaryCta.text">{tertiaryCta.text}</EditableText>
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-8 border-t border-[#202532] w-full grid grid-cols-3 gap-4 text-left">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-[#c5a880] text-xs font-mono uppercase mb-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Real Estate</span>
                </div>
                <span className="text-xs text-[#8c92a0]">Development Leader</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-[#c5a880] text-xs font-mono uppercase mb-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Infrastructure</span>
                </div>
                <span className="text-xs text-[#8c92a0]">Turnkey Megaprojects</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-[#c5a880] text-xs font-mono uppercase mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Redevelopment</span>
                </div>
                <span className="text-xs text-[#8c92a0]">Prime Mumbai Focus</span>
              </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="absolute -inset-2 rounded-sm bg-gradient-to-tr from-[#c5a880]/40 via-transparent to-[#282f3d]/60 blur-xs" />
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className="relative bg-[#14171f] p-2 sm:p-2.5 rounded-sm border border-[#2a303f] shadow-2xl overflow-hidden group"
              >
                <ImagePlaceholder
                  src={image}
                  alt={`${personalName} - Executive Portrait`}
                  title={personalName}
                  category={personalTitle}
                  iconType="user"
                  aspectRatio="aspect-[3/4]"
                  fit="cover"
                  objectPosition="center top"
                  className="rounded-xs"
                  showImageOverlay={false}
                  editPaths={{ src: 'hero.image' }}
                />

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="absolute bottom-5 left-5 right-5 p-4 bg-[#0d0f12]/90 backdrop-blur-md border border-[#c5a880]/40 rounded-sm shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-serif-title font-semibold text-[#f3f2ee]">
                        <EditableText path="personal.name">{personalName}</EditableText>
                      </p>
                      <p className="text-[11px] text-[#c5a880] font-sans-body">
                        <EditableText path="personal.title">{personalTitle}</EditableText>
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-[#8a91a0] px-2 py-1 bg-[#1a1e27] border border-[#2d3444] rounded-xs font-semibold">
                      20+ YRS
                    </span>
                  </div>
                </motion.div>
              </motion.div>
              <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-[#c5a880]/80 pointer-events-none" />
              <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-[#c5a880]/80 pointer-events-none" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
