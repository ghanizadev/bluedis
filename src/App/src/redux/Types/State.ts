import { Item } from './Item';
import { Page } from './Page';
import { Settings } from './Settings';

export type State = {
  connected: boolean;
  data: Item[];
  preview?: Item;
  selected: string[];
  currentPage: Page,
  settings: Settings
};
