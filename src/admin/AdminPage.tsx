import React, { useState } from 'react';
import { Lock, User, MousePointerClick } from 'lucide-react';
import { useAdmin } from './AdminContext';
import { SitePage } from '../components/SitePage';
import { AdminToolbar, AdminEditFab } from './AdminToolbar';

export default function AdminPage() {
  const admin = useAdmin();
  const [adminUserId, setAdminUserId] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin');
  const [loginError, setLoginError] = useState(false);

  if (!admin.isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0d0f12] text-[#f3f2ee] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#14171f] border border-[#232835] rounded-sm p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-[#c5a880]" />
            <h1 className="font-serif-title text-xl font-semibold">Admin Login</h1>
          </div>

          <div className="space-y-3">
            <label className="block space-y-1">
              <div className="text-[11px] font-mono text-[#c5a880]">User ID</div>
              <div className="flex items-center gap-2 bg-[#101218] border border-[#232835] rounded-sm px-3 py-2">
                <User className="w-4 h-4 text-[#9fa4b0]" />
                <input value={adminUserId} onChange={(e) => setAdminUserId(e.target.value)} className="w-full bg-transparent outline-none text-xs" />
              </div>
            </label>

            <label className="block space-y-1">
              <div className="text-[11px] font-mono text-[#c5a880]">Password</div>
              <div className="flex items-center gap-2 bg-[#101218] border border-[#232835] rounded-sm px-3 py-2">
                <Lock className="w-4 h-4 text-[#9fa4b0]" />
                <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full bg-transparent outline-none text-xs" />
              </div>
            </label>

            {loginError && <div className="text-xs text-red-400">Invalid credentials</div>}

            <button
              onClick={() => {
                const ok = admin.login(adminUserId, adminPassword);
                setLoginError(!ok);
              }}
              className="w-full px-4 py-2.5 rounded-sm bg-[#c5a880] text-[#0d0f12] font-semibold text-xs hover:bg-[#d6ba92] transition-colors"
            >
              Login & Open Visual Editor
            </button>
            <div className="text-[10px] text-[#9fa4b0] font-mono">
              Credentials: <span className="text-[#c5a880]">admin / admin</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminToolbar />
      <SitePage />
      <AdminEditFab />
    </>
  );
}

export function VisualEditorShell() {
  const admin = useAdmin();
  return (
    <>
      {admin.editMode && <AdminToolbar />}
      <SitePage />
      <AdminEditFab />
    </>
  );
}

export function AdminLoginHint() {
  return (
    <div className="fixed bottom-20 left-4 z-[9980] max-w-xs p-3 rounded-sm bg-[#14171f]/95 border border-[#c5a880]/30 text-[10px] text-[#9fa4b0] font-mono hidden lg:block">
      <MousePointerClick className="w-4 h-4 text-[#c5a880] mb-1" />
      Click any element to edit · Double-click text for inline edit · Use Design tab for colors
    </div>
  );
}
