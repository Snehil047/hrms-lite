"use client";

import { useState } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Users,
  Search,
  UserCircle,
  Mail,
  Building,
  Hash,
} from "lucide-react";
import { useHR } from "@/lib/hr-store";

const departments = [
  "Engineering",
  "Design",
  "Marketing",
  "Human Resources",
  "Finance",
  "Operations",
  "Sales",
];

const emptyForm = { id: "", fullName: "", email: "", department: "" };

export function EmployeeManagement() {
  const { employees, addEmployee, deleteEmployee } = useHR();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");

  const filteredEmployees = employees.filter(
    (e) =>
      e.fullName.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()),
  );

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.id.trim()) errs.id = "Employee ID is required";
    else if (employees.some((e) => e.id === form.id.trim()))
      errs.id = "Employee ID already exists";
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Invalid email format";
    if (!form.department) errs.department = "Department is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    addEmployee({
      id: form.id.trim(),
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      department: form.department,
    });
    setForm(emptyForm);
    setErrors({});
    setDialogOpen(false);
  }

  function getDepartmentColor(dept: string) {
    const colors: Record<string, string> = {
      Engineering: "bg-blue-100 text-blue-700 border-blue-200",
      Design: "bg-pink-100 text-pink-700 border-pink-200",
      Marketing: "bg-orange-100 text-orange-700 border-orange-200",
      "Human Resources": "bg-primary/10 text-primary border-primary/20",
      Finance: "bg-emerald-100 text-emerald-700 border-emerald-200",
      Operations: "bg-cyan-100 text-cyan-700 border-cyan-200",
      Sales: "bg-amber-100 text-amber-700 border-amber-200",
    };
    return colors[dept] ?? "bg-muted text-muted-foreground";
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Employees
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your team members and their details.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new team member.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="empId"
                  className="flex items-center gap-1.5 text-sm"
                >
                  <Hash className="size-3.5" />
                  Employee ID
                </Label>
                <Input
                  id="empId"
                  placeholder="e.g. EMP006"
                  value={form.id}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, id: e.target.value }))
                  }
                />
                {errors.id && (
                  <p className="text-xs text-destructive">{errors.id}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="fullName"
                  className="flex items-center gap-1.5 text-sm"
                >
                  <UserCircle className="size-3.5" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="e.g. Jane Smith"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fullName: e.target.value }))
                  }
                />
                {errors.fullName && (
                  <p className="text-xs text-destructive">{errors.fullName}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="email"
                  className="flex items-center gap-1.5 text-sm"
                >
                  <Mail className="size-3.5" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. jane@company.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="flex items-center gap-1.5 text-sm">
                  <Building className="size-3.5" />
                  Department
                </Label>
                <Select
                  value={form.department}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, department: v }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-xs text-destructive">
                    {errors.department}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setForm(emptyForm);
                    setErrors({});
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Employee</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-4 text-primary" />
              Employee Directory
              <Badge variant="secondary" className="ml-1 font-normal">
                {employees.length}
              </Badge>
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-muted/50 border-transparent focus-visible:border-primary"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredEmployees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <Users className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                No employees found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {search
                  ? "Try adjusting your search query."
                  : "Add your first employee to get started."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-semibold">Employee ID</TableHead>
                    <TableHead className="font-semibold">Full Name</TableHead>
                    <TableHead className="font-semibold hidden sm:table-cell">
                      Email
                    </TableHead>
                    <TableHead className="font-semibold">Department</TableHead>
                    <TableHead className="font-semibold text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                        {emp.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {emp.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span className="font-medium text-foreground">
                            {emp.fullName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {emp.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getDepartmentColor(emp.department)}
                        >
                          {emp.department}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="size-4" />
                              <span className="sr-only">
                                Delete {emp.fullName}
                              </span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Employee
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete{" "}
                                <span className="font-semibold text-foreground">
                                  {emp.fullName}
                                </span>
                                ? This will also remove all their attendance
                                records. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteEmployee(emp.id)}
                                className="bg-destructive text-white hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
