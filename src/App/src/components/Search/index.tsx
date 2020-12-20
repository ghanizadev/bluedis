import React from "react";
import styled from "styled-components";
import Button from "../Button";
import Dropbox from "../Dropbox";
import Input from "../Input";

import {find, selectDatabase} from "../../services/mainProcess";

const Container = styled.div`
  width: 100%;
  margin: 0 8px 5px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchInput = styled(Input)`
  flex: 1;
`;

const Search = () => {
  const [match, setMatch] = React.useState<string>();
  const databases = [
    {value: 0, name: "DB 0"},
    {value: 1, name: "DB 1"},
    {value: 2, name: "DB 2"},
    {value: 3, name: "DB 3"},
    {value: 4, name: "DB 4"},
    {value: 5, name: "DB 5"},
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.value) setMatch(e.target.value);
  }

  const handleKeyListener = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter"){
      find(match || "");
    }
  }

  const handleSearch = () => {
    find(match || "");
  }

  const handleDatabaseChange = (item: string) => {
    const value = databases.find(db => db.name === item)?.value;
    if(typeof value === "number") selectDatabase(value);
  }

  return (
    <Container>
      <span>Search:</span>
      <SearchInput onChange={handleChange} onKeyDown={handleKeyListener}/>
      <Dropbox items={databases.map(db => db.name)} onChange={handleDatabaseChange} />
      <Button label="Apply" onClick={handleSearch}/>
    </Container>
  );
};

export default Search;
