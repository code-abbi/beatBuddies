import axios from "axios";

const isProduction = import.meta.env.PROD;

export const axiosInstance = axios.create({
    // In production, this will make the URL relative (e.g., /api/songs)
    // In development, it will use your local .env variable
    baseURL: isProduction ? "/api" : (import.meta.env.VITE_API_URL || "http://localhost:8000/api"),
    withCredentials: true,
});

export function setAuthToken(token?: string) {
    if (token) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common["Authorization"];
    }
}