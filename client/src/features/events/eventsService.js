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
            // La requête a été faite, mais le serveur a répondu avec un code d'erreur
            console.error(error.response.data);
        } else if (error.request) {
            // La requête a été faite, mais aucune réponse n'a été reçue
            console.error(error.request);
        } else {
            // Une erreur s'est produite lors de la configuration de la requête
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
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios(API_URL + 'user', config);
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

const eventsService = {
    createEvent,
    getAllEvents,
    getUserEvent,
    deleteEvent
}

export default eventsService;