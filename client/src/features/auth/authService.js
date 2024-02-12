import axios from 'axios';

const API_URL = '/api/users/'; //root to API (server) (server.js)

// Register user
const register = async (userData) => {
    const response = await axios.post(API_URL + 'register', userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

// Login user
const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

// Logout user
const logout = () => {
    localStorage.removeItem('user');
};

// Update user
const updateUser = async (userData) => {
    const response = await axios.put(API_URL + 'update', userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const getUserCount = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.get(API_URL + 'count', {
        headers: {
            'Authorization': `Bearer ${user.token}`
        }
    });
    return response.data;
};

const authService = {
    register,
    login,
    logout,
    updateUser,
    getUserCount
};

export default authService;