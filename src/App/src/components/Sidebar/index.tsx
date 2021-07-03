import React from "react";
import { ReactComponent as MenuIcon } from "../../assets/menu.svg";
import { Item } from "./Item";
import { Items } from "./Items";
import { Container } from "./Container";

import { ReactComponent as DatabaseIcon } from "../../assets/database.svg";
import { ReactComponent as SettingsIcon } from "../../assets/settings.svg";
import { ReactComponent as HelpIcon } from "../../assets/help.svg";
import {useDispatch, useSelector} from "react-redux";
import { Page } from "../../redux/Types/Page";
import { actions } from "../../redux/store";
import {State} from "../../redux/Types/State";

const Sidebar = () => {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch()
  const translation = useSelector<State, {[key: string]: any}>((state) => state.settings.translation);
  const page = useSelector<State, Page>((state) => state.currentPage);

  const handlePageChange = (page: Page) => {
    dispatch(actions.changePage(page));
  }

  return (
    <Container data-testid="menu-sidebar" open={open}>
      <MenuIcon data-testid="menu-button" onClick={() => setOpen(!open)} />
      <Items open={open}>
        <Item onClick={() => handlePageChange("home")} data-active={page === 'home'}>
          <DatabaseIcon />
          <span>{translation.database}</span>
        </Item>
        <Item onClick={() => handlePageChange("settings")} data-active={page === 'settings'}>
          <SettingsIcon />
          <span>{translation.settings}</span>
        </Item>
        <Item onClick={() => handlePageChange("help")} data-active={page === 'help'}>
          <HelpIcon />
          <span>{translation.help}</span>
        </Item>
      </Items>
    </Container>
  );
};

export default Sidebar;
