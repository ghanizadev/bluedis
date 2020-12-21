import {
  createSlice,
  configureStore,
  getDefaultMiddleware,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Appearence } from "./Types/Appearence";
import { Connection } from "./Types/Connection";
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
  },
  connected: false,
  favorites: []
};

const slice = createSlice({
  name: "store",
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    setData: (state, action: PayloadAction<Item[]>) => {
      state.data = action.payload;
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
      state.settings = action.payload;
    },
    currentConnection: (state, action: PayloadAction<Connection>) => {
      state.connection = action.payload;
    },
    addFavorite: (state, action: PayloadAction<Connection>) => {
      state.favorites = [...state.favorites, action.payload];
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(favorite => favorite.id !== action.payload);
    }
  },
});

export const actions = slice.actions;

export const store = configureStore({
  reducer: slice.reducer,
  middleware: [...getDefaultMiddleware({ immutableCheck: false })],
});