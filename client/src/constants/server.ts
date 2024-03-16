import axios from "axios";

export const SERVER_URL: string = `${import.meta.env.VITE_API}`;// || "http://localhost:8000"; //"http://localhost:8080"; 

const server = axios.create({
    baseURL: SERVER_URL,
    withCredentials: true
});

export default server;