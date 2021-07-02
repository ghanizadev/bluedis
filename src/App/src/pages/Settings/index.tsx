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
import { Language } from "../../i18n/languages";

const Settings = () => {
  const settings = useSelector<State, ISettings>((state) => state.settings);
  const translation = useSelector<State, {[key: string]: any}>(state => state.settings.translation)
  const dispatch = useDispatch();

  const fontSizeRef = useRef<HTMLInputElement>(null);

  const saveChanges = () => {
    const settings = store.getState().settings;
    savePreferences(settings);
  }
  
  React.useEffect(() => {
    saveChanges()
  }, [settings])

  const handleDarkModeChange = () => {
    dispatch(
      actions.changeAppearence({
        ...settings.appearance,
        darkTheme: !settings.appearance.darkTheme,
      })
    );

    // saveChanges();
  };

  const handleFontFamilyChange = (value: string) => {
    dispatch(
      actions.changeAppearence({
        ...settings.appearance,
        fontFamily: value as any,
      })
    );
    // saveChanges();
  };

  const changeFont = () => {
    if(!fontSizeRef.current) return;

    const value = fontSizeRef.current.value.match(/\d+/)?.join("");

    dispatch(
      actions.changeAppearence({
        ...settings.appearance,
        fontSize: `${value}pt`,
      })
    );
    // saveChanges();
  }

  const handleFontSizeChange = () => {
    changeFont();
  };

  const handleFontSizeChangeOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter") changeFont();
  };

  const handleWipeData = () => {
    dispatch(actions.setConfirmation({
      title: translation.confirmation,
      message: translation.wipeconfirm,
      onConfirm: () => {
        wipeData();
      }
    }))
  }
  
  const handleLanguageChange = (value: string) => {
    dispatch(actions.setLanguage((Language as any)[value]))
    // saveChanges();
  }

  return (
    <Container>
      <h1>{translation.settings}</h1>
      <Content>
        <Subtitle>{translation.appearance}</Subtitle>
        <Row>
          <span>{translation.darkmode}</span>
          <span>
            <Toggle
              checked={settings.appearance.darkTheme}
              onChange={handleDarkModeChange}
            />
          </span>
        </Row>
        <Row>
          <span>{translation.font}</span>
          <span>
            <Dropdown defaultValue={settings.appearance.fontFamily} onChange={handleFontFamilyChange} items={["Roboto", "JetBrains Mono", "Montserrat", "Open Sans"]} />
          </span>
        </Row>
        <Row>
          <span>{translation.fontsize}</span>
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
        <Subtitle>{translation.data}</Subtitle>
        <Row>
          <span>{translation.clearpref}</span>
          <span>
            <Button label={translation.wipedata} onClick={handleWipeData} />
          </span>
        </Row>
        <Row>
          <span>{translation.language}</span>
          <span>
            <Dropdown defaultValue={Object.keys(Language).find(key => (Language as any)[key] === settings.language)} onChange={handleLanguageChange} items={Object.keys(Language)} />
          </span>
        </Row>
        {
        /**
         * Maximum DB default 5
         * fetch data => load step = 10
         * date format
         */
         }
      </Content>
    </Container>
  );
};

export default Settings;
