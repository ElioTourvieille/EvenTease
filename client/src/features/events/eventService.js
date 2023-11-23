import axios from "axios"

const API_URL = "/api/events/"

// Create Event
const createEvent = async (eventData) => {
    const response = await axios.post(API_URL + 'create', eventData);
    if (response.data) {
        localStorage.setItem('event', JSON.stringify(response.data));
    }
    return response.data;
};

const getAllEvents = async () => {
    const response = await axios(API_URL + 'all');
    return response.data;
}

const getUserEvent = async (token) => {
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios(API_URL + 'event', config);
    return response.data;
}

const deleteEvent = async (eventId, token) => {
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios(API_URL + eventId, config);
    return response.data;
}

const articlesService = {
    createEvent,
    getAllEvents,
    getUserEvent,
    deleteEvent
}

export default eventsService;