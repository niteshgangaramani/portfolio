import React from 'react';
import { NavItem } from '../types';
import { ArrowUp } from 'lucide-react';
import { scrollToElement } from '../utils/scroll';
import { EditableText } from '../admin/Editable';
import { useAdminOptional } from '../admin/AdminContext';

interface FooterProps {
  navItems: NavItem[];
  personalName: string;
  personalTitle: string;
  personalLocation?: string;
}

export const Footer: React.FC<FooterProps> = ({
  navItems,
  personalName,
  personalTitle,
  personalLocation = '',
}) => {
  const admin = useAdminOptional();
  const isEditMode = admin?.editMode ?? false;

  const scrollToTop = () => {
    if (isEditMode) return;
    scrollToElement('hero');
  };

  return (
    <footer className="bg-[#090b0e] text-[#8c92a0] border-t border-[#1a1e28] py-12 sm:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#181c26]">
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-[#161922] border border-[#c5a880]/50 flex items-center justify-center text-[#c5a880] font-serif-title font-bold text-lg">
                NG
              </div>
              <span className="font-serif-title font-semibold text-xl text-[#f3f2ee]">
                <EditableText path="personal.name">{personalName}</EditableText>
              </span>
            </div>

            <p className="text-xs text-[#8c92a0] font-sans-body leading-relaxed max-w-md">
              <EditableText path="personal.title" as="span">{personalTitle}</EditableText>
            </p>

            <p className="text-xs text-[#6b7280] font-sans-body">
              <EditableText path="personal.location" as="span">{personalLocation}</EditableText>
            </p>
          </div>

          <div className="md:col-span-7 flex flex-col gap-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#c5a880] font-semibold">
              Quick Navigation
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {navItems.map((item, idx) =>
                isEditMode ? (
                  <span
                    key={`${item.href}-${idx}`}
                    data-edit-path={`navigation.${idx}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      admin?.selectPath(`navigation.${idx}`);
                      admin?.setPanelTab('edit');
                    }}
                    className="text-xs font-sans-body text-[#8c92a0] hover:text-[#c5a880] transition-colors py-1 cursor-pointer"
                  >
                    <EditableText path={`navigation.${idx}.label`}>{item.label}</EditableText>
                  </span>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToElement(item.href.substring(1));
                    }}
                    className="text-xs font-sans-body text-[#8c92a0] hover:text-[#c5a880] transition-colors py-1"
                  >
                    {item.label}
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans-body">
          <p>© 2026 <EditableText path="personal.name" as="span">{personalName}</EditableText>. All Rights Reserved.</p>

          <div className="flex items-center gap-6">
            {isEditMode ? (
              <span
                data-edit-path="hero"
                onClick={(e) => {
                  e.preventDefault();
                  admin?.setPanelTab('sections');
                }}
                className="inline-flex items-center gap-2 text-xs font-mono text-[#c5a880] cursor-pointer"
              >
                <span>Back to top (disabled in edit)</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 text-xs font-mono text-[#c5a880] hover:underline"
              >
                <span>Back to top</span>
                <div className="p-1.5 rounded-full bg-[#161a22] border border-[#2c3344]">
                  <ArrowUp className="w-3.5 h-3.5" />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
