"use client";

import { useState, useEffect } from "react";
import { fetchSectionData, updateSectionData } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function AdminHeroPage() {
  const [data, setData] = useState({
    greeting: "Hi, I'm",
    name: "Josbin Joseph",
    roles: ["Cloud & Infrastructure Specialist"],
    description: "CLOUD • CONTAINER ORCHESTRATION • DEVOPS • SRE",
    resumeUrl: "/resume.pdf",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetchSectionData("hero");
      if (res && res.data) {
        setData(res.data);
      }
      setIsLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSectionData("hero", data);
      alert("Hero section updated successfully!");
    } catch (err) {
      alert("Failed to update.");
      console.error(err);
    }
    setIsSaving(false);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif tracking-tight text-text">Hero Section</h1>
        <p className="text-text-muted mt-2">Edit the content displayed on the main landing section.</p>
      </div>

      <div className="glass border border-border/50 rounded-xl p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">Greeting</label>
          <input
            type="text"
            className="w-full bg-background border border-border rounded-md px-4 py-2 text-text focus:outline-none focus:border-accent"
            value={data.greeting}
            onChange={(e) => setData({ ...data, greeting: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">Name</label>
          <input
            type="text"
            className="w-full bg-background border border-border rounded-md px-4 py-2 text-text focus:outline-none focus:border-accent"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">Roles (Comma Separated)</label>
          <input
            type="text"
            className="w-full bg-background border border-border rounded-md px-4 py-2 text-text focus:outline-none focus:border-accent"
            value={data.roles.join(", ")}
            onChange={(e) => setData({ ...data, roles: e.target.value.split(",").map(r => r.trim()) })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">Description Tagline</label>
          <input
            type="text"
            className="w-full bg-background border border-border rounded-md px-4 py-2 text-text focus:outline-none focus:border-accent"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">Resume URL / Path</label>
          <input
            type="text"
            className="w-full bg-background border border-border rounded-md px-4 py-2 text-text focus:outline-none focus:border-accent"
            value={data.resumeUrl}
            onChange={(e) => setData({ ...data, resumeUrl: e.target.value })}
            placeholder="/resume.pdf or https://..."
          />
          <p className="text-xs text-text-subtle mt-1">Upload your file to the public folder or provide an external URL like Google Drive.</p>
        </div>

        <div className="pt-4 flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
