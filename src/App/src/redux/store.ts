import {
  createSlice,
  configureStore,
  getDefaultMiddleware,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Appearence } from "./Types/Appearence";
import { Confirmation } from "./Types/Confirmation";
import { Connection } from "./Types/Connection";
import { Error } from "./Types/Error";
import { Item } from "./Types/Item";
import { Page } from "./Types/Page";
import { State } from "./Types/State";

const initialState: State = {
  data: [],
  selected: [],
  currentPage: "home",
  settings: {
    appearence: {
      darkTheme: false,
      fontFamily: "Roboto",
      fontSize: "14pt",
    },
    general: {
      maxDB: 6,
      stepSize: 10,
    },
    region: {
      language: "en-US",
      dateFormat: "system"
    },
    license: "teste"
  },
  terminal: {
    open: false,
    stdout: [
      "Bluedis Terminal",
      "\u00a0",
      "Type \"help\" to check for commands or go to Help tab.",
      "\u00a0",
    ],
  },
  connected: false,
  favorites: [],
  lastRefresh: new Date(),
  query: { cursor: 0, count: 0, totalDocs: 0 }
};

const slice = createSlice({
  name: "store",
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    setData: (state, action: PayloadAction<Item[]>) => {
      state.lastRefresh = new Date();
      state.data = action.payload;
    },
    pushData: (state, action: PayloadAction<Item[]>) => {
      state.lastRefresh = new Date();
      state.data = [...state.data, ...action.payload];
    },
    setPreview: (state, action: PayloadAction<Item | undefined>) => {
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
    changeAppearence: (state, action: PayloadAction<Appearence>) => {
      state.settings.appearence = action.payload;
    },
    updatePreferences: (state, action) => {
      state.settings = {...state.settings, ...action.payload};
    },
    currentConnection: (state, action: PayloadAction<Connection>) => {
      state.connection = action.payload;
    },
    addFavorite: (state, action: PayloadAction<Connection>) => {
      const newFavorites = [...state.favorites, action.payload];
      state.favorites = newFavorites;
    },
    updateFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      const newFavorites = state.favorites.filter(
        (favorite) => favorite.id !== action.payload
      );
      state.favorites = newFavorites;
    },
    updateLicense: (state, action: PayloadAction<string>) => {
      state.settings.license = action.payload;
    },
    setError: (state, action: PayloadAction<Error | undefined>) => {
      state.error = action.payload;
    },
    setConfirmation: (state, action: PayloadAction<Confirmation | undefined>) => {
      state.confirmation = action.payload;
    },
    setEditTTL: (state, action: PayloadAction<Item | undefined>) => {
      state.editTTL = action.payload;
    },
    setQuery: (state, action: PayloadAction<{ cursor: number, count: number, totalDocs?: number}>) => {
      state.query = {...action.payload, totalDocs: action.payload.totalDocs ?? state.query.totalDocs };
    },
    addDocument:(state, action: PayloadAction<Item>)=>{
      state.data = [action.payload, ...state.data];
      state.query.totalDocs = state.query.totalDocs + 1;
    },
    removeDocument:(state, action: PayloadAction<string[]>)=>{
      state.data = state.data.filter(doc => !action.payload.includes(doc.key));
      state.preview = undefined;
      state.query.totalDocs = state.query.totalDocs - action.payload.length;
    },
    setTerminal:(state, action: PayloadAction<boolean>)=>{
      state.terminal.open = action.payload;
    },
    updateSTDOUT:(state, action: PayloadAction<string>)=>{
      state.terminal.stdout = [...state.terminal.stdout, action.payload];
    },
    clearSTDOUT:(state)=>{
      state.terminal.stdout = [];
    }
  },
});

export const actions = slice.actions;

export const store = configureStore({
  reducer: slice.reducer,
  middleware: [...getDefaultMiddleware({ immutableCheck: false, serializableCheck: false })],
});
