import React from "react";
import styled from "styled-components";

import Button from "../Button";
import Dropdown from "../Dropdown";
import { find, selectDatabase } from "../../services/mainProcess";
import { t } from "../../i18n";
import { InputAlt } from "../Input";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMatch(e.target.value ?? "*");
  };

  const handleKeyListener = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      find(match || "*", 0);
    }
  };

  const handleSearch = () => {
    find(match || "*", 0);
  };

  const handleDatabaseChange = (item: string) => {
    const db = databases.find((db) => db.name === item);

    if (db) selectDatabase(db.value);
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
