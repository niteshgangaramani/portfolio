import { useEffect } from 'react';
import { useAdminOptional } from './AdminContext';

/** Blocks navigation, form submit, and non-edit interactions while visual editor is active. */
export function EditModeGuard() {
  const admin = useAdminOptional();

  useEffect(() => {
    if (!admin?.editMode) return;

    const isAllowed = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      if (!el) return false;
      if (el.closest('[data-admin-ui]')) return true;
      if (el.closest('[data-edit-path]')) return true;
      if (el.closest('[data-edit-allow]')) return true;
      if (el.closest('input, textarea, select, label')) return true;
      return false;
    };

    const onClickCapture = (e: MouseEvent) => {
      if (isAllowed(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
    };

    const onSubmitCapture = (e: Event) => {
      if (isAllowed(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      const el = e.target as HTMLElement;
      if (el.tagName === 'A' && !isAllowed(el)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('click', onClickCapture, true);
    document.addEventListener('submit', onSubmitCapture, true);
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      document.removeEventListener('click', onClickCapture, true);
      document.removeEventListener('submit', onSubmitCapture, true);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [admin?.editMode]);

  return null;
}

export function useIsEditMode(): boolean {
  return useAdminOptional()?.editMode ?? false;
}
