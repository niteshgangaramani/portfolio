import React from 'react';
import { useAdmin } from '../admin/AdminContext';
import { EditableSection } from '../admin/Editable';
import { SectionId } from '../types';
import { Navbar } from './Navbar';
import { ScrollProgressBar } from './ScrollProgressBar';
import { Hero } from './Hero';
import { StatStrip } from './StatStrip';
import { AboutSection } from './AboutSection';
import { JourneyTimeline } from './JourneyTimeline';
import { VenturesSection } from './VenturesSection';
import { ProjectGrid } from './ProjectGrid';
import { PhilosophyGrid } from './PhilosophyGrid';
import { AchievementsSection } from './AchievementsSection';
import { MediaSection } from './MediaSection';
import { SocialSection } from './SocialSection';
import { Gallery } from './Gallery';
import { ContactSection } from './ContactSection';
import { Footer } from './Footer';
import { EditModeGuard } from '../admin/EditModeGuard';
import { MobileNavigationDock } from './MobileNavigationDock';

export const SitePage: React.FC = () => {
  const { siteData, settings } = useAdmin();

  const isHidden = (id: SectionId) => settings.hiddenSections.includes(id);

  const renderSection = (id: SectionId) => {
    if (isHidden(id)) return null;

    switch (id) {
      case 'hero':
        return (
          <EditableSection key={id} id={id}>
            <Hero {...siteData.hero} personalName={siteData.personal.name} personalTitle={siteData.personal.title} />
          </EditableSection>
        );
      case 'stats':
        return (
          <EditableSection key={id} id={id}>
            <StatStrip stats={siteData.stats} />
          </EditableSection>
        );
      case 'about':
        return (
          <EditableSection key={id} id={id}>
            <AboutSection about={siteData.about} />
          </EditableSection>
        );
      case 'journey':
        return (
          <EditableSection key={id} id={id}>
            <JourneyTimeline items={siteData.journey} heading={settings.headings.journey} />
          </EditableSection>
        );
      case 'ventures':
        return (
          <EditableSection key={id} id={id}>
            <VenturesSection ventures={siteData.ventures} heading={settings.headings.ventures} />
          </EditableSection>
        );
      case 'portfolio':
        return (
          <EditableSection key={id} id={id}>
            <ProjectGrid projects={siteData.projects} heading={settings.headings.portfolio} />
          </EditableSection>
        );
      case 'philosophy':
        return (
          <EditableSection key={id} id={id}>
            <PhilosophyGrid philosophy={siteData.philosophy} heading={settings.headings.philosophy} />
          </EditableSection>
        );
      case 'achievements':
        return (
          <EditableSection key={id} id={id}>
            <AchievementsSection awards={siteData.awards} heading={settings.headings.achievements} />
          </EditableSection>
        );
      case 'media':
        return (
          <EditableSection key={id} id={id}>
            <MediaSection articles={siteData.media} heading={settings.headings.media} />
          </EditableSection>
        );
      case 'insights':
        return (
          <EditableSection key={id} id={id}>
            <SocialSection posts={siteData.socialPosts} videos={siteData.videos} heading={settings.headings.insights} />
          </EditableSection>
        );
      case 'gallery':
        return (
          <EditableSection key={id} id={id}>
            <Gallery
              gallery={siteData.gallery}
              csr={siteData.csr ?? []}
              heading={settings.headings.gallery}
              csrHeading={settings.headings.csr}
            />
          </EditableSection>
        );
      case 'contact':
        return (
          <EditableSection key={id} id={id}>
            <ContactSection contact={siteData.contact} />
          </EditableSection>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        ['--site-accent' as string]: settings.accentColor,
        ['--site-bg' as string]: settings.backgroundColor,
        ['--site-surface' as string]: settings.surfaceColor,
        ['--site-text' as string]: settings.textColor,
      }}
      className="min-h-screen bg-[var(--site-bg,#0d0f12)] text-[var(--site-text,#e8e6e1)] font-sans selection:bg-[var(--site-accent,#c5a880)] selection:text-[#0d0f12] pb-12 md:pb-0"
    >
      <EditModeGuard />
      <ScrollProgressBar />
      <Navbar
        navItems={siteData.navigation}
        personalName={siteData.personal.name}
        personalShortTitle={siteData.personal.shortTitle}
      />
      {settings.sectionOrder.map(renderSection)}
      <Footer
        navItems={siteData.navigation}
        personalName={siteData.personal.name}
        personalTitle={siteData.personal.title}
        personalLocation={siteData.personal.location}
      />
      <MobileNavigationDock />
    </div>
  );
};
