import axios from "axios"

const API_URL = "/api/events/"

// Create Event
const createEvent = async (eventData, imageFile) => {
    try {
        let imageUrl = null
        if (imageFile) {
            const formData = new FormData()
            formData.append('file', imageFile)
            const uploadResponse = await axios.post(API_URL + 'upload', formData, {
                headers: {'Content-Type': 'multipart/form-data'},
            })
            imageUrl = uploadResponse.data.url
        }

        eventData.image = imageUrl

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

const updateEvent = async (id, eventData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    try {
        const response = await axios.put(API_URL + id, eventData, config);
        if (response.data) {
            localStorage.setItem('event', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
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

const participateInEvent = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URL + id + '/participate', {}, config)

    try {
        if (response.data) {
            localStorage.setItem('event', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error(error.response.data);
            throw new Error(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error(error.request);
        } else {
            // A error occurred
            console.error('Error', error.message);
            throw new Error(error.message);
        }
    }
}

const unsubscribeFromEvent = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL + id + '/unsubscribe', config)
    try {
        if (response.status === 200) {
            localStorage.setItem('event', JSON.stringify(response.data));
            return response.data;
        } else {
            throw new Error('Error');
        }
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
const getEventCount = async () => {
    const response = await axios.get(API_URL + 'count');
    return response.data;
}

const deleteEvent = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    try {
        const response = await axios.delete(API_URL + id, config)
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const eventsService = {
    createEvent,
    getAllEvents,
    getUserEvent,
    deleteEvent,
    getEventCount,
    participateInEvent,
    unsubscribeFromEvent,
    updateEvent
}

export default eventsService;