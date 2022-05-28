import {
  PayloadAction,
  configureStore,
  createSlice,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";

import { Appearance } from "./Types/Appearance";
import { Confirmation } from "./Types/Confirmation";
import { Connection } from "./Types/Connection";
import { Error } from "./Types/Error";
import { ItemType } from "./Types/Item";
import { Page } from "./Types/Page";
import { State } from "./Types/State";
import { Query } from "./Types/Query";
import { Region } from "./Types/Region";

const initialState: State = {
  currentTotalDocs: 0,
  isLoading: false,
  data: [],
  selected: [],
  currentPage: "database",
  settings: {
    appearance: {
      darkTheme: false,
      fontFamily: "Roboto",
      fontSize: "14pt",
    },
    general: {
      maxDB: 6,
      stepSize: 10,
    },
    region: {
      language: 0,
      dateFormat: "system",
    },
    license: "teste",
  },
  terminal: {
    open: false,
    stdout: [
      "Bluedis Terminal (Beta)",
      "\u00a0",
      'This terminal is under tests still. Type "help" to check for commands or go to Help tab.',
      "\u00a0",
    ],
  },
  connected: false,
  favorites: [],
  lastRefresh: new Date(),
  query: { input: "*", cursor: 0, count: 0, done: false },
};

const slice = createSlice({
  name: "store",
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    setData: (state, action: PayloadAction<ItemType[]>) => {
      state.lastRefresh = new Date();
      state.data = action.payload;
    },
    pushData: (state, action: PayloadAction<ItemType[]>) => {
      state.lastRefresh = new Date();
      state.data = [...state.data, ...action.payload];
    },
    setPreview: (state, action: PayloadAction<ItemType | undefined>) => {
      state.preview = action.payload;
    },
    selectAll: (state) => {
      if (state.data.every((item) => state.selected.includes(item.key))) {
        state.selected = [];
      } else {
        state.selected = state.data.map((item) => item.key);
      }
    },
    pushSelected: (state, action: PayloadAction<string>) => {
      state.selected = [...state.selected, action.payload];
    },
    removeSelected: (state, action: PayloadAction<string>) => {
      state.selected = state.selected.filter((key) => key !== action.payload);
    },
    clearSelection: (state) => {
      state.selected = [];
    },
    changePage: (state, action: PayloadAction<Page>) => {
      state.currentPage = action.payload;
    },
    changeAppearance: (state, action: PayloadAction<Appearance>) => {
      state.settings.appearance = action.payload;
    },
    changeRegion: (state, action: PayloadAction<Region>) => {
      state.settings.region = action.payload;
    },
    updatePreferences: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    currentConnection: (state, action: PayloadAction<Connection>) => {
      state.connection = action.payload;
    },
    addFavorite: (state, action: PayloadAction<Connection>) => {
      state.favorites = [...state.favorites, action.payload];
    },
    updateFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(
        (favorite) => favorite.id !== action.payload
      );
    },
    updateLicense: (state, action: PayloadAction<string>) => {
      state.settings.license = action.payload;
    },
    setError: (state, action: PayloadAction<Error | undefined>) => {
      state.error = action.payload;
    },
    setConfirmation: (
      state,
      action: PayloadAction<Confirmation | undefined>
    ) => {
      state.confirmation = action.payload;
    },
    setEditTTL: (state, action: PayloadAction<ItemType | undefined>) => {
      state.editTTL = action.payload;
    },
    setQuery: (state, action: PayloadAction<Query>) => {
      state.query = action.payload;
    },
    addDocument: (state, action: PayloadAction<ItemType>) => {
      state.data = [action.payload, ...state.data];
      state.query.count = state.query.count + 1;
    },
    removeDocument: (state, action: PayloadAction<string[]>) => {
      state.data = state.data.filter(
        (doc) => !action.payload.includes(doc.key)
      );
      state.preview = undefined;
      state.query.count = state.query.count - action.payload.length;
    },
    setTerminal: (state, action: PayloadAction<boolean>) => {
      state.terminal.open = action.payload;
    },
    updateSTDOUT: (state, action: PayloadAction<string | string[]>) => {
      if (typeof action.payload === "string")
        state.terminal.stdout = [...state.terminal.stdout, action.payload];
      else
        state.terminal.stdout = [...state.terminal.stdout, ...action.payload];
    },
    clearSTDOUT: (state) => {
      state.terminal.stdout = [];
    },
    resetTerminal: (state) => {
      state.terminal.open = false;
      state.terminal.stdout = [
        "Bluedis Terminal (Beta)",
        "\u00a0",
        'This terminal is under tests still. Type "help" to check for commands or go to Help tab.',
        "\u00a0",
      ];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCount: (state, action: PayloadAction<number>) => {
      state.currentTotalDocs = action.payload;
    },
  },
});

export const actions = slice.actions;

export const store = configureStore({
  reducer: slice.reducer,
  middleware: [
    ...getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
  ],
});
