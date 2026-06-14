"use client";

import { useState, useEffect } from "react";
import { fetchSectionData, updateSectionData } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function AdminContactPage() {
  const [data, setData] = useState({
    email: "josbinjoseph05@gmail.com",
    phone: "+91 8151961210",
    location: "Kochi, Kerala, India",
    github: "https://github.com/josbin",
    linkedin: "https://linkedin.com/in/josbin",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetchSectionData("contactInfo");
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
      await updateSectionData("contactInfo", data);
      alert("Contact info updated successfully!");
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
        <h1 className="text-3xl font-serif tracking-tight text-text">Contact Details</h1>
        <p className="text-text-muted mt-2">Edit the contact information displayed in the footer and contact section.</p>
      </div>

      <div className="glass border border-border/50 rounded-xl p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">Email Address</label>
          <input
            type="email"
            className="w-full bg-background border border-border rounded-md px-4 py-2 text-text focus:outline-none focus:border-accent"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">Phone Number</label>
          <input
            type="text"
            className="w-full bg-background border border-border rounded-md px-4 py-2 text-text focus:outline-none focus:border-accent"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">Location</label>
          <input
            type="text"
            className="w-full bg-background border border-border rounded-md px-4 py-2 text-text focus:outline-none focus:border-accent"
            value={data.location}
            onChange={(e) => setData({ ...data, location: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">LinkedIn URL</label>
          <input
            type="url"
            className="w-full bg-background border border-border rounded-md px-4 py-2 text-text focus:outline-none focus:border-accent"
            value={data.linkedin}
            onChange={(e) => setData({ ...data, linkedin: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">GitHub URL</label>
          <input
            type="url"
            className="w-full bg-background border border-border rounded-md px-4 py-2 text-text focus:outline-none focus:border-accent"
            value={data.github}
            onChange={(e) => setData({ ...data, github: e.target.value })}
          />
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
