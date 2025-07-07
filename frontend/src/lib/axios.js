import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // if you use cookies/auth
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Set a timeout of 10 seconds
})

