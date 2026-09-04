import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight, ChevronDown } from 'lucide-react';
import { NavItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { scrollToElement } from '../utils/scroll';
import { EditableText } from '../admin/Editable';
import { useAdminOptional } from '../admin/AdminContext';

interface NavbarProps {
  navItems: NavItem[];
  personalName: string;
  personalShortTitle: string;
}

const SHORT_LABELS: Record<string, string> = {
  '#portfolio': 'Work',
  '#media': 'Media',
  '#insights': 'Insights',
  '#achievements': 'Honors',
};

const PRIMARY_SECTIONS = new Set(['hero', 'about', 'journey', 'ventures', 'portfolio', 'philosophy']);

const getSectionId = (href: string) => href.substring(1);
const getNavLabel = (item: NavItem, compact = false) =>
  compact && SHORT_LABELS[item.href] ? SHORT_LABELS[item.href] : item.label;

export const Navbar: React.FC<NavbarProps> = ({
  navItems,
  personalName,
  personalShortTitle,
}) => {
  const admin = useAdminOptional();
  const isEditMode = admin?.editMode ?? false;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = navItems.filter((item) => getSectionId(item.href) !== 'contact');
  const primaryLinks = navLinks.filter((item) => PRIMARY_SECTIONS.has(getSectionId(item.href)));
  const secondaryLinks = navLinks.filter((item) => !PRIMARY_SECTIONS.has(getSectionId(item.href)));
  const isSecondaryActive = secondaryLinks.some(
    (item) => activeSection === getSectionId(item.href)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (sectionId: string, closeMenus = false) => {
    if (closeMenus) {
      setMobileMenuOpen(false);
      setMoreMenuOpen(false);
    }
    scrollToElement(sectionId);
  };

  const renderNavLink = (
    item: NavItem,
    compact = false,
    variant: 'inline' | 'dropdown' = 'inline'
  ) => {
    const sectionId = getSectionId(item.href);
    const navIdx = navItems.indexOf(item);
    const isActive = activeSection === sectionId;

    const inlineClasses = `relative px-2.5 xl:px-3 py-1.5 text-[11px] xl:text-xs font-sans-body tracking-wide transition-colors rounded-xs whitespace-nowrap ${
      isActive
        ? 'text-[#c5a880] font-semibold'
        : 'text-[#9fa4b0] hover:text-[#f3f2ee] hover:bg-[#161a22]'
    }`;

    const dropdownClasses = `block px-3.5 py-2.5 text-xs font-sans-body tracking-wide transition-colors rounded-sm whitespace-nowrap ${
      isActive
        ? 'bg-[#1a1e27] text-[#c5a880] font-semibold'
        : 'text-[#9fa4b0] hover:text-[#f3f2ee] hover:bg-[#161a22]'
    }`;

    if (isEditMode) {
      return (
        <span
          key={`${item.href}-${navIdx}`}
          data-edit-path={`navigation.${navIdx}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            admin?.selectPath(`navigation.${navIdx}`);
            admin?.setPanelTab('edit');
          }}
          className={`${variant === 'dropdown' ? dropdownClasses : inlineClasses} cursor-pointer`}
          title={`Edit nav: ${item.label}`}
        >
          <EditableText path={`navigation.${navIdx}.label`}>{getNavLabel(item, compact)}</EditableText>
        </span>
      );
    }

    return (
      <a
        key={item.href}
        href={item.href}
        onClick={(e) => {
          e.preventDefault();
          handleNavClick(sectionId, variant === 'dropdown');
        }}
        className={variant === 'dropdown' ? dropdownClasses : inlineClasses}
      >
        {getNavLabel(item, compact)}
        {variant === 'inline' && isActive && (
          <motion.div
            layoutId="activeNavIndicator"
            className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-[#c5a880] rounded-full"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </a>
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = navItems.map(item => item.href.substring(1));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0d0f12]/90 backdrop-blur-md border-b border-[#232834] py-3.5 shadow-xl shadow-black/40'
          : 'bg-gradient-to-b from-[#0d0f12]/90 via-[#0d0f12]/50 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
        {/* Brand Logo & Title */}
        <div
          onClick={(e) => {
            if (isEditMode) {
              e.preventDefault();
              admin?.selectPath('personal.name');
              admin?.setPanelTab('edit');
              return;
            }
            scrollToElement('hero');
          }}
          className="flex items-center gap-3 group shrink-0 min-w-0 cursor-pointer"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-sm bg-[#1a1e27] border border-[#c5a880]/40 flex items-center justify-center text-[#c5a880] font-serif-title font-bold text-xl group-hover:border-[#c5a880] transition-colors shadow-md shrink-0"
          >
            NG
          </motion.div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif-title font-semibold text-base sm:text-lg text-[#f3f2ee] tracking-tight group-hover:text-[#c5a880] transition-colors truncate">
              <EditableText path="personal.name">{personalName}</EditableText>
            </span>
            <span className="text-[10px] text-[#9fa4b0] font-mono tracking-wider uppercase hidden xl:inline-block truncate">
              <EditableText path="personal.shortTitle">{personalShortTitle}</EditableText>
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-1 items-center justify-center min-w-0">
          <div className="flex items-center gap-0.5 xl:gap-1">
            {primaryLinks.map((item) => renderNavLink(item, true))}

            {/* Compact "More" menu for laptop screens */}
            {secondaryLinks.length > 0 && (
              <div ref={moreMenuRef} className="relative 2xl:hidden">
                <button
                  type="button"
                  data-edit-allow
                  onClick={() => setMoreMenuOpen((open) => !open)}
                  aria-expanded={moreMenuOpen}
                  aria-haspopup="true"
                  className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] xl:text-xs font-sans-body tracking-wide transition-colors rounded-xs whitespace-nowrap ${
                    isSecondaryActive || moreMenuOpen
                      ? 'text-[#c5a880] font-semibold bg-[#161a22]'
                      : 'text-[#9fa4b0] hover:text-[#f3f2ee] hover:bg-[#161a22]'
                  }`}
                >
                  More
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      moreMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {moreMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[200px] rounded-sm border border-[#232834] bg-[#0e1116]/95 backdrop-blur-xl shadow-2xl shadow-black/50 p-1.5 z-50"
                    >
                      {secondaryLinks.map((item) => renderNavLink(item, true, 'dropdown'))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Full secondary links on very wide screens */}
            <div className="hidden 2xl:flex items-center gap-0.5">
              {secondaryLinks.map((item) => renderNavLink(item, true))}
            </div>
          </div>
        </nav>

        {/* Header actions & mobile toggle — theme switcher hidden for now */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-auto lg:ml-0">
          {isEditMode ? (
            <span
              data-edit-path="contact.sectionHeading"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                admin?.selectPath('contact.sectionHeading');
                admin?.setPanelTab('edit');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-sm bg-[#c5a880] text-[#0d0f12] cursor-pointer"
            >
              <span>Contact CTA</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          ) : (
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToElement('contact');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-sm bg-[#c5a880] text-[#0d0f12] hover:bg-[#d6ba92] transition-colors shadow-md shadow-[#c5a880]/10"
            >
              <span>Contact</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </motion.a>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            data-edit-allow
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-sm bg-[#161920] text-[#f3f2ee] border border-[#2a2f3d] hover:border-[#c5a880] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#c5a880]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden fixed inset-x-0 top-[60px] bg-[#0e1116] border-b border-[#262b38] shadow-2xl p-6 backdrop-blur-xl"
          >
            <div className="grid grid-cols-2 gap-2 max-h-[70vh] overflow-y-auto pr-1">
              {navItems.map((item, navIdx) => {
                const sectionId = item.href.substring(1);
                const isActive = activeSection === sectionId;
                if (isEditMode) {
                  return (
                    <span
                      key={`${item.href}-${navIdx}`}
                      data-edit-path={`navigation.${navIdx}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        admin?.selectPath(`navigation.${navIdx}`);
                        admin?.setPanelTab('edit');
                      }}
                      className={`p-3 text-xs rounded-sm border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#1a1e27] text-[#c5a880] border-[#c5a880]/50 font-semibold'
                          : 'bg-[#13161c] text-[#9fa4b0] border-[#202532] hover:text-[#f3f2ee]'
                      }`}
                    >
                      <EditableText path={`navigation.${navIdx}.label`}>{item.label}</EditableText>
                    </span>
                  );
                }
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileMenuOpen(false);
                      scrollToElement(sectionId);
                    }}
                    className={`p-3 text-xs rounded-sm border transition-all ${
                      isActive
                        ? 'bg-[#1a1e27] text-[#c5a880] border-[#c5a880]/50 font-semibold'
                        : 'bg-[#13161c] text-[#9fa4b0] border-[#202532] hover:text-[#f3f2ee]'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-[#232834] flex flex-col gap-2">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  scrollToElement('contact');
                }}
                className="w-full text-center py-3 text-xs font-semibold rounded-sm bg-[#c5a880] text-[#0d0f12]"
              >
                Get In Touch Directly
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

