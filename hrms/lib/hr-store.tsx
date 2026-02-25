"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  PropsWithChildren,
} from "react";

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  department: string;
}

export interface AttendanceRecord {
  employeeId: string;
  date: string;
  status: "Present" | "Absent";
}

export interface HRStore {
  employees: Employee[];
  attendance: AttendanceRecord[];
  addEmployee: (employee: Employee) => void;
  deleteEmployee: (id: string) => void;
  markAttendance: (record: AttendanceRecord) => void;
  getAttendanceByEmployee: (employeeId: string) => AttendanceRecord[];
}

const HRContext = createContext<HRStore | null>(null);

const sampleEmployees: Employee[] = [
  {
    id: "EMP001",
    fullName: "Srishti Tamang",
    email: "srishti@hrhub.com",
    department: "Design",
  },
  {
    id: "EMP002",
    fullName: "Brandon Lee",
    email: "brandon@hrhub.com",
    department: "Engineering",
  },
  {
    id: "EMP003",
    fullName: "John Doe",
    email: "john@hrhub.com",
    department: "Marketing",
  },
  {
    id: "EMP004",
    fullName: "Rose Grace",
    email: "rose@hrhub.com",
    department: "Human Resources",
  },
  {
    id: "EMP005",
    fullName: "Alex Rivera",
    email: "alex@hrhub.com",
    department: "Engineering",
  },
];

const sampleAttendance: AttendanceRecord[] = [
  { employeeId: "EMP001", date: "2026-02-24", status: "Present" },
  { employeeId: "EMP001", date: "2026-02-25", status: "Present" },
  { employeeId: "EMP002", date: "2026-02-24", status: "Absent" },
  { employeeId: "EMP002", date: "2026-02-25", status: "Present" },
  { employeeId: "EMP003", date: "2026-02-24", status: "Present" },
  { employeeId: "EMP003", date: "2026-02-25", status: "Absent" },
  { employeeId: "EMP004", date: "2026-02-24", status: "Present" },
  { employeeId: "EMP005", date: "2026-02-24", status: "Present" },
  { employeeId: "EMP005", date: "2026-02-25", status: "Present" },
];

export function HRProvider({ children }: PropsWithChildren): React.JSX.Element {
  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees);

  const [attendance, setAttendance] =
    useState<AttendanceRecord[]>(sampleAttendance);

  const addEmployee = useCallback((employee: Employee) => {
    setEmployees((prev) => [...prev, employee]);
  }, []);

  const deleteEmployee = useCallback((id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));

    setAttendance((prev) => prev.filter((a) => a.employeeId !== id));
  }, []);

  const markAttendance = useCallback((record: AttendanceRecord) => {
    setAttendance((prev) => {
      const existingIndex = prev.findIndex(
        (a) => a.employeeId === record.employeeId && a.date === record.date,
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = record;
        return updated;
      }

      return [...prev, record];
    });
  }, []);

  const getAttendanceByEmployee = useCallback(
    (employeeId: string) => {
      return attendance.filter((a) => a.employeeId === employeeId);
    },
    [attendance],
  );

  const value: HRStore = {
    employees,
    attendance,
    addEmployee,
    deleteEmployee,
    markAttendance,
    getAttendanceByEmployee,
  };

  return <HRContext.Provider value={value}>{children}</HRContext.Provider>;
}

export function useHR(): HRStore {
  const context = useContext(HRContext);

  if (!context) {
    throw new Error("useHR must be used within an HRProvider");
  }

  return context;
}
