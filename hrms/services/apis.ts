import axios from "axios";
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
