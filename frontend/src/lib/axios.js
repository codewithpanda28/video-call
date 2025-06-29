import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api', // <-- Use 8000 if backend runs on 8000
    withCredentials: true, // Include credentials in requests
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Set a timeout of 10 seconds
})