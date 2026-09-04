import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AdminProvider } from './admin/AdminContext';
import AdminPage, { VisualEditorShell } from './admin/AdminPage';

export default function App() {
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  return (
    <ThemeProvider>
      <AdminProvider>
        {isAdminRoute ? <AdminPage /> : <VisualEditorShell />}
      </AdminProvider>
    </ThemeProvider>
  );
}
