import React, { useCallback } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import Checkbox from "../Checkbox";
import { ItemType } from "../../redux/Types/Item";
import { actions } from "../../redux/store";
import { State } from "../../redux/Types/State";
import { loadMore } from "../../services/mainProcess";
import { Query } from "../../redux/Types/Query";
import { t } from "../../i18n";
import { useLoading } from "../../shared/hooks/use-loading.hook";

import { Type } from "./Type";
import { Data } from "./Data";
import { Header } from "./Header";
import { Container } from "./Container";

const Row = styled.tr`
  height: 32px;
  max-height: 32px;
`;

const TableContainer = styled.table`
  margin: 0 8px;
  border-spacing: 0;
  border-collapse: collapse;

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
  data: ItemType[];
  onItemEdit?: (item: ItemType) => void;
};

const Table: React.FC<Props> = (props) => {
  const { data, onItemEdit } = props;
  const dispatch = useDispatch();

  const loading = useLoading();
  const selected = useSelector<State, string[]>((state) => state.selected);
  const query = useSelector<State, Query>((state) => state.query);
  const currentCount = useSelector<State, number>((state) => state.data.length);

  const handleItemEdit = (item: ItemType) => {
    loading(true);
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

  const handleLoadMore = useCallback(() => {
    loadMore(query.input, query.cursor);
  }, [query]);

  return (
    <Container data-testid={"database-table-container"}>
      <TableContainer>
        <tbody>
          <Row data-testid={"database-table-header"}>
            <Header style={{ width: "40px" }}>
              <Checkbox
                data-testid={"database-table-select-all"}
                checked={
                  data.length !== 0 &&
                  data.every((item) => selected.includes(item.key))
                }
                onChangeValue={() => handleSelect("", { all: true })}
              />
            </Header>
            <Header style={{ width: "100px" }}>{t`Type`}</Header>
            <Header>{t`Key`}</Header>
          </Row>
          {data.map((item, index) => {
            return (
              <Row key={index} data-testid="database-table-item">
                <Data
                  style={{
                    minWidth: "50px",
                    width: "5%",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Checkbox
                      data-testid={"database-table-item-checkbox"}
                      checked={selected.includes(item.key)}
                      onChangeValue={() => handleSelect(item.key)}
                    />
                  </div>
                </Data>
                <Data
                  data-testid={"database-table-item-type"}
                  align="center"
                  style={{ width: "15%" }}
                >
                  <Type>{item.type}</Type>
                </Data>
                <Data
                  data-testid={"database-table-item-key"}
                  style={{ width: "75%" }}
                  title={t`Click to view`}
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
          {query.done && t`showing all ${currentCount} keys`}
          {!query.done && t`showing ${currentCount} keys - `}
          {query.cursor !== 0 && (
            <button
              disabled={query.cursor === 0}
              onClick={handleLoadMore}
              data-testid={"database-table-load-more"}
            >
              {t`load more`}
            </button>
          )}
        </span>
      </LoadMore>
    </Container>
  );
};

export default Table;
