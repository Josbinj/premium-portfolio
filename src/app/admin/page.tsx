import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Layers, Activity, Users, Mail } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif tracking-tight text-text">Admin Dashboard</h1>
        <p className="text-text-muted mt-2">
          Welcome back, Josbin. Manage your portfolio content and view messages from here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">
              Total Sections
            </CardTitle>
            <Layers className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text">6</div>
          </CardContent>
        </Card>
        
        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">
              Unread Messages
            </CardTitle>
            <Mail className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text">3</div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">
              Profile Views
            </CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text">+1,204</div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">
              System Status
            </CardTitle>
            <Activity className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">Online</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="glass border border-border/50 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-surface/50 border border-border hover:border-accent/30 transition-colors cursor-pointer">
            <h3 className="font-medium text-text">Update Hero Status</h3>
            <p className="text-sm text-text-muted mt-1">Change your current role or main tagline.</p>
          </div>
          <div className="p-4 rounded-lg bg-surface/50 border border-border hover:border-accent/30 transition-colors cursor-pointer">
            <h3 className="font-medium text-text">Add Experience</h3>
            <p className="text-sm text-text-muted mt-1">Log a new project or job role.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
