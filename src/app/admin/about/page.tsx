"use client";

import { useState, useEffect } from "react";
import { fetchSectionData, updateSectionData } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function AdminAboutPage() {
  const [data, setData] = useState({
    title: "Building the future of",
    titleHighlight: "enterprise support",
    story: "I am a Dynamic Cloud Professional...",
    stats: [
      { value: 4, suffix: "+", label: "Years of Experience" },
      { value: 3, suffix: "+", label: "Cloud Platforms" },
      { value: 5, suffix: "+", label: "Certifications" },
      { value: 100, suffix: "%", label: "Commitment" },
    ],
    highlights: ["Expertise in container orchestration and cloud automation"],
    timeline: [
      {
        year: "2024",
        title: "Technical Support Professional - IBM",
        description: "Advanced technical support for Data Virtualization on CP4D and BigSQL.",
      },
      {
        year: "2022",
        title: "Research Associate - Cloud That Technologies",
        description: "Engineered automated CI/CD pipelines and multi-cloud resource discovery engines.",
      },
      {
        year: "2022",
        title: "Master of Computer Applications",
        description: "Graduated with MCA from Kristu Jayanti College.",
      },
      {
        year: "2019",
        title: "Bachelor of Computer Applications",
        description: "Graduated with BCA from Kristu Jayanti College.",
      },
    ],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetchSectionData("about");
      if (res && res.data) {
        setData(prev => ({ ...prev, ...res.data }));
      }
      setIsLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSectionData("about", data);
      alert("About section updated successfully!");
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
        <h1 className="text-3xl font-serif tracking-tight text-text">About Section</h1>
        <p className="text-text-muted mt-2">Edit your story, stats, and key highlights.</p>
      </div>

      <div className="glass border border-border/50 rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Title Prefix</label>
            <input
              type="text"
              className="w-full bg-background border border-border rounded-md px-4 py-2 text-text focus:outline-none focus:border-accent"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Title Highlight (Gradient)</label>
            <input
              type="text"
              className="w-full bg-background border border-border rounded-md px-4 py-2 text-text focus:outline-none focus:border-accent"
              value={data.titleHighlight}
              onChange={(e) => setData({ ...data, titleHighlight: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">Your Story (Paragraphs, separated by double newlines)</label>
          <textarea
            className="w-full bg-background border border-border rounded-md px-4 py-2 text-text focus:outline-none focus:border-accent min-h-[200px]"
            value={data.story}
            onChange={(e) => setData({ ...data, story: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">Key Highlights (One per line)</label>
          <textarea
            className="w-full bg-background border border-border rounded-md px-4 py-2 text-text focus:outline-none focus:border-accent min-h-[120px]"
            value={(data.highlights || []).join("\n")}
            onChange={(e) => setData({ ...data, highlights: e.target.value.split("\n").filter(h => h.trim() !== "") })}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-text-muted">Statistics</label>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setData({ ...data, stats: [...(data.stats || []), { value: 0, suffix: "", label: "" }] })}
            >
              Add Stat
            </Button>
          </div>
          {(data.stats || []).map((stat: any, i: number) => (
            <div key={i} className="flex gap-4 items-center">
              <input
                type="number"
                placeholder="Value"
                className="w-24 bg-background border border-border rounded-md px-4 py-2 text-text"
                value={stat.value}
                onChange={(e) => {
                  const newStats = [...data.stats];
                  newStats[i].value = Number(e.target.value);
                  setData({ ...data, stats: newStats });
                }}
              />
              <input
                type="text"
                placeholder="Suffix (e.g., + or %)"
                className="w-24 bg-background border border-border rounded-md px-4 py-2 text-text"
                value={stat.suffix}
                onChange={(e) => {
                  const newStats = [...data.stats];
                  newStats[i].suffix = e.target.value;
                  setData({ ...data, stats: newStats });
                }}
              />
              <input
                type="text"
                placeholder="Label"
                className="flex-1 bg-background border border-border rounded-md px-4 py-2 text-text"
                value={stat.label}
                onChange={(e) => {
                  const newStats = [...data.stats];
                  newStats[i].label = e.target.value;
                  setData({ ...data, stats: newStats });
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const newStats = data.stats.filter((_: any, index: number) => index !== i);
                  setData({ ...data, stats: newStats });
                }}
                className="text-red-400 hover:text-red-300 text-sm px-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-4 pt-8 border-t border-border">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-text-muted">My Journey (Timeline)</label>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setData({ ...data, timeline: [...(data.timeline || []), { year: "", title: "", description: "" }] })}
            >
              Add Timeline Event
            </Button>
          </div>
          {(data.timeline || []).map((event: any, i: number) => (
            <div key={i} className="flex flex-col gap-2 p-4 bg-surface/50 border border-border rounded-lg relative">
              <button
                type="button"
                onClick={() => {
                  const newTimeline = data.timeline.filter((_: any, index: number) => index !== i);
                  setData({ ...data, timeline: newTimeline });
                }}
                className="absolute top-4 right-4 text-red-400 hover:text-red-300 text-sm"
              >
                Remove
              </button>
              
              <div className="flex gap-4 items-start pr-16">
                <div className="w-24">
                  <label className="text-xs text-text-subtle mb-1 block">Year</label>
                  <input
                    type="text"
                    placeholder="2024"
                    className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm text-text"
                    value={event.year}
                    onChange={(e) => {
                      const newTimeline = [...data.timeline];
                      newTimeline[i].year = e.target.value;
                      setData({ ...data, timeline: newTimeline });
                    }}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-text-subtle mb-1 block">Title / Role</label>
                  <input
                    type="text"
                    placeholder="Title"
                    className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm text-text"
                    value={event.title}
                    onChange={(e) => {
                      const newTimeline = [...data.timeline];
                      newTimeline[i].title = e.target.value;
                      setData({ ...data, timeline: newTimeline });
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-text-subtle mb-1 block">Description</label>
                <textarea
                  placeholder="Description"
                  className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm text-text min-h-[60px]"
                  value={event.description}
                  onChange={(e) => {
                    const newTimeline = [...data.timeline];
                    newTimeline[i].description = e.target.value;
                    setData({ ...data, timeline: newTimeline });
                  }}
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
    </div>
  );
}
