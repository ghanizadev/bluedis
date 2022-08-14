import React from "react";
import { useDispatch, useSelector } from "react-redux";

import DatabaseIcon from "../../assets/Database";
import SettingsIcon from "../../assets/Settings";
import HelpIcon from "../../assets/Help";
import  MenuIcon from "../../assets/Menu";
import { Page } from "../../redux/Types/Page";
import { actions } from "../../redux/store";
import { t } from "../../i18n";
import { State } from "../../redux/Types/State";

import { Container } from "./OpenProps";
import { Items } from "./Items";
import { Item } from "./Item";

const Sidebar = () => {
  const [open, setOpen] = React.useState(false);
  const page = useSelector<State, Page>((state) => state.currentPage);
  const dispatch = useDispatch();

  const handlePageChange = (page: Page) => {
    dispatch(actions.changePage(page));
  };

  return (
    <Container data-testid="menu-sidebar" open={open}>
      <MenuIcon data-testid="menu-button" onClick={() => setOpen(!open)} />
      <Items open={open}>
        <Item
          data-testid={"menu-database"}
          data-selected={page === "database"}
          onClick={() => handlePageChange("database")}
        >
          <DatabaseIcon />
          <span>{t`Database`}</span>
        </Item>
        <Item
          data-testid={"menu-settings"}
          data-selected={page === "settings"}
          onClick={() => handlePageChange("settings")}
        >
          <SettingsIcon />
          <span>{t`Settings`}</span>
        </Item>
        <Item
          data-testid={"menu-help"}
          data-selected={page === "help"}
          onClick={() => handlePageChange("help")}
        >
          <HelpIcon />
          <span>{t`Help`}</span>
        </Item>
      </Items>
    </Container>
  );
};

export default Sidebar;
