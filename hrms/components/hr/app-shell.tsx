"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "./sidebar";
import { AppHeader } from "./header";
import { AttendanceManagement } from "./attendance-managment";
import { EmployeeManagement } from "./employee-managment";
import { Dashboard } from "./dashboard";

export function AppShell() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const savedTab = localStorage.getItem("hrms-active-tab");
    if (savedTab) {
      // eslint-disable-next-line
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem("hrms-active-tab", tab);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {activeTab === "dashboard" && (
            <Dashboard onNavigate={handleTabChange} />
          )}
          {activeTab === "employees" && <EmployeeManagement />}
          {activeTab === "attendance" && <AttendanceManagement />}
        </main>
      </div>
    </div>
  );
}
