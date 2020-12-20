import React from "react";
import { ReactComponent as MenuIcon } from "../../assets/menu.svg";
import { Item } from "./Item";
import { Items } from "./Items";
import { Container } from "./OpenProps";

import { ReactComponent as DatabaseIcon } from "../../assets/database.svg";
import { ReactComponent as SettingsIcon } from "../../assets/settings.svg";
import { ReactComponent as HelpIcon } from "../../assets/help.svg";
import { useDispatch } from "react-redux";
import { Page } from "../../redux/Types/Page";
import { actions } from "../../redux/store";

const Sidebar = () => {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch()

  const handlePageChange = (page: Page) => {
    dispatch(actions.changePage(page));
  }

  return (
    <Container open={open}>
      <MenuIcon onClick={() => setOpen(!open)} />
      <Items open={open}>
        <Item onClick={() => handlePageChange("home")}>
          <DatabaseIcon />
          <span>Database</span>
        </Item>
        <Item onClick={() => handlePageChange("settings")}>
          <SettingsIcon />
          <span>Settings</span>
        </Item>
        <Item onClick={() => handlePageChange("help")}>
          <HelpIcon />
          <span>Help</span>
        </Item>
      </Items>
    </Container>
  );
};

export default Sidebar;
