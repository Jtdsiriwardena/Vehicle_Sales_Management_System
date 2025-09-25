import axios from "axios";

// Base axios instance
const API = axios.create({
  baseURL: "http://localhost:4000",
});

// JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface Vehicle {
  id: number;
  type: string;
  brand: string;
  model: string;
  color: string;
  engineSize?: string;
  year: number;
  price: number;
  description: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// API Methods 
const vehicleApi = {
  // Get all vehicles filters
  getVehicles: async (params?: {
    page?: number;
    limit?: number;
    brand?: string;
    model?: string;
    type?: string;
    year?: number;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Vehicle[]> => {
    const response = await API.get("/api/vehicles", { params });
    return response.data.data;
  },
  
  // Get colours
  getColors: async (): Promise<string[]> => {
  const res = await axios.get(`${API}/colors`);
  return res.data;
},

   //Get engine size
   getEngineSizes: async (): Promise<string[]> => {
  const res = await axios.get(`${API}/engine-sizes`);
  return res.data;
},

  // Get single vehicle by ID
  getVehicle: async (id: number): Promise<Vehicle> => {
    const response = await API.get(`/api/vehicles/${id}`);
    return response.data;
  },

  // Create new vehicle
  createVehicle: async (formData: FormData): Promise<Vehicle> => {
    const response = await API.post("/api/vehicles", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Update vehicle
  updateVehicle: async (id: number, formData: FormData): Promise<Vehicle> => {
    const response = await API.put(`/api/vehicles/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Delete vehicle
  deleteVehicle: async (id: number): Promise<{ message: string }> => {
    const response = await API.delete(`/api/vehicles/${id}`);
    return response.data;
  },

  // Generate description
 generateDescription: async (payload: {
  brand?: string;
  model?: string;
  type?: string;
  color?: string;
  engineSize?: string;
  year?: number;
  price?: number;
}) => {
  const res = await API.post("/api/vehicles/generate-description", payload);
  return res.data.description as string;
},


};

export default vehicleApi;
