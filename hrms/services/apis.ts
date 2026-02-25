import axios, { AxiosResponse } from "axios";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchEmployees = async () => {
  try {
    const data = await axios.get(`${API_BASE_URL}/employees/`);
    return data;
  } catch (error) {
    toast.error("Failed to fetch employees list.");
    return null;
  }
};

export const deleteEmployeeApi = async (emp_id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/employees/${emp_id}`);
    if (response.status === 204) {
      toast.success("Employee deleted successfully.");
      return true;
    }
    return false;
  } catch (error) {
    toast.error("Failed to delete employee.");
    return false;
  }
};

export const addEmployeeApi = async (formData: {
  emp_id: string;
  name: string;
  email: string;
  department: string;
}) => {
  const params = {
    emp_id: formData.emp_id,
    name: formData.name,
    email: formData.email,
    department: formData.department,
  };

  try {
    const response: AxiosResponse = await axios.post(
      `${API_BASE_URL}/employees/`,
      params,
    );

    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as import("axios").AxiosError;
      const errorMessage =
        (axiosError?.response?.data as { detail?: string })?.detail ??
        axiosError.message;

      return { success: false, message: errorMessage };
    }

    return { success: false, message: "An unexpected error occurred" };
  }
};
