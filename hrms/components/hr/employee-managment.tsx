"use client";

import { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import { toast } from "sonner";
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
  UserCircle,
  Mail,
  Building,
  Hash,
} from "lucide-react";

import {
  fetchEmployees,
  deleteEmployeeApi,
  addEmployeeApi,
} from "@/services/apis";

const departments = [
  "Engineering",
  "Design",
  "Marketing",
  "Human Resources",
  "Finance",
  "Operations",
  "Sales",
];

export function EmployeeManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);

  type Employee = {
    emp_id: string;
    name: string;
    email: string;
    department: string;
  };

  const [employeesList, setEmployeesList] = useState<Employee[]>([]);

  const loadEmployees = useCallback(async () => {
    const apiResponse = await fetchEmployees();
    if (Array.isArray(apiResponse)) {
      setEmployeesList(apiResponse);
    } else if (apiResponse && Array.isArray(apiResponse.data)) {
      setEmployeesList(apiResponse.data);
    } else {
      console.error("API did not return an array. It returned:", apiResponse);
      setEmployeesList([]);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    loadEmployees();
  }, [loadEmployees]);

  const handleDelete = async (emp_id: string) => {
    const success = await deleteEmployeeApi(emp_id);
    if (success) {
      loadEmployees();
    }
  };

  const formik = useFormik({
    initialValues: {
      emp_id: "",
      name: "",
      email: "",
      department: "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.emp_id.trim()) errors.emp_id = "Employee ID is required";
      if (!values.name.trim()) errors.name = "Full Name is required";
      if (!values.email.trim()) {
        errors.email = "Email is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }
      if (!values.department) errors.department = "Department is required";
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      const toastId = toast.loading("Adding employee...");

      const apiResponse = await addEmployeeApi({
        emp_id: values.emp_id.trim(),
        name: values.name.trim(),
        email: values.email.trim(),
        department: values.department,
      });

      if (apiResponse) {
        toast.success("Employee added successfully!", { id: toastId });
        resetForm();
        setDialogOpen(false);
        loadEmployees();
      } else {
        toast.error(
          "Failed to add employee. ID or Email might already exist.",
          { id: toastId },
        );
      }
    },
  });

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
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="emp_id"
                  className="flex items-center gap-1.5 text-sm"
                >
                  <Hash className="size-3.5" />
                  Employee ID
                </Label>
                <Input
                  id="emp_id"
                  name="emp_id"
                  placeholder="e.g. EMP006"
                  value={formik.values.emp_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.emp_id && formik.errors.emp_id && (
                  <p className="text-xs text-destructive">
                    {formik.errors.emp_id}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="name"
                  className="flex items-center gap-1.5 text-sm"
                >
                  <UserCircle className="size-3.5" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Jane Smith"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-xs text-destructive">
                    {formik.errors.name}
                  </p>
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
                  name="email"
                  type="email"
                  placeholder="e.g. jane@company.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-xs text-destructive">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="flex items-center gap-1.5 text-sm">
                  <Building className="size-3.5" />
                  Department
                </Label>
                <Select
                  value={formik.values.department}
                  onValueChange={(val) =>
                    formik.setFieldValue("department", val)
                  }
                >
                  <SelectTrigger
                    className="w-full"
                    onBlur={() => formik.setFieldTouched("department", true)}
                  >
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
                {formik.touched.department && formik.errors.department && (
                  <p className="text-xs text-destructive">
                    {formik.errors.department}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    formik.resetForm();
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
                {employeesList.length}
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {employeesList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <Users className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                No employees found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Add your first employee to get started.
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
                  {employeesList.map((emp) => (
                    <TableRow key={emp.emp_id}>
                      <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                        {emp.emp_id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {emp.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </div>
                          <span className="font-medium text-foreground">
                            {emp.name}
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
                              <span className="sr-only">Delete {emp.name}</span>
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
                                  {emp.name}
                                </span>
                                ? This will also remove all their attendance
                                records. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(emp.emp_id)}
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
