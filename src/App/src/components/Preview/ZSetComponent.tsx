import React from "react";
import styled from "styled-components";
import { SquareButton } from "./SquareButton";
import AddOrderedItem from "./AddOrderedItem";

import { ReactComponent as CopyIcon } from "../../assets/clipboard.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash.svg";
import { ReactComponent as AddIcon } from "../../assets/plus.svg";

import {
  addZSetMember,
  deleteKey,
  removeZSetMember,
} from "../../services/mainProcess";
import { Item } from "../../redux/Types/Item";

const Container = styled.div`
  flex: 1;
  background-color: ${(props) => props.theme.background};
  flex-basis: 0;
  overflow: hidden auto;
`;

const Table = styled.table`
  padding: 8px;
  border-spacing: 0;
  width: 100%;

  & td {
    height: 30px;
  }

  & th {
    position: sticky;
    top: 0;
    background-color: ${(props) => props.theme.background};
    height: 30px;
  }
`;

const Row = styled.tr`
  cursor: pointer;
  overflow: hidden;

  &:hover {
    background-color: ${(props) => props.theme.foreground};
    color: ${(props) => props.theme.innertext};
  }
`;

const Actions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const ActionButton = styled(SquareButton)`
  margin: 8px 0 0 8px;
`;

let timeout: number;

type Props = {
  item: Item;
};

const ZSetComponent: React.FC<Props> = (props) => {
  const { key, value } = props.item;

  const [itemValue, setItemValue] = React.useState<{
    score: string;
    value: string;
    isNew: boolean;
  }>();
  const [deleting, setDeleting] = React.useState(false);

  const handleAddOpen = () => {
    setItemValue({ isNew: true, score: "0", value: "New value here..." });
  };
  const handleItemSubmit = (
    oldValue: string,
    newValue: string,
    score: string
  ) => {
    if (oldValue) removeZSetMember(key, oldValue);

    addZSetMember(key, newValue, score);
    setItemValue(undefined);
  };

  const handleItemDelete = (item: { score: string; value: string }) => {
    removeZSetMember(key, item.value);
    setItemValue(undefined);
  };

  const handleItemClose = () => {
    setItemValue(undefined);
  };

  const handleItemEdit = (item: { score: string; value: string }) => {
    setItemValue({ isNew: false, ...item });
  };

  const handleDocumentCopy = () => {
    const text = JSON.stringify({ [key]: value });
    navigator.clipboard.writeText(text);
  };

  const handleDocumentDelete = () => {
    setDeleting(true);

    timeout = setTimeout(() => {
      setDeleting(false);
      deleteKey(key);
    }, 1000);
  };

  const handleDeleteCancel = () => {
    setDeleting(false);
    clearTimeout(timeout);
  };

  return (
    <>
      <Container>
        <Table>
          <tbody>
            <tr>
              <th align="center">Score</th>
              <th>Value</th>
            </tr>
            {(value as { score: string; value: string }[]).map(
              (item, index) => {
                return (
                  <Row key={index} onClick={() => handleItemEdit(item)}>
                    <td align="center">{item.score}</td>
                    <td>{item.value}</td>
                  </Row>
                );
              }
            )}
          </tbody>
        </Table>
      </Container>
      <Actions>
        <ActionButton title="Add new member" onClick={handleAddOpen}>
          <AddIcon />
        </ActionButton>
        <ActionButton
          title="Copy document as JSON"
          onClick={handleDocumentCopy}
        >
          <CopyIcon />
        </ActionButton>
        <ActionButton
          title="Remove document"
          remove
          action={deleting}
          onMouseUp={handleDeleteCancel}
          onMouseDown={handleDocumentDelete}
          onMouseLeave={handleDeleteCancel}
        >
          <RemoveIcon />
        </ActionButton>
      </Actions>
      {itemValue && (
        <AddOrderedItem
          onClose={handleItemClose}
          onSubmit={handleItemSubmit}
          onDelete={handleItemDelete}
          item={itemValue}
        />
      )}
    </>
  );
};

export default ZSetComponent;
