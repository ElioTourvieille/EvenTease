import axios from "axios"

const API_URL = "/api/events/"

// Create Event
const createEvent = async (eventData) => {
    try {
        const response = await axios.post(API_URL + 'create', eventData);
        if (response.data) {
            localStorage.setItem('event', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error(error.request);
        } else {
            // A error occurred
            console.error('Error', error.message);
        }
    }
};

const getAllEvents = async () => {
    const response = await axios(API_URL + 'all');
    return response.data;
}

const getUserEvent = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios(API_URL + 'user', config);
    return response.data;
}

const participateInEvent = async (eventId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL + `${eventId}`+ '/participate', null, config)
    try {
        if (response.data) {
            localStorage.setItem('event', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error(error.request);
        } else {
            // A error occurred
            console.error('Error', error.message);
        }
    }
}

const deleteEvent = async (eventId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios(API_URL + eventId, config);
    return response.data;
}

const eventsService = {
    createEvent,
    getAllEvents,
    getUserEvent,
    deleteEvent,
    participateInEvent
}

export default eventsService;