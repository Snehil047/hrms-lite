"use client";

import { useHR } from "@/lib/hr-store";
import {
  Users,
  CalendarCheck,
  UserX,
  TrendingUp,
  ArrowRight,
  Bell,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { employees, attendance } = useHR();

  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayRecords = attendance.filter((a) => a.date === today);
    const presentToday = todayRecords.filter(
      (a) => a.status === "Present",
    ).length;
    const absentToday = todayRecords.filter(
      (a) => a.status === "Absent",
    ).length;
    const attendanceRate =
      todayRecords.length > 0
        ? Math.round((presentToday / todayRecords.length) * 100)
        : 0;
    return { presentToday, absentToday, attendanceRate };
  }, [attendance]);

  const recentActivity = useMemo(() => {
    const sorted = [...attendance].sort((a, b) => b.date.localeCompare(a.date));
    return sorted.slice(0, 5).map((record) => {
      const emp = employees.find((e) => e.id === record.employeeId);
      return { ...record, employeeName: emp?.fullName ?? "Unknown" };
    });
  }, [attendance, employees]);

  const statCards = [
    {
      title: "Total Employees",
      value: employees.length,
      icon: Users,
      description: "Active workforce",
      accent: "bg-primary/10 text-primary",
    },
    {
      title: "Present Today",
      value: stats.presentToday,
      icon: CalendarCheck,
      description: "Checked in",
      accent: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Absent Today",
      value: stats.absentToday,
      icon: UserX,
      description: "Not checked in",
      accent: "bg-amber-100 text-amber-700",
    },
    {
      title: "Attendance Rate",
      value: `${stats.attendanceRate}%`,
      icon: TrendingUp,
      description: "Today's rate",
      accent: "bg-primary/10 text-primary",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight text-balance">
          Welcome back, Admin!
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {"Here's what's happening with your team today."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="gap-0 border-border/60 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    {stat.title}
                  </span>
                  <span className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {stat.description}
                  </span>
                </div>
                <div className={`rounded-lg p-2.5 ${stat.accent}`}>
                  <stat.icon className="size-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="size-4 text-primary" />
                Quick Actions
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 pb-5">
            <button
              onClick={() => onNavigate("employees")}
              className="flex items-center justify-between rounded-lg border border-border/60 bg-card p-3.5 text-left transition-colors hover:bg-accent group"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2">
                  <Users className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Add New Employee
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Register a new team member
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => onNavigate("attendance")}
              className="flex items-center justify-between rounded-lg border border-border/60 bg-card p-3.5 text-left transition-colors hover:bg-accent group"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-emerald-100 p-2">
                  <CalendarCheck className="size-4 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Mark Attendance
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Record today&apos;s attendance
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => onNavigate("attendance")}
              className="flex items-center justify-between rounded-lg border border-border/60 bg-card p-3.5 text-left transition-colors hover:bg-accent group"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-amber-100 p-2">
                  <TrendingUp className="size-4 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    View Reports
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Check attendance statistics
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </button>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="size-4 text-primary" />
                Recent Activity
              </CardTitle>
              <button
                onClick={() => onNavigate("attendance")}
                className="text-xs font-medium text-primary hover:underline"
              >
                View All
              </button>
            </div>
          </CardHeader>
          <CardContent className="pb-5">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No recent activity
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {recentActivity.map((record, i) => (
                  <div
                    key={`${record.employeeId}-${record.date}-${i}`}
                    className="flex items-center justify-between rounded-lg border border-border/60 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {record.employeeName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {record.employeeName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {record.date}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        record.status === "Present" ? "default" : "secondary"
                      }
                      className={
                        record.status === "Present"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-amber-100 text-amber-700 border-amber-200"
                      }
                    >
                      {record.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
