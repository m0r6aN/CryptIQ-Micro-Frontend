import { configureStore, createSlice, createAsyncThunk, PayloadAction, combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

// Types
interface User {
  uid: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthState {
  user: User | null;
  is_authenticated: boolean;
  auth_token: string | null;
}

interface WebSocketState {
  is_connected: boolean;
  last_connection_attempt: number;
}

interface PortfolioState {
  total_value: number;
  change_24h: {
    amount: number;
    percentage: number;
  };
}

interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: number;
  is_read: boolean;
}

interface NotificationsState {
  unread_count: number;
  items: Notification[];
}

interface SettingsState {
  currency: string;
  language: string;
  theme: 'light' | 'dark';
}

// API
const API_BASE_URL = 'http://localhost:1337/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Async Thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState & { auth: { auth_token: string | null } };
      const authToken = state.auth.auth_token;
      if (!authToken) {
        return rejectWithValue('No authentication token found');
      }
      await api.post('/auth/logout', null, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return null;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetchPortfolio',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState & { auth: { auth_token: string | null } };
      const authToken = state.auth.auth_token;
      if (!authToken) {
        return rejectWithValue('No authentication token found');
      }
      const response = await api.get('/portfolio', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Slices
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    is_authenticated: false,
    auth_token: null,
  } as AuthState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.is_authenticated = true;
        state.auth_token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(logout.fulfilled, (state) => {
        state.is_authenticated = false;
        state.auth_token = null;
        state.user = null;
      });
  },
});

const websocketSlice = createSlice({
  name: 'websocket',
  initialState: {
    is_connected: false,
    last_connection_attempt: 0,
  } as WebSocketState,
  reducers: {
    setWebSocketConnected: (state, action: PayloadAction<boolean>) => {
      state.is_connected = action.payload;
      state.last_connection_attempt = Date.now();
    },
  },
});

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    total_value: 0,
    change_24h: {
      amount: 0,
      percentage: 0,
    },
  } as PortfolioState,
  reducers: {
    updatePortfolio: (state, action: PayloadAction<PortfolioState>) => {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPortfolio.fulfilled, (state, action) => {
      return { ...state, ...action.payload };
    });
  },
});

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    unread_count: 0,
    items: [],
  } as NotificationsState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.items.unshift(action.payload);
      state.unread_count += 1;
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find(item => item.id === action.payload);
      if (notification && !notification.is_read) {
        notification.is_read = true;
        state.unread_count -= 1;
      }
    },
    clearNotifications: (state) => {
      state.items = [];
      state.unread_count = 0;
    },
  },
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    currency: 'USD',
    language: 'en',
    theme: 'light',
  } as SettingsState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

// Root Reducer
const rootReducer = combineReducers({
    auth: authSlice.reducer,
    websocket: websocketSlice.reducer,
    portfolio: portfolioSlice.reducer,
    notifications: notificationsSlice.reducer,
    settings: settingsSlice.reducer,
  });
  
  // Persist Config
  const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'settings'],
  };
  
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Middleware
const socketMiddleware = (socket: Socket) => (params: { dispatch: any; getState: any; }) => (next: (arg0: any) => any) => (action: unknown) => {
  const { dispatch, getState } = params;
  const { auth } = getState() as RootState;

  if (websocketSlice.actions.setWebSocketConnected.match(action)) {
    if (action.payload && auth.is_authenticated) {
      socket.connect();
    } else {
      socket.disconnect();
    }
  }

  return next(action);
};

// Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(socketMiddleware(io('http://localhost:1337'))),
});

export const persistor = persistStore(store);

// Hooks
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Action Creators
export const { setWebSocketConnected } = websocketSlice.actions;
export const { updatePortfolio } = portfolioSlice.actions;
export const { addNotification, markNotificationAsRead, clearNotifications } = notificationsSlice.actions;
export const { updateSettings } = settingsSlice.actions;

// WebSocket Event Handlers
export const initializeWebSocket = () => (dispatch: AppDispatch, getState: () => RootState) => {
  const socket = io('http://localhost:1337');

  socket.on('connect', () => {
    dispatch(setWebSocketConnected(true));
  });

  socket.on('disconnect', () => {
    dispatch(setWebSocketConnected(false));
  });

  socket.on('portfolio_update', (data) => {
    dispatch(updatePortfolio(data));
  });

  socket.on('price_alert_triggered', (data) => {
    dispatch(addNotification({
      id: Date.now().toString(),
      type: 'price_alert',
      message: `Price alert for ${data.asset_symbol}: ${data.current_price}`,
      timestamp: Date.now(),
      is_read: false,
    }));
  });

  socket.on('new_transaction', (data) => {
    dispatch(addNotification({
      id: Date.now().toString(),
      type: 'transaction',
      message: `New ${data.transaction_type} transaction for ${data.asset_symbol}: ${data.quantity}`,
      timestamp: Date.now(),
      is_read: false,
    }));
  });

  return socket;
};

export default store;