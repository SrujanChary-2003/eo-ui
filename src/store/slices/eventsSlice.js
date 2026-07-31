import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as eventsApi from "../../apis/events/events.api";

export const fetchCatalog = createAsyncThunk("events/catalog", async (_, { rejectWithValue }) => {
  try {
    const response = await eventsApi.getCatalog();
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Failed to load catalog" });
  }
});

export const fetchEvents = createAsyncThunk("events/list", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await eventsApi.getEvents(params);
    return response.data.events || [];
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Failed to load events" });
  }
});

export const fetchEventById = createAsyncThunk("events/detail", async (eventId, { rejectWithValue }) => {
  try {
    const response = await eventsApi.getEventById(eventId);
    return response.data.event;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Failed to load event" });
  }
});

export const createEvent = createAsyncThunk("events/create", async (payload, { rejectWithValue }) => {
  try {
    const response = await eventsApi.createEvent(payload);
    return response.data.event;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Failed to create event" });
  }
});

export const updateEvent = createAsyncThunk(
  "events/update",
  async ({ eventId, payload }, { rejectWithValue }) => {
    try {
      const response = await eventsApi.updateEvent(eventId, payload);
      return response.data.event;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to update event" });
    }
  }
);

export const selectEventVendors = createAsyncThunk(
  "events/selectVendors",
  async ({ eventId, selections }, { rejectWithValue }) => {
    try {
      const response = await eventsApi.selectEventVendors(eventId, selections);
      return response.data.event;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to select vendors" });
    }
  }
);

export const removeEvent = createAsyncThunk("events/delete", async (eventId, { rejectWithValue }) => {
  try {
    await eventsApi.deleteEvent(eventId);
    return eventId;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Failed to delete event" });
  }
});

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    list: [],
    current: null,
    catalog: { eventTypes: [], serviceCategories: [] },
    loading: false,
    detailLoading: false,
    error: null,
  },
  reducers: {
    clearEventError(state) {
      state.error = null;
    },
    clearCurrentEvent(state) {
      state.current = null;
      state.error = null;
      state.detailLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.catalog = action.payload || { eventTypes: [], serviceCategories: [] };
      })
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load events";
      })
      .addCase(fetchEventById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.current = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.detailLoading = false;
        state.current = null;
        state.error = action.payload?.message || "Failed to load event";
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.current = action.payload;
        state.list = [action.payload, ...state.list.filter((e) => e.id !== action.payload.id)];
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.current = action.payload;
        state.list = state.list.map((e) => (e.id === action.payload.id ? action.payload : e));
      })
      .addCase(selectEventVendors.fulfilled, (state, action) => {
        state.current = action.payload;
        state.list = state.list.map((e) => (e.id === action.payload.id ? action.payload : e));
      })
      .addCase(removeEvent.fulfilled, (state, action) => {
        state.list = state.list.filter((e) => e.id !== action.payload);
        state.current = null;
      });
  },
});

export const { clearEventError, clearCurrentEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
