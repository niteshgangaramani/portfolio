import React, { useState, useEffect } from 'react';
import { User, Briefcase, Award, Building2, Compass, Mail, Layers } from 'lucide-react';
import { scrollToElement } from '../utils/scroll';

import { useAdminOptional } from '../admin/AdminContext';

export const MobileNavigationDock: React.FC = () => {
  const admin = useAdminOptional();
  if (admin?.editMode) return null;
  const [activeSection, setActiveSection] = useState<string>('hero');

  const dockItems = [
    { id: 'about', label: 'Bio', icon: User },
    { id: 'journey', label: 'Journey', icon: Briefcase },
    { id: 'ventures', label: 'Ventures', icon: Building2 },
    { id: 'portfolio', label: 'Work', icon: Layers },
    { id: 'philosophy', label: '8 Es', icon: Compass },
    { id: 'achievements', label: 'Honors', icon: Award },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const handleScrollTo = (id: string) => {
    scrollToElement(id);
    setActiveSection(id);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const item of dockItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 md:hidden w-[92%] max-w-sm">
      <div className="bg-[#121620]/95 backdrop-blur-md border border-[#c5a880]/30 rounded-full px-2 py-1.5 flex items-center justify-between shadow-2xl shadow-black/80">
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleScrollTo(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-full transition-all ${
                isActive
                  ? 'bg-[#c5a880] text-[#0d0f12] font-bold scale-105 shadow-md shadow-[#c5a880]/20'
                  : 'text-[#8c92a0] hover:text-[#f3f2ee]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-[9px] font-mono leading-none mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
