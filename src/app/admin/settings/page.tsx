"use client";

import { useState, useEffect } from "react";
import { fetchSectionData, updateSectionData } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const [data, setData] = useState<any>({
    siteTitle: "Josbin Joseph — Cloud Professional",
    siteDescription: "Portfolio of Josbin Joseph",
    contactEmail: "hello@josbin.com",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    navItems: [
      { label: "About", href: "/#about" },
      { label: "Skills", href: "/#skills" },
      { label: "Experience", href: "/#experience" },
      { label: "Contact", href: "/#contact" },
    ],
    footerLogoText: "J",
    footerDescription: "Senior Technical Support Engineer specializing in Cloud, Data, Kubernetes, and Data Virtualization. Building solutions that make a difference.",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetchSectionData("settings");
      if (res && res.data) {
        setData((prev: any) => ({
          ...prev,
          ...res.data
        }));
      }
      setIsLoading(false);
    }
    load();
  }, []);

  const addNavItem = () => {
    setData({
      ...data,
      navItems: [...(data.navItems || []), { label: "New Section", href: "/#new-section" }]
    });
  };

  const removeNavItem = (index: number) => {
    const newItems = [...(data.navItems || [])];
    newItems.splice(index, 1);
    setData({ ...data, navItems: newItems });
  };

  const updateNavItem = (index: number, field: string, value: string) => {
    const newItems = [...(data.navItems || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setData({ ...data, navItems: newItems });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSectionData("settings", data);
      alert("Settings updated successfully!");
    } catch (err) {
      alert("Failed to update.");
      console.error(err);
    }
    setIsSaving(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "standard" | "ats") => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const res = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      
      if (res.ok) {
        alert("Resume uploaded successfully! It may take a moment or a hard refresh to reflect in the browser cache.");
      } else {
        alert(result.error || "Failed to upload.");
      }
    } catch (err) {
      alert("An error occurred while uploading.");
      console.error(err);
    }
    
    setIsUploading(false);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-serif tracking-tight text-text">Site Settings</h1>
        <p className="text-text-muted mt-2">Manage global configuration for your portfolio.</p>
      </div>

      <div className="space-y-6">
        <div className="glass border border-border/50 rounded-xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">SEO & Meta</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-text-muted">Site Title</label>
                <input
                  type="text"
                  className="w-full bg-background border border-border rounded-md px-4 py-2 text-text"
                  value={data.siteTitle || ""}
                  onChange={(e) => setData({ ...data, siteTitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-text-muted">Site Description</label>
                <textarea
                  className="w-full bg-background border border-border rounded-md px-4 py-2 text-text min-h-[80px]"
                  value={data.siteDescription || ""}
                  onChange={(e) => setData({ ...data, siteDescription: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <h3 className="text-lg font-medium mb-4">Contact & Social</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-text-muted">Primary Email</label>
                <input
                  type="email"
                  className="w-full bg-background border border-border rounded-md px-4 py-2 text-text"
                  value={data.contactEmail || ""}
                  onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-text-muted">GitHub URL</label>
                <input
                  type="url"
                  className="w-full bg-background border border-border rounded-md px-4 py-2 text-text"
                  value={data.githubUrl || ""}
                  onChange={(e) => setData({ ...data, githubUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-text-muted">LinkedIn URL</label>
                <input
                  type="url"
                  className="w-full bg-background border border-border rounded-md px-4 py-2 text-text"
                  value={data.linkedinUrl || ""}
                  onChange={(e) => setData({ ...data, linkedinUrl: e.target.value })}
                />
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Header Navigation</h3>
              <Button type="button" onClick={addNavItem} variant="outline">
                Add Link
              </Button>
            </div>
            <div className="space-y-4">
              {(data.navItems || []).map((item: any, index: number) => (
                <div key={index} className="flex gap-4 items-start p-4 border border-border/50 rounded-lg bg-surface/30">
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="text-xs text-text-muted mb-1 block">Label</label>
                      <input
                        type="text"
                        className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm text-text"
                        value={item.label}
                        onChange={(e) => updateNavItem(index, "label", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-text-muted mb-1 block">Link / ID</label>
                      <input
                        type="text"
                        className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm text-text"
                        value={item.href}
                        onChange={(e) => updateNavItem(index, "href", e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeNavItem(index)}
                    className="mt-6 text-red-500 border-red-500/50 hover:bg-red-500/10 hover:text-red-500"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-6 border-t border-border">
            <h3 className="text-lg font-medium mb-4">Footer Content</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-text-muted">Footer Logo Initials (e.g. J)</label>
                <input
                  type="text"
                  maxLength={3}
                  className="w-full bg-background border border-border rounded-md px-4 py-2 text-text"
                  value={data.footerLogoText || ""}
                  onChange={(e) => setData({ ...data, footerLogoText: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-text-muted">Footer Bio / Description</label>
                <textarea
                  className="w-full bg-background border border-border rounded-md px-4 py-2 text-text min-h-[80px]"
                  value={data.footerDescription || ""}
                  onChange={(e) => setData({ ...data, footerDescription: e.target.value })}
                />
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-border">
            <h3 className="text-lg font-medium mb-4">Resume Management</h3>
            <div className="space-y-6">
              <div className="space-y-2 p-4 border border-border/50 rounded-lg bg-surface/30">
                <label className="text-sm font-medium text-text block mb-1">Standard Resume (PDF)</label>
                <p className="text-xs text-text-subtle mb-3">This is the main resume that users will view and download.</p>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileUpload(e, "standard")}
                  className="block w-full text-sm text-text-muted
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-accent/10 file:text-accent
                    hover:file:bg-accent/20 cursor-pointer"
                  disabled={isUploading}
                />
              </div>

              <div className="space-y-2 p-4 border border-border/50 rounded-lg bg-surface/30">
                <label className="text-sm font-medium text-text block mb-1">ATS Version (PDF)</label>
                <p className="text-xs text-text-subtle mb-3">A plain-text version optimized for Applicant Tracking Systems.</p>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileUpload(e, "ats")}
                  className="block w-full text-sm text-text-muted
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-accent/10 file:text-accent
                    hover:file:bg-accent/20 cursor-pointer"
                  disabled={isUploading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
