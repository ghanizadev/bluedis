import React, { useRef } from "react";
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

  const fontSizeRef = useRef<HTMLInputElement>(null);

  const saveChanges = () => {
    const settings = store.getState().settings;
    savePreferences(settings);
  }

  const handleDarkModeChange = () => {
    dispatch(
      actions.changeAppearance({
        ...settings.appearance,
        darkTheme: !settings.appearance.darkTheme,
      })
    );

    saveChanges();
  };

  const handleFontFamilyChange = (value: string) => {
    dispatch(
      actions.changeAppearance({
        ...settings.appearance,
        fontFamily: value as any,
      })
    );
    saveChanges();
  };

  const changeFont = () => {
    if(!fontSizeRef.current) return;

    const value = fontSizeRef.current.value.match(/\d+/)?.join("");

    dispatch(
      actions.changeAppearance({
        ...settings.appearance,
        fontSize: `${value}pt`,
      })
    );
    saveChanges();
  }

  const handleFontSizeChange = () => {
    changeFont();
  };

  const handleFontSizeChangeOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter") changeFont();
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
              checked={settings.appearance.darkTheme}
              onChange={handleDarkModeChange}
            />
          </span>
        </Row>
        <Row>
          <span>Font</span>
          <span>
            <Dropdown defaultValue={settings.appearance.fontFamily} onChange={handleFontFamilyChange} items={["Roboto", "JetBrains Mono", "Montserrat", "Open Sans"]} />
          </span>
        </Row>
        <Row>
          <span>Font size</span>
          <span>
            <Input
              ref={fontSizeRef}
              type="text"
              style={{ width: "100px", textAlign: "right" }}
              defaultValue={settings.appearance.fontSize}
              onBlur={handleFontSizeChange}
              onKeyDown={handleFontSizeChangeOnEnter}
            />
          </span>
        </Row>
        <Subtitle>Data</Subtitle>
        <Row>
          <span>Clear preferences</span>
          <span>
            <Button label="Wipe data" onClick={handleWipeData} />
          </span>
        </Row>
        {
        /**
         * Maximum DB default 5
         * Language preferences
         * fetch data => load step = 10
         * date format
         */
         }
      </Content>
    </Container>
  );
};

export default Settings;
