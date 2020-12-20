import React from "react";
import styled from "styled-components";
import {
  addSetMember,
  deleteKey,
  removeSetMember,
} from "../../services/mainProcess";
import { Item } from "../../redux/Types/Item";
import { SquareButton } from "./SquareButton";
import AddSetMember from "./AddSetMember";

import { ReactComponent as AddIcon } from "../../assets/plus.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash.svg";
import { ReactComponent as CopyIcon } from "../../assets/clipboard.svg";

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
  margin-top: 10px;
`;

const ActionButton = styled(SquareButton)`
  margin: 8px 0 0 8px;
`;

const Row = styled.tr`
  cursor: pointer;
  overflow: hidden;

  &:hover {
    background-color: ${(props) => props.theme.foreground};
    color: ${(props) => props.theme.innertext};
  }
`;

let timeout: number;

type Props = {
  item: Item;
};
const SetComponent: React.FC<Props> = (props) => {
  const { value, key } = props.item;
  const [itemValue, setItemValue] = React.useState<{
    isNew: boolean;
    value: string;
  }>();
  const [deleting, setDeleting] = React.useState(false);

  const handleAddOpen = () => {
    setItemValue({ isNew: true, value: "New member here..." });
  };

  const handleItemSubmit = (oldValue: string, value: string) => {
    if (oldValue) removeSetMember(key, oldValue);

    addSetMember(key, value);
    setItemValue(undefined);
  };

  const handleItemClose = () => {
    setItemValue(undefined);
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

  const handleMemberDelete = (value: string) => {
    setItemValue(undefined);
    removeSetMember(key, value);
  };

  const handleMemberEdit = (item: string) => {
    setItemValue({ isNew: false, value: item });
  };

  return (
    <>
      <Container>
        <Table>
          <tbody>
            <tr>
              <th>Member</th>
            </tr>
            {(value as string[]).map((item, index) => {
              return (
                <Row onClick={() => handleMemberEdit(item)} key={index}>
                  <ItemData>{item}</ItemData>
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
      {!!itemValue && (
        <AddSetMember
          onDelete={handleMemberDelete}
          value={itemValue}
          onSubmit={handleItemSubmit}
          onClose={handleItemClose}
        />
      )}
    </>
  );
};

export default SetComponent;
