import { Metadata } from "next";
import Link from "next/link";
import { Settings, LayoutDashboard, Briefcase, FileText, Send, User, Award, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard | Josbin Joseph",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-surface/50 p-6 pb-24 flex flex-col gap-8 overflow-y-auto">
        <div>
          <h2 className="text-xl font-bold font-serif tracking-tight mb-1">
            Josbin<span className="text-accent">.</span>
          </h2>
          <p className="text-sm text-text-muted">Admin Dashboard</p>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-muted hover:text-text hover:bg-white/5 transition-colors">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link href="/admin/hero" className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-muted hover:text-text hover:bg-white/5 transition-colors">
            <User size={18} />
            Hero Section
          </Link>
          <Link href="/admin/about" className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-muted hover:text-text hover:bg-white/5 transition-colors">
            <FileText size={18} />
            About & Timeline
          </Link>
          <Link href="/admin/experience" className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-muted hover:text-text hover:bg-white/5 transition-colors">
            <Briefcase size={18} />
            Experience
          </Link>
          <Link href="/admin/certifications" className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-muted hover:text-text hover:bg-white/5 transition-colors">
            <Award size={18} />
            Certifications
          </Link>
          <Link href="/admin/testimonials" className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-muted hover:text-text hover:bg-white/5 transition-colors">
            <MessageSquare size={18} />
            Testimonials
          </Link>
          <Link href="/admin/messages" className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-muted hover:text-text hover:bg-white/5 transition-colors">
            <Send size={18} />
            Messages
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-muted hover:text-text hover:bg-white/5 transition-colors">
            <Settings size={18} />
            Site Settings
          </Link>
        </nav>

        <div className="pt-6 border-t border-border flex flex-col gap-4">
          <Link href="/" className="text-sm text-accent hover:underline">
            ← Back to Site
          </Link>
          <a href="/api/auth/logout" className="text-sm text-red-400 hover:underline">
            Log Out
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
