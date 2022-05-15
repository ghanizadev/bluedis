import { Confirmation } from './Confirmation';
import { Connection } from './Connection';
import { Error } from './Error';
import { Item } from './Item';
import { Page } from './Page';
import { Settings } from './Settings';

export type State = {
  connected: boolean;
  isLoading: boolean;
  data: Item[];
  preview?: Item;
  editTTL?: Item;
  selected: string[];
  currentPage: Page,
  settings: Settings,
  connection?: Connection,
  favorites: Connection[],
  error?: Error,
  confirmation?: Confirmation,
  lastRefresh: Date,
  terminal: {
    open: boolean;
    stdout: string[]
  }
  query: {
    cursor: number;
    count: number;
    totalDocs: number
  }
};
