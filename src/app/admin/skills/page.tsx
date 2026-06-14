"use client";

import { useState, useEffect } from "react";
import { fetchSectionData, updateSectionData } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function AdminSkillsPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetchSectionData("skills");
      if (res && res.data) {
        setData(res.data);
      } else {
        setData([
          {
            category: "Cloud",
            items: ["AWS"],
          }
        ]);
      }
      setIsLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSectionData("skills", data);
      alert("Skills updated successfully!");
    } catch (err) {
      alert("Failed to update.");
      console.error(err);
    }
    setIsSaving(false);
  };

  const addCategory = () => {
    setData([
      ...data,
      {
        category: "New Category",
        items: [],
      }
    ]);
  };

  const updateCategory = (index: number, field: string, value: any) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  const deleteCategory = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif tracking-tight text-text">Skills</h1>
          <p className="text-text-muted mt-2">Manage your skill categories.</p>
        </div>
        <Button onClick={addCategory} variant="outline">Add Category</Button>
      </div>

      <div className="space-y-6">
        {data.map((cat, index) => (
          <div key={index} className="glass border border-border/50 rounded-xl p-6 space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium">Edit Category</h3>
              <button onClick={() => deleteCategory(index)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-text-muted">Category Name</label>
              <input
                type="text"
                className="w-full bg-background border border-border rounded-md px-4 py-2 text-text"
                value={cat.category}
                onChange={(e) => updateCategory(index, "category", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-text-muted">Skills (Comma Separated)</label>
              <textarea
                className="w-full bg-background border border-border rounded-md px-4 py-2 text-text min-h-[100px]"
                value={cat.items.join(", ")}
                onChange={(e) => updateCategory(index, "items", e.target.value.split(",").map((s: string) => s.trim()))}
              />
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
