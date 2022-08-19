import React from "react";
import styled from "styled-components";

import Button from "../Button";
import Dropdown from "../Dropdown";
import { t } from "../../i18n";
import { InputAlt } from "../Input";
import { invoke } from "@tauri-apps/api";
import { parseConnectionString } from "../../shared/helpers/parse-connection-string.helper";
import { useDispatch, useSelector } from "react-redux";
import { Connection } from "../../redux/Types/Connection";
import { State } from "../../redux/Types/State";
import { actions } from "../../redux/store";
import services from "../../services";

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
  const databases = Array.apply(null, Array(16)).map((_, index) => ({
    value: index,
    name: index === 0 ? "Default" : "DB #" + index,
  }));
  const connection = useSelector<State, Connection | undefined>(
    (state) => state.connection
  );
  const isSearching = useSelector<State, boolean>((state) => state.isSearching);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMatch(e.target.value ?? "*");
  };
  const dispatch = useDispatch();

  const search = async () => {
    if (!isSearching) {
      dispatch(actions.setSearching(true));
      dispatch(actions.setData([]));

      await invoke("search", {
        cstr: parseConnectionString(connection!),
        pattern: match ?? "*",
        cursor: 0,
      });

      dispatch(actions.setSearching(false));
    } else {
      await invoke("stop_query");
      dispatch(actions.setSearching(false));
    }
  };

  const handleKeyListener = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      await search();
    }
  };

  const handleSearch = async () => {
    await search();
  };

  const handleDatabaseChange = async (item: string) => {
    const db = databases.find((db) => db.name === item);
    dispatch(actions.setLoading(true));

    await invoke("select_db", {
      cstr: parseConnectionString(connection!),
      dbIndex: db?.value ?? 0,
    });

    await services.findKeys();
    dispatch(actions.setSearching(false));
  };

  return (
    <Container data-testid={"search-container"}>
      <span>{t`Search`}:</span>
      <SearchInput
        data-testid={"search-input"}
        onChange={handleChange}
        onKeyDown={handleKeyListener}
        disabled={isSearching}
      />
      <Dropdown
        data-testid={"search-dropdown"}
        items={databases.map((db) => db.name)}
        onChange={handleDatabaseChange}
      />
      <Button
        data-testid={"search-button"}
        label={isSearching ? t`Cancel` : t`Apply`}
        onClick={handleSearch}
      />
    </Container>
  );
};

export default Search;
