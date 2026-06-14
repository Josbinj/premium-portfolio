"use client";

import { useState, useEffect } from "react";
import { fetchSectionData, updateSectionData } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function AdminExperiencePage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetchSectionData("experience");
      if (res && res.data && Array.isArray(res.data)) {
        setData(res.data);
      } else if (res && res.data && Array.isArray(res.data.experiences)) {
        setData(res.data.experiences);
      } else {
        // Default if empty
        setData([
          {
            id: "1",
            company: "IBM",
            position: "Technical Support Professional",
            location: "Kochi, India",
            type: "Full-time",
            startDate: "11/2024",
            endDate: "Present",
            current: true,
            description: "Providing advanced technical support for Data Virtualization (DV) on CP4D on prem and Cloud, Db2 REST API, and BigSQL on Cloud Pak for Data.",
            achievements: [
              "Providing advanced technical support for Data Virtualization (DV) on CP4D on prem and Cloud.",
              "Supporting Db2 REST API and BigSQL on Cloud Pak for Data.",
              "Utilizing container orchestration platform Redhat Openshift and DVaaS on IBM Cloud.",
              "Collaborating with cross-functional teams to ensure seamless integration and support."
            ],
            technologies: ["Redhat OpenShift", "IBM Cloud", "Data Virtualization", "BigSQL", "Db2", "Kubernetes"],
          },
          {
            id: "2",
            company: "Cloud That Technologies",
            position: "Research Associate",
            location: "Bangalore, India",
            type: "Full-time",
            startDate: "09/2022",
            endDate: "05/2024",
            current: false,
            description: "Engineered automated CI/CD pipelines using AWS DevOps to streamline software delivery.",
            achievements: [
              "Engineered automated CI/CD pipelines using AWS DevOps to streamline software delivery.",
              "Implemented automated monitoring, alarming, and dashboarding solutions to improve system visibility.",
              "Conducted research on multi-cloud integration and developed best practices for cloud resource management.",
              "Developed a high-performance Go (Golang) backend to support parallel resource scanning.",
              "Provisioned a secure EKS cluster using Terraform and AWS CLI, configuring IAM roles and OIDC providers."
            ],
            technologies: ["AWS", "Go (Golang)", "React", "Terraform", "CI/CD", "EKS", "Docker"],
          },
          {
            id: "3",
            company: "Cloud That Technologies",
            position: "Research Intern",
            location: "Bangalore, India",
            type: "Internship",
            startDate: "03/2022",
            endDate: "09/2022",
            current: false,
            description: "Assisted with research on multi-cloud resource discovery engines and AWS infrastructure automation.",
            achievements: [
              "Designed a high-availability 2-tier architecture featuring Multi-AZ RDS, VPC, and Load Balancers.",
              "Built a robust CI/CD pipeline with automated rollback capabilities triggered on application failure.",
              "Integrated MS Teams notifications for real-time CI/CD status updates and utilized S3 for versioned deployment rollbacks."
            ],
            technologies: ["AWS", "VPC", "RDS", "Load Balancers", "S3"],
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
      await updateSectionData("experience", data);
      alert("Experience updated successfully!");
    } catch (err) {
      alert("Failed to update.");
      console.error(err);
    }
    setIsSaving(false);
  };

  const addExperience = () => {
    setData([
      {
        id: Date.now().toString(),
        company: "New Company",
        position: "New Role",
        location: "Location",
        type: "Full-time",
        startDate: "01/2024",
        endDate: "Present",
        current: true,
        description: "Description of the role.",
        achievements: [],
        technologies: [],
      },
      ...(Array.isArray(data) ? data : []),
    ]);
  };

  const updateEntry = (id: string, field: string, value: any) => {
    setData((Array.isArray(data) ? data : []).map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const deleteEntry = (id: string) => {
    setData((Array.isArray(data) ? data : []).filter(item => item.id !== id));
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif tracking-tight text-text">Experience</h1>
          <p className="text-text-muted mt-2">Manage your work history.</p>
        </div>
        <Button onClick={addExperience} variant="outline">Add New Role</Button>
      </div>

      <div className="space-y-6">
        {(Array.isArray(data) ? data : []).map((item) => (
          <div key={item.id} className="glass border border-border/50 rounded-xl p-6 space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium">Edit Role</h3>
              <button onClick={() => deleteEntry(item.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-text-muted">Role / Position</label>
                <input
                  type="text"
                  className="w-full bg-background border border-border rounded-md px-4 py-2 text-text"
                  value={item.position || ""}
                  onChange={(e) => updateEntry(item.id, "position", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-text-muted">Company</label>
                <input
                  type="text"
                  className="w-full bg-background border border-border rounded-md px-4 py-2 text-text"
                  value={item.company || ""}
                  onChange={(e) => updateEntry(item.id, "company", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-text-muted">Location</label>
                <input
                  type="text"
                  className="w-full bg-background border border-border rounded-md px-4 py-2 text-text"
                  value={item.location || ""}
                  onChange={(e) => updateEntry(item.id, "location", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-text-muted">Start Date</label>
                <input
                  type="text"
                  className="w-full bg-background border border-border rounded-md px-4 py-2 text-text"
                  value={item.startDate || ""}
                  onChange={(e) => updateEntry(item.id, "startDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-text-muted">End Date</label>
                <input
                  type="text"
                  className="w-full bg-background border border-border rounded-md px-4 py-2 text-text"
                  value={item.endDate || ""}
                  disabled={item.current}
                  onChange={(e) => updateEntry(item.id, "endDate", e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="space-y-2 flex-1">
                <label className="text-sm text-text-muted">Job Type</label>
                <input
                  type="text"
                  className="w-full bg-background border border-border rounded-md px-4 py-2 text-text"
                  value={item.type || ""}
                  placeholder="Full-time, Internship, etc."
                  onChange={(e) => updateEntry(item.id, "type", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id={`current-${item.id}`}
                  checked={item.current || false}
                  onChange={(e) => updateEntry(item.id, "current", e.target.checked)}
                />
                <label htmlFor={`current-${item.id}`} className="text-sm text-text-muted">Current Role</label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-text-muted">Description</label>
              <textarea
                className="w-full bg-background border border-border rounded-md px-4 py-2 text-text min-h-[60px]"
                value={item.description || ""}
                onChange={(e) => updateEntry(item.id, "description", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-text-muted">Key Achievements (One per line)</label>
              <textarea
                className="w-full bg-background border border-border rounded-md px-4 py-2 text-text min-h-[100px]"
                value={(item.achievements || []).join("\n")}
                onChange={(e) => updateEntry(item.id, "achievements", e.target.value.split("\n").filter(a => a.trim() !== ""))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-text-muted">Technologies (Comma Separated)</label>
              <input
                type="text"
                className="w-full bg-background border border-border rounded-md px-4 py-2 text-text"
                value={(item.technologies || []).join(", ")}
                onChange={(e) => updateEntry(item.id, "technologies", e.target.value.split(",").map((t: string) => t.trim()))}
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
