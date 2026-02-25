"use client";

import { useState, useMemo } from "react";
import { useHR } from "@/lib/hr-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  CalendarCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  User,
} from "lucide-react";

export function AttendanceManagement() {
  const { employees, attendance, markAttendance, getAttendanceByEmployee } =
    useHR();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState<"Present" | "Absent">("Present");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [filterEmployee, setFilterEmployee] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = useMemo(() => {
    let records = [...attendance].sort((a, b) => b.date.localeCompare(a.date));

    if (filterEmployee !== "all") {
      records = records.filter((r) => r.employeeId === filterEmployee);
    }
    if (filterStatus !== "all") {
      records = records.filter((r) => r.status === filterStatus);
    }
    if (searchQuery.trim()) {
      records = records.filter((r) => {
        const emp = employees.find((e) => e.id === r.employeeId);
        return (
          emp?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.date.includes(searchQuery)
        );
      });
    }
    return records;
  }, [attendance, employees, filterEmployee, filterStatus, searchQuery]);

  const stats = useMemo(() => {
    const total = attendance.length;
    const present = attendance.filter((a) => a.status === "Present").length;
    const absent = attendance.filter((a) => a.status === "Absent").length;
    return { total, present, absent };
  }, [attendance]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!selectedEmployeeId) errs.employee = "Please select an employee";
    if (!date) errs.date = "Date is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    markAttendance({
      employeeId: selectedEmployeeId,
      date,
      status,
    });
    setSelectedEmployeeId("");
    setDate(new Date().toISOString().split("T")[0]);
    setStatus("Present");
    setErrors({});
    setDialogOpen(false);
  }

  function getEmployeeName(id: string) {
    return employees.find((e) => e.id === id)?.fullName ?? "Unknown";
  }

  function getEmployeeInitials(id: string) {
    const name = getEmployeeName(id);
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Attendance
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage employee attendance records.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" />
              Mark Attendance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Mark Attendance</DialogTitle>
              <DialogDescription>
                Record attendance for an employee.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="flex items-center gap-1.5 text-sm">
                  <User className="size-3.5" />
                  Employee
                </Label>
                <Select
                  value={selectedEmployeeId}
                  onValueChange={setSelectedEmployeeId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.fullName} ({emp.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.employee && (
                  <p className="text-xs text-destructive">{errors.employee}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="attDate"
                  className="flex items-center gap-1.5 text-sm"
                >
                  <CalendarCheck className="size-3.5" />
                  Date
                </Label>
                <Input
                  id="attDate"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                {errors.date && (
                  <p className="text-xs text-destructive">{errors.date}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">Status</Label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus("Present")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-colors ${
                      status === "Present"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-border bg-card text-muted-foreground hover:border-emerald-300"
                    }`}
                  >
                    <CheckCircle2 className="size-4" />
                    Present
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("Absent")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-colors ${
                      status === "Absent"
                        ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-border bg-card text-muted-foreground hover:border-amber-300"
                    }`}
                  >
                    <XCircle className="size-4" />
                    Absent
                  </button>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setErrors({});
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Record</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <CalendarCheck className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.total}
                </p>
                <p className="text-xs text-muted-foreground">Total Records</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2.5">
                <CheckCircle2 className="size-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.present}
                </p>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-2.5">
                <XCircle className="size-5 text-amber-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.absent}
                </p>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarCheck className="size-4 text-primary" />
              Attendance Records
              <Badge variant="secondary" className="ml-1 font-normal">
                {filteredRecords.length}
              </Badge>
            </CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-48 bg-muted/50 border-transparent focus-visible:border-primary"
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={filterEmployee}
                  onValueChange={setFilterEmployee}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="size-3.5 mr-1" />
                    <SelectValue placeholder="Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Present">Present</SelectItem>
                    <SelectItem value="Absent">Absent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <CalendarCheck className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                No attendance records found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {searchQuery ||
                filterEmployee !== "all" ||
                filterStatus !== "all"
                  ? "Try adjusting your filters."
                  : "Mark attendance to get started."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-semibold">Employee</TableHead>
                    <TableHead className="font-semibold hidden sm:table-cell">
                      Employee ID
                    </TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record, i) => (
                    <TableRow key={`${record.employeeId}-${record.date}-${i}`}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {getEmployeeInitials(record.employeeId)}
                          </div>
                          <span className="font-medium text-foreground">
                            {getEmployeeName(record.employeeId)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell font-mono text-xs text-muted-foreground">
                        {record.employeeId}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(record.date + "T00:00:00").toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            record.status === "Present"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : "bg-amber-100 text-amber-700 border-amber-200"
                          }
                        >
                          {record.status === "Present" ? (
                            <CheckCircle2 className="size-3 mr-1" />
                          ) : (
                            <XCircle className="size-3 mr-1" />
                          )}
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
