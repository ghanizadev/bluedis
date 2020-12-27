import React from "react";
import styled from "styled-components";
import { Item } from "../../redux/Types/Item";

import { Container } from "./Container";
import { Header } from "./Header";
import { Data } from "./Data";
import { Type } from "./Type";
import Checkbox from "../Checkbox";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../../redux/store";
import { State } from "../../redux/Types/State";

const Row = styled.tr``;

const TableContainer = styled.table`
  margin: 0 8px;
  flex: 1;
  border-spacing: 0;

  & th {
    position: sticky;
    top: 0;
  }
`;

type Props = {
  data: Item[];
  onItemEdit?: (item: Item) => void;
};

const Table: React.FC<Props> = (props) => {
  const { data, onItemEdit } = props;
  const selected = useSelector<State, string[]>((state) => state.selected);
  const dispatch = useDispatch();

  const handleItemEdit = (item: Item) => {
    onItemEdit && onItemEdit(item);
  };

  const handleSelect = (key: string, opts?: { all?: boolean }) => {
    if (opts?.all) {
      dispatch(actions.selectAll());
      return;
    }
    if (selected.includes(key)) dispatch(actions.removeSelected(key));
    else dispatch(actions.pushSelected(key));
  };

  return (
    <Container data-testid="home-table">
      <TableContainer>
        <tbody>
          <Row data-testid="home-table-header">
            <Header style={{ width: "40px" }}>
              <Checkbox
                checked={data.every((item) => selected.includes(item.key))}
                onChangeValue={() => handleSelect("", { all: true })}
              />
            </Header>
            <Header style={{ width: "100px" }}>Type</Header>
            <Header>Key</Header>
          </Row>
          {data.map((item, index) => {
            return (
              <Row key={index} data-testid="item-table-row">
                <Data
                  style={{
                    minWidth: "50px",
                    width: "5%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Checkbox
                    checked={selected.includes(item.key)}
                    onChangeValue={() => handleSelect(item.key)}
                  />
                </Data>
                <Data align="center" style={{ width: "20%" }}>
                  <Type>{item.type}</Type>
                </Data>
                <Data
                  style={{ width: "75%" }}
                  title="Click to view"
                  onClick={() => handleItemEdit(item)}
                >
                  <span>{item.key}</span>
                </Data>
              </Row>
            );
          })}
        </tbody>
      </TableContainer>
    </Container>
  );
};

export default Table;
