import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import Dropdown from "../../components/Dropdown";
import { Input } from "../../components/Input";
import Toggle from "../../components/Toggle";
import { State } from "../../redux/Types/State";
import { Settings as ISettings } from "../../redux/Types/Settings";
import { actions, store } from "../../redux/store";
// import { savePreferences, wipeData } from "../../services/main-process";
import Button from "../../components/Button";
import { DarkTheme, LightTheme } from "../../theme";
import { t } from "../../i18n";
import { AppearanceFont } from "../../redux/Types/Appearance";

import { Container } from "./Container";
import { Content } from "./Content";
import { Row } from "./Row";
import { Subtitle } from "./Subtitle";
import { FONTS, LANGUAGES } from "./settings.constants";

const Settings = () => {
  const settings = useSelector<State, ISettings>((state) => state.settings);
  const dispatch = useDispatch();

  const fontSizeRef = useRef<HTMLInputElement>(null);

  const saveChanges = () => {
    const settings = store.getState().settings;
    // savePreferences(settings);
  };

  const handleDarkModeChange = () => {
    const darkTheme = !settings.appearance.darkTheme;

    dispatch(
      actions.changeAppearance({
        ...settings.appearance,
        ...(darkTheme ? DarkTheme : LightTheme),
        darkTheme,
      })
    );

    saveChanges();
  };

  const handleLanguageChange = (value: string) => {
    const language = LANGUAGES.find((l) => l.label === value)?.value;

    if (language === undefined) return;

    dispatch(
      actions.changeRegion({
        ...settings.region,
        language,
      })
    );
    saveChanges();
  };

  const handleFontFamilyChange = (value: string) => {
    dispatch(
      actions.changeAppearance({
        ...settings.appearance,
        fontFamily: value as AppearanceFont,
      })
    );
    saveChanges();
  };

  const changeFont = () => {
    if (!fontSizeRef.current) return;

    const value = fontSizeRef.current.value.match(/\d+/)?.join("");

    dispatch(
      actions.changeAppearance({
        ...settings.appearance,
        fontSize: `${value}pt`,
      })
    );
    saveChanges();
  };

  const handleFontSizeChange = () => {
    changeFont();
  };

  const handleFontSizeChangeOnEnter = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") changeFont();
  };

  const handleWipeData = () => {
    dispatch(
      actions.setConfirmation({
        title: t`Confirmation`,
        message: t`Do you really want to wipe all stored data? This includes all your preferences and favorites`,
        onConfirm: () => {
          // wipeData();
        },
      })
    );
  };

  return (
    <Container>
      <h1>{t`Settings`}</h1>
      <Content>
        <Subtitle>{t`Region`}</Subtitle>
        <Row>
          <span>{t`Language`}</span>
          <span>
            <Dropdown
              defaultIndex={settings.region.language}
              onChange={handleLanguageChange}
              items={LANGUAGES.map(({ label }) => label)}
            />
          </span>
        </Row>
        <Subtitle>{t`Appearance`}</Subtitle>
        <Row>
          <span>{t`Dark mode`}</span>
          <span>
            <Toggle
              checked={settings.appearance.darkTheme}
              onChange={handleDarkModeChange}
            />
          </span>
        </Row>
        <Row>
          <span>{t`Font`}</span>
          <span>
            <Dropdown
              defaultValue={settings.appearance.fontFamily}
              onChange={handleFontFamilyChange}
              items={FONTS}
            />
          </span>
        </Row>
        <Row>
          <span>{t`Font size`}</span>
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
        <Subtitle>{t`Data`}</Subtitle>
        <Row>
          <span>{t`Clear preferences`}</span>
          <span>
            <Button label={t`Wipe data`} onClick={handleWipeData} />
          </span>
        </Row>
        {/**
         * Set DB: quantity and name
         * fetch data => load step = 10
         */}
      </Content>
    </Container>
  );
};

export default Settings;
