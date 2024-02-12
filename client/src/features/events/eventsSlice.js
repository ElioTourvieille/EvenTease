import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import eventsService from "./eventsService";

const initialState = {
    events: [],
    isSuccess: false,
    isListing: false,
    isParticipating: false,
    isError: false,
    isLoading: false,
    message: '',
};

export const createEvent = createAsyncThunk(
    'event/create',
    async (event, thunkAPI) => {
        try {
            return await eventsService.createEvent(event);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message
            ) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getAllEvents = createAsyncThunk(
    'events/all',
    async(_, thunkAPI) => {
        try {
            return await eventsService.getAllEvents();

        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message
            ) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const updateEvent = createAsyncThunk(
    'events/updateEvent',
    async (event, { rejectWithValue }) => {
        try {
           return await eventsService.updateEvent(event.id, event.data, event.token);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getUserEvents = createAsyncThunk(
    'events',
    async(_, thunkAPI) => {

        try {
            const token = thunkAPI.getState().auth.user.token
            return await eventsService.getUserEvent(token);

        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message
            ) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const participateInEvent = createAsyncThunk(
    'events/participate',
    async(id, thunkAPI) => {

        try {
            const token = thunkAPI.getState().auth.user.token
            return await eventsService.participateInEvent(id, token);

        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message
            ) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const unsubscribeFromEvent = createAsyncThunk(
    'events/unsubscribe',
    async(id, thunkAPI) => {

        try {
            const token = thunkAPI.getState().auth.user.token
            return await eventsService.unsubscribeFromEvent(id, token);

        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message
            ) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getEventCount = createAsyncThunk(
    'events/count',
    async(_, thunkAPI) => {
        try {
            return await eventsService.getEventCount();

        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message
            ) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const deleteEvent = createAsyncThunk(
    'events/delete',
    async(id, thunkAPI) => {

        try {
            const token = thunkAPI.getState().auth.user.token
            return await eventsService.deleteEvent(id, token);

        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message
            ) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isParticipating = false;
            state.isError = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createEvent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createEvent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.events.push(action.payload);
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.events = null;
            })
            .addCase(getAllEvents.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllEvents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isListing = true;
                state.events = action.payload;
            })
            .addCase(getAllEvents.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(participateInEvent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(participateInEvent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isParticipating = true;
                state.participants = action.payload;
            })
            .addCase(participateInEvent.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getUserEvents.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUserEvents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isListing = true;
                state.userEvents = action.payload;
            })
            .addCase(getUserEvents.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteEvent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.events = state.events.filter(event => event._id !== action.meta.arg);
            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getEventCount.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getEventCount.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isListing = true;
                state.eventCount = action.payload;
            })
            .addCase(getEventCount.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateEvent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.events = state.events.map(event => {
                    if(event._id === action.payload._id) {
                        return action.payload;
                    }
                    return event;
                });
            })
            .addCase(updateEvent.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
})

export const {reset} = eventsSlice.actions;
export default eventsSlice.reducer;