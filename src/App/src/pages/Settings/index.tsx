import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "../../components/Dropdown";
import Input from "../../components/Input";
import Toggle from "../../components/Toggle";
import { State } from "../../redux/Types/State";
import { Settings as ISettings } from "../../redux/Types/Settings";
import { actions, store } from "../../redux/store";
import { savePreferences, wipeData } from "../../services/mainProcess";
import Button from "../../components/Button";
import { Container } from "./Container";
import { Content } from "./Content";
import { Row } from "./Row";
import { Subtitle } from "./Subtitle";

const Settings = () => {
  const settings = useSelector<State, ISettings>((state) => state.settings);
  const dispatch = useDispatch();

  const saveChanges = () => {
    const settings = store.getState().settings;
    savePreferences(settings);
  }

  const handleDarkModeChange = () => {
    dispatch(
      actions.changeAppearence({
        ...settings.appearence,
        darkTheme: !settings.appearence.darkTheme,
      })
    );

    saveChanges();
  };

  const handleFontFamilyChange = (value: string) => {
    dispatch(
      actions.changeAppearence({
        ...settings.appearence,
        fontFamily: value as any,
      })
    );
    saveChanges();
  };

  const handleFontSizeChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.match(/\d+/)?.join("");

    dispatch(
      actions.changeAppearence({
        ...settings.appearence,
        fontSize: `${value}pt`,
      })
    );
    saveChanges();
  };

  const handleWipeData = () => {
    dispatch(actions.setConfirmation({
      title: "Confirmation",
      message: "Do you really want to wipe all stored data? This includes all your preferences and favorites",
      onConfirm: () => {
        wipeData();
      }
    }))
  }

  return (
    <Container>
      <h1>Settings</h1>
      <Content>
        <Subtitle>Appearence</Subtitle>
        <Row>
          <span>Dark mode</span>
          <span>
            <Toggle
              checked={settings.appearence.darkTheme}
              onChange={handleDarkModeChange}
            />
          </span>
        </Row>
        <Row>
          <span>Font</span>
          <span>
            <Dropdown defaultValue={settings.appearence.fontFamily} onChange={handleFontFamilyChange} items={["Roboto", "JetBrains Mono", "Montserrat", "Open Sans"]} />
          </span>
        </Row>
        <Row>
          <span>Font size</span>
          <span>
            <Input
              style={{ width: "100px", textAlign: "right" }}
              defaultValue={settings.appearence.fontSize}
              onBlur={handleFontSizeChange}
            />
          </span>
        </Row>
        <Subtitle>Data</Subtitle>
        <Row>
          <span>Wipe data</span>
          <span>
            <Button label="Wipe now" onClick={handleWipeData} />
          </span>
        </Row>
      </Content>
    </Container>
  );
};

export default Settings;
