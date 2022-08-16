import React from "react";
import styled from "styled-components";

import Button from "../Button";
import Dropdown from "../Dropdown";
import { t } from "../../i18n";
import { InputAlt } from "../Input";
import {invoke} from "@tauri-apps/api";
import {parseConnectionString} from "../../shared/helpers/parse-connection-string.helper";
import {useSelector} from "react-redux";
import {Connection} from "../../redux/Types/Connection";
import {State} from "../../redux/Types/State";
import {emit} from "@tauri-apps/api/event";

const Container = styled.div`
  margin: 0 8px 5px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 1;
`;

const SearchInput = styled(InputAlt)`
  flex: 1;
`;

const Search = () => {
  const [match, setMatch] = React.useState<string>();
  const databases = [
    { value: 0, name: "default" },
    { value: 1, name: "DB 1" },
    { value: 2, name: "DB 2" },
    { value: 3, name: "DB 3" },
    { value: 4, name: "DB 4" },
    { value: 5, name: "DB 5" },
  ];
  const connection = useSelector<State, Connection | undefined>(state => state.connection);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMatch(e.target.value ?? "*");
  };

  const handleKeyListener = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await emit('find-keys', { cstr: parseConnectionString(connection!), pattern: match ?? '*', cursor: 0 });
    }
  };

  const handleSearch = async () => {
    await emit('find-keys', { cstr: parseConnectionString(connection!), pattern: match ?? '*', cursor: 0 });
  };

  const handleDatabaseChange = async (item: string) => {
    const db = databases.find((db) => db.name === item);
    await invoke('select_db', { cstr: parseConnectionString(connection!), dbIndex: db });
  };

  return (
    <Container data-testid={"search-container"}>
      <span>{t`Search`}:</span>
      <SearchInput
        data-testid={"search-input"}
        onChange={handleChange}
        onKeyDown={handleKeyListener}
      />
      <Dropdown
        data-testid={"search-dropdown"}
        items={databases.map((db) => db.name)}
        onChange={handleDatabaseChange}
      />
      <Button
        data-testid={"search-button"}
        label={t`Apply`}
        onClick={handleSearch}
      />
    </Container>
  );
};

export default Search;
