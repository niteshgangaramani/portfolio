import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { scrollToElement } from '../utils/scroll';
import { useAdminOptional } from '../admin/AdminContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  showIcon?: boolean;
  editPath?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  showIcon = false,
  editPath,
  children,
  className = '',
  ...props
}) => {
  const admin = useAdminOptional();
  const isEditMode = admin?.editMode ?? false;
  const baseClasses = "inline-flex items-center justify-center font-sans-body font-medium transition-all duration-300 rounded-sm select-none tracking-wide text-nowrap whitespace-nowrap";
  
  const sizeClasses = {
    sm: "text-xs px-4 py-2 gap-1.5",
    md: "text-sm px-6 py-3 gap-2",
    lg: "text-base px-8 py-4 gap-2.5"
  }[size];

  const variantClasses = {
    primary: "bg-[#c5a880] text-[#0d0f12] hover:bg-[#d6ba92] active:bg-[#a28359] shadow-lg shadow-[#c5a880]/10 font-semibold",
    secondary: "bg-[#1f242e] text-[#f3f2ee] hover:bg-[#282e3b] hover:text-[#c5a880] border border-[#303747]",
    outline: "bg-transparent text-[#e8e6e1] border border-[#c5a880]/60 hover:border-[#c5a880] hover:bg-[#c5a880]/10 hover:text-[#c5a880]",
    ghost: "bg-transparent text-[#9fa4b0] hover:text-[#c5a880] hover:bg-[#1a1e26]"
  }[variant];

  const combinedClasses = `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {showIcon && <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
    </>
  );

  if (href) {
    const isExternal = href.startsWith('http');
    const isHash = href.startsWith('#');

    if (isEditMode) {
      const path = editPath ?? '';
      return (
        <span
          data-edit-path={path || undefined}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (path && admin) {
              admin.selectPath(path);
              admin.setPanelTab('edit');
            }
          }}
          className={`${combinedClasses} group cursor-pointer`}
          title={path ? `Edit: ${path}` : 'Edit mode — navigation disabled'}
        >
          {content}
        </span>
      );
    }

    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        onClick={(e) => {
          if (isHash) {
            e.preventDefault();
            scrollToElement(href.substring(1));
          }
        }}
        className={`${combinedClasses} group`}
      >
        {content}
      </a>
    );
  }

  return (
    <button className={`${combinedClasses} group`} {...props}>
      {content}
    </button>
  );
};
