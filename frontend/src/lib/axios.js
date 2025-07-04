import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api', // <-- Make sure this matches your backend!
    withCredentials: true, // if you use cookies/auth
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Set a timeout of 10 seconds
})

