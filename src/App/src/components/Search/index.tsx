import React from "react";
import styled from "styled-components";
import Button from "../Button";
import Dropdown from "../Dropdown";
import Input from "../Input";

import { find, selectDatabase } from "../../services/mainProcess";
import {useSelector} from "react-redux";
import {State} from "../../redux/Types/State";

const Container = styled.div`
  margin: 0 8px 5px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 1;
`;

const SearchInput = styled(Input)`
  flex: 1;
`;

const Search = () => {
  const [match, setMatch] = React.useState<string>();
  const translation = useSelector<State, {[key: string]: any}>(state => state.settings.translation)
  const databases = [
    { value: 0, name: "DB 0" },
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
      console.log(match || "*");
      find(match || "*");
    }
  };

  const handleSearch = () => {
    find(match || "*");
  };

  const handleDatabaseChange = (item: string) => {
    const value = databases.find((db) => db.name === item)?.value;
    if (typeof value === "number") selectDatabase(value);
  };

  return (
    <Container>
      <span>{translation.search}:</span>
      <SearchInput onChange={handleChange} onKeyDown={handleKeyListener} />
      <Dropdown
        items={databases.map((db) => db.name)}
        onChange={handleDatabaseChange}
      />
      <Button label={translation.apply} onClick={handleSearch} />
    </Container>
  );
};

export default Search;
