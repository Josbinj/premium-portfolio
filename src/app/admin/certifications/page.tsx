"use client";

import { useState, useEffect } from "react";
import { fetchSectionData, updateSectionData } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function AdminCertificationsPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetchSectionData("certifications");
      if (res && res.data && Array.isArray(res.data)) {
        setData(res.data);
      } else if (res && res.data && Array.isArray(res.data.items)) {
        setData(res.data.items);
      } else {
        // Default if empty
        setData([
          { name: "AZ-400: DevOps Solutions", issuer: "Microsoft", date: "2023", color: "#0078D4", credentialUrl: "" },
          { name: "Terraform Associate (002)", issuer: "HashiCorp", date: "2023", color: "#7B42BC", credentialUrl: "" },
          { name: "Azure Data Fundamentals", issuer: "Microsoft", date: "2022", color: "#0078D4", credentialUrl: "" },
          { name: "Azure Fundamentals", issuer: "Microsoft", date: "2022", color: "#0078D4", credentialUrl: "" },
          { name: "AWS Knowledge: Architecting", issuer: "Amazon Web Services", date: "2022", color: "#FF9900", credentialUrl: "" },
        ]);
      }
      setIsLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSectionData("certifications", data);
      alert("Certifications updated successfully!");
    } catch (err) {
      alert("Failed to update.");
      console.error(err);
    }
    setIsSaving(false);
  };

  const addCert = () => {
    setData([
      ...data,
      {
        name: "New Certification",
        issuer: "Issuer",
        date: new Date().getFullYear().toString(),
        color: "#0078D4",
        credentialUrl: "",
      }
    ]);
  };

  const updateCert = (index: number, field: string, value: string) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  const deleteCert = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif tracking-tight text-text">Certifications</h1>
          <p className="text-text-muted mt-2">Manage your certifications and credentials.</p>
        </div>
        <Button onClick={addCert} variant="outline">Add Certification</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((cert, index) => (
          <div key={index} className="glass border border-border/50 rounded-xl p-6 relative flex flex-col gap-4">
            <button
              onClick={() => deleteCert(index)}
              className="absolute top-4 right-4 text-red-400 hover:text-red-300 text-sm"
            >
              Delete
            </button>
            
            <div className="space-y-2 mt-4">
              <label className="text-xs text-text-subtle">Certification Name</label>
              <input
                type="text"
                className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm text-text"
                value={cert.name || ""}
                onChange={(e) => updateCert(index, "name", e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-text-subtle">Issuer</label>
                <input
                  type="text"
                  className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm text-text"
                  value={cert.issuer || ""}
                  onChange={(e) => updateCert(index, "issuer", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-text-subtle">Date / Year</label>
                <input
                  type="text"
                  className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm text-text"
                  value={cert.date || ""}
                  onChange={(e) => updateCert(index, "date", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-text-subtle">Credential URL (Optional)</label>
              <input
                type="text"
                placeholder="https://"
                className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm text-text"
                value={cert.credentialUrl || ""}
                onChange={(e) => updateCert(index, "credentialUrl", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-text-subtle">Brand Color (Hex)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                  value={cert.color || "#0078D4"}
                  onChange={(e) => updateCert(index, "color", e.target.value)}
                />
                <input
                  type="text"
                  className="flex-1 bg-background border border-border rounded-md px-3 py-1.5 text-sm text-text uppercase"
                  value={cert.color || "#0078D4"}
                  onChange={(e) => updateCert(index, "color", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
