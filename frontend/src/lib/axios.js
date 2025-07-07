import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: 'https://video-call-ibe5.onrender.com/api', // <-- Updated to your Render deployment!
    withCredentials: true, // if you use cookies/auth
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Set a timeout of 10 seconds
})

