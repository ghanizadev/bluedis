import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Dropbox from "../../components/Dropbox";
import Input from "../../components/Input";
import Toggle from "../../components/Toggle";
import { State } from "../../redux/Types/State";
import { Settings as ISettings } from "../../redux/Types/Settings";
import { actions, store } from "../../redux/store";
import { savePreferences } from "../../services/mainProcess";
import Button from "../../components/Button";

const Container = styled.div`
  padding: 8px;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  flex-basis: 0;
  overflow: hidden auto;
  display: flex;
  flex-direction: column;
  margin: 8px 0;
`;
const Row = styled.div`
  flex: 0 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  margin: 5px 0 5px 8px;
`;

const Subtitle = styled.h3`
  margin-top: 8px;
  margin-bottom: 3px;
`;

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
            <Dropbox defaultValue={settings.appearence.fontFamily} onChange={handleFontFamilyChange} items={["Roboto", "JetBrains Mono", "Montserrat", "Open Sans"]} />
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
            <Button label="Wipe now" />
          </span>
        </Row>
      </Content>
    </Container>
  );
};

export default Settings;
