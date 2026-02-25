"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
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
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Plus, CheckCircle2, XCircle, User } from "lucide-react";

import {
  fetchEmployees,
  getAllAttendanceApi,
  addAttendanceApi,
} from "@/services/apis";

export function AttendanceManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);

  type Employee = {
    emp_id: string;
    name: string;
    email: string;
    department: string;
  };
  type Attendance = {
    id?: number;
    emp_id: string;
    date: string;
    status: string;
  };

  const [employeesList, setEmployeesList] = useState<Employee[]>([]);
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);

  const loadData = useCallback(async () => {
    const emps = await fetchEmployees();
    if (Array.isArray(emps)) setEmployeesList(emps);
    else if (emps?.data && Array.isArray(emps.data))
      setEmployeesList(emps.data);

    const atts = await getAllAttendanceApi();
    if (Array.isArray(atts)) setAttendanceList(atts);
    else if (atts?.data && Array.isArray(atts.data))
      setAttendanceList(atts.data);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    loadData();
  }, [loadData]);

  const formik = useFormik({
    initialValues: {
      emp_id: "",
      date: new Date().toISOString().split("T")[0],
      status: "Present",
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.emp_id) errors.emp_id = "Please select an employee";
      if (!values.date) errors.date = "Date is required";
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      const toastId = toast.loading("Marking attendance...");

      const apiResponse = await addAttendanceApi({
        emp_id: values.emp_id,
        date: values.date,
        status: values.status,
      });

      if (apiResponse && apiResponse.success === true) {
        toast.success("Attendance marked successfully!", { id: toastId });
        resetForm();
        setDialogOpen(false);
        loadData();
      } else {
        toast.error(apiResponse?.message || "Failed to mark attendance.", {
          id: toastId,
        });
      }
    },
  });

  function getEmployeeName(emp_id: string) {
    return employeesList.find((e) => e.emp_id === emp_id)?.name ?? "Unknown";
  }

  function getEmployeeInitials(emp_id: string) {
    const name = getEmployeeName(emp_id);
    return name === "Unknown"
      ? "?"
      : name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2);
  }

  const sortedRecords = useMemo(() => {
    return [...attendanceList].sort((a, b) => b.date.localeCompare(a.date));
  }, [attendanceList]);

  const stats = useMemo(() => {
    const total = attendanceList.length;
    const present = attendanceList.filter((a) => a.status === "Present").length;
    const absent = attendanceList.filter((a) => a.status === "Absent").length;
    return { total, present, absent };
  }, [attendanceList]);

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
            <Button className="gap-2 cursor-pointer">
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
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <Label className="flex items-center gap-1.5 text-sm">
                  <User className="size-3.5" />
                  Employee
                </Label>
                <Select
                  value={formik.values.emp_id}
                  onValueChange={(val) => formik.setFieldValue("emp_id", val)}
                >
                  <SelectTrigger
                    className="w-full"
                    onBlur={() => formik.setFieldTouched("emp_id", true)}
                  >
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employeesList.map((emp) => (
                      <SelectItem key={emp.emp_id} value={emp.emp_id}>
                        {emp.name} ({emp.emp_id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.emp_id && formik.errors.emp_id && (
                  <p className="text-xs text-destructive">
                    {formik.errors.emp_id}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="date"
                  className="flex items-center gap-1.5 text-sm"
                >
                  <CalendarCheck className="size-3.5" />
                  Date
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.date && formik.errors.date && (
                  <p className="text-xs text-destructive">
                    {formik.errors.date}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">Status</Label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue("status", "Present")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-colors ${
                      formik.values.status === "Present"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-border bg-card text-muted-foreground hover:border-emerald-300"
                    }`}
                  >
                    <CheckCircle2 className="size-4" />
                    Present
                  </button>
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue("status", "Absent")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-colors ${
                      formik.values.status === "Absent"
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
                    formik.resetForm();
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
                {attendanceList.length}
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {sortedRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <CalendarCheck className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                No attendance records found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Mark attendance to get started.
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
                  {sortedRecords.map((record, i) => (
                    <TableRow key={`${record.emp_id}-${record.date}-${i}`}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {getEmployeeInitials(record.emp_id)}
                          </div>
                          <span className="font-medium text-foreground">
                            {getEmployeeName(record.emp_id)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell font-mono text-xs text-muted-foreground">
                        {record.emp_id}
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
