import { Confirmation } from "./Confirmation";
import { Connection } from "./Connection";
import { Error } from "./Error";
import { ItemType } from "./Item";
import { Page } from "./Page";
import { Settings } from "./Settings";
import { Query } from "./Query";

export type State = {
  connected: boolean;
  isLoading: boolean;
  isSearching: boolean;
  data: ItemType[];
  preview?: ItemType;
  editTTL?: ItemType;
  selected: string[];
  currentPage: Page;
  settings: Settings;
  connection?: Connection;
  favorites: Connection[];
  error?: Error;
  confirmation?: Confirmation;
  lastRefresh: Date;
  currentTotalDocs: number; //TODO remove this thing here, for god sake
  terminal: {
    open: boolean;
    stdout: string[];
  };
  query: Query;
};
