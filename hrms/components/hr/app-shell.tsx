"use client";

import { HRProvider } from "@/lib/hr-store";
import { useState } from "react";
import { AppSidebar } from "./sidebar";
import { AppHeader } from "./header";
import { AttendanceManagement } from "./attendance-managment";
import { EmployeeManagement } from "./employee-managment";
import { Dashboard } from "./dashboard";

export function AppShell() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <HRProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AppHeader onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {activeTab === "dashboard" && (
              <Dashboard onNavigate={setActiveTab} />
            )}
            {activeTab === "employees" && <EmployeeManagement />}
            {activeTab === "attendance" && <AttendanceManagement />}
          </main>
        </div>
      </div>
    </HRProvider>
  );
}
