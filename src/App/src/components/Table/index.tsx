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
import { loadMore } from "../../services/mainProcess";

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

const LoadMore = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 8px;

  & button {
    background-color: transparent;
    color: ${({ theme }) => theme.foreground};
    border: none;
    text-decoration: underline;
    cursor: pointer;

    &:disabled {
      color: gray;
    }
  }
`;

type Props = {
  data: Item[];
  onItemEdit?: (item: Item) => void;
};

const Table: React.FC<Props> = (props) => {
  const { data, onItemEdit } = props;
  const selected = useSelector<State, string[]>((state) => state.selected);
  const translation = useSelector<State, {[key: string]: string}>((state) => state.settings.translation);
  const query = useSelector<State, { count: number; cursor: number }>(
    (state) => state.query
  );
  const dispatch = useDispatch();
  const totalCount = useSelector<State, number>(
    (state) => state.query.totalDocs
  );
  const currentCount = useSelector<State, number>((state) => state.data.length);

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

  const handleLoadMore = () => {
    loadMore("*", query.cursor, query.count);
  };

  return (
    <Container data-testid="home-table">
      <TableContainer>
        <tbody>
          <Row data-testid="home-table-header">
            <Header style={{ width: "40px" }}>
              <Checkbox
                checked={data.length !== 0 && data.every((item) => selected.includes(item.key))}
                onChangeValue={() => handleSelect("", { all: true })}
              />
            </Header>
            <Header style={{ width: "100px" }}>{translation.type}</Header>
            <Header>{translation.key}</Header>
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
                  title={translation.clicktoview}
                  onClick={() => handleItemEdit(item)}
                >
                  <span>{item.key}</span>
                </Data>
              </Row>
            );
          })}
        </tbody>
      </TableContainer>
      <LoadMore>
        <span>
          {/*showing {currentCount} of {totalCount} documents*/}
          {translation.totaldocs.replace('{{c}}', currentCount.toString()).replace('{{t}}', totalCount.toString())}
          {query.cursor !== 0 && " - "}
          {query.cursor !== 0 && (
            <button disabled={query.cursor === 0} onClick={handleLoadMore}>
              {translation.loadmore} ...
            </button>
          )}
        </span>
      </LoadMore>
    </Container>
  );
};

export default Table;
