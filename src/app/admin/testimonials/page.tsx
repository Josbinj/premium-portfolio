"use client";

import { useState, useEffect } from "react";
import { fetchSectionData, updateSectionData } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function AdminTestimonialsPage() {
  const [data, setData] = useState<any>({ showTestimonials: true, items: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetchSectionData("testimonials");
      if (res && res.data && res.data.items) {
        setData(res.data);
      } else {
        // Default if empty
        setData({
          showTestimonials: true,
          items: [
            {
              quote: "Josbin's ability to diagnose complex production issues under pressure is exceptional. He turned a critical P1 incident into a comprehensive solution that improved our entire architecture.",
              name: "Engineering Manager",
              title: "Fortune 500 Client",
              type: "Manager",
            },
            {
              quote: "The depth of knowledge Josbin brings to every interaction is remarkable. His case studies and documentation have become reference material for our entire support organization.",
              name: "Senior Director",
              title: "Enterprise Technology",
              type: "Peer",
            },
            {
              quote: "Working with Josbin on our Kubernetes migration was a game-changer. His technical expertise combined with clear communication made the entire process smooth and successful.",
              name: "Solutions Architect",
              title: "Cloud Partner",
              type: "Customer",
            },
            {
              quote: "Josbin doesn't just fix problems — he prevents them. His proactive approach to performance optimization saved us countless hours of downtime.",
              name: "VP of Engineering",
              title: "Technology Company",
              type: "Customer",
            },
          ]
        });
      }
      setIsLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSectionData("testimonials", data);
      alert("Testimonials updated successfully!");
    } catch (err) {
      alert("Failed to update.");
      console.error(err);
    }
    setIsSaving(false);
  };

  const addTestimonial = () => {
    setData({
      ...data,
      items: [
        ...data.items,
        {
          quote: "New testimonial quote...",
          name: "Name",
          title: "Job Title / Company",
          type: "Client",
        }
      ]
    });
  };

  const updateTestimonial = (index: number, field: string, value: string) => {
    const newItems = [...data.items];
    newItems[index][field] = value;
    setData({ ...data, items: newItems });
  };

  const deleteTestimonial = (index: number) => {
    setData({ ...data, items: data.items.filter((_: any, i: number) => i !== index) });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif tracking-tight text-text">Testimonials</h1>
          <p className="text-text-muted mt-2">Manage the testimonials shown on your portfolio.</p>
        </div>
        <Button onClick={addTestimonial} variant="outline">Add Testimonial</Button>
      </div>

      <div className="glass border border-border/50 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="showTestimonials"
            checked={data.showTestimonials}
            onChange={(e) => setData({ ...data, showTestimonials: e.target.checked })}
            className="w-4 h-4 rounded border-border"
          />
          <label htmlFor="showTestimonials" className="text-text font-medium cursor-pointer">
            Enable Testimonials Section
          </label>
        </div>
        <p className="text-sm text-text-muted mt-2 ml-7">
          If disabled, the entire testimonials section will be hidden from your public portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.items.map((item: any, index: number) => (
          <div key={index} className="glass border border-border/50 rounded-xl p-6 relative flex flex-col gap-4">
            <button
              onClick={() => deleteTestimonial(index)}
              className="absolute top-4 right-4 text-red-400 hover:text-red-300 text-sm"
            >
              Delete
            </button>
            
            <div className="space-y-2 mt-2">
              <label className="text-xs text-text-subtle">Quote</label>
              <textarea
                className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm text-text min-h-[100px]"
                value={item.quote}
                onChange={(e) => updateTestimonial(index, "quote", e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-text-subtle">Name</label>
                <input
                  type="text"
                  className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm text-text"
                  value={item.name}
                  onChange={(e) => updateTestimonial(index, "name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-text-subtle">Relationship / Type</label>
                <input
                  type="text"
                  placeholder="e.g. Manager, Client"
                  className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm text-text"
                  value={item.type}
                  onChange={(e) => updateTestimonial(index, "type", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-text-subtle">Job Title & Company</label>
              <input
                type="text"
                placeholder="e.g. Senior Director at IBM"
                className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm text-text"
                value={item.title}
                onChange={(e) => updateTestimonial(index, "title", e.target.value)}
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
