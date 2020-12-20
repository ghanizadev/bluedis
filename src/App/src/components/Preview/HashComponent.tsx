import React from "react";
import styled from "styled-components";
import AddHashItem from "./AddHashItem";
import { SquareButton } from "./SquareButton";
import {
  addHashMember,
  removeHashMember,
  deleteKey,
} from "../../services/mainProcess";
import { Item } from "../../redux/Types/Item";

import { ReactComponent as AddIcon } from "../../assets/plus.svg";
import { ReactComponent as CopyIcon } from "../../assets/clipboard.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash.svg";

const Container = styled.div`
  flex: 1;
  background-color: ${(props) => props.theme.background};
  flex-basis: 0;
  overflow: auto;
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

const ItemData = styled.td`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 0;
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
const HashComponent: React.FC<Props> = (props) => {
  const { key, value } = props.item;
  const [itemValue, setItemValue] = React.useState<{
    key: string;
    value: string;
    new: boolean;
  }>();

  const [deleting, setDeleting] = React.useState(false);

  const handleAddOpen = () => {
    setItemValue({ key: "", value: "", new: true });
  };
  const handleItemSubmit = (item: { key: string; value: string }) => {
    addHashMember(key, { [item.key]: item.value });
    setItemValue(undefined);
  };

  const handleItemDelete = (item: { key: string; value: string }) => {
    removeHashMember(key, item.key);
    setItemValue(undefined);
  };

  const handleItemClose = () => {
    setItemValue(undefined);
  };

  const handleItemEdit = (item: { key: string; value: string }) => {
    setItemValue({ ...item, new: false });
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
              <th>Key</th>
              <th>Value</th>
            </tr>
            {Object.keys(value).map((key, index) => {
              return (
                <Row
                  key={index}
                  onClick={() => handleItemEdit({ key, value: value[key] })}
                >
                  <ItemData>{key}</ItemData>
                  <ItemData>{value[key]}</ItemData>
                </Row>
              );
            })}
          </tbody>
        </Table>
      </Container>
      <Actions>
        <ActionButton title="Add Item" onClick={handleAddOpen}>
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
        <AddHashItem
          newItem={itemValue.new}
          onClose={handleItemClose}
          onSubmit={handleItemSubmit}
          onDelete={handleItemDelete}
          item={itemValue}
        />
      )}
    </>
  );
};

export default HashComponent;
