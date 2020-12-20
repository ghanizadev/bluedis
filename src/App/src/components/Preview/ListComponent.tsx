import React from "react";
import styled from "styled-components";
import { SquareButton } from "./SquareButton";
import AddListMember from "./AddListMember";
import { Item } from "../../redux/Types/Item";
import {
  addListMember,
  alterListMember,
  deleteKey,
  removeListMember,
} from "../../services/mainProcess";

import { ReactComponent as CopyIcon } from "../../assets/clipboard.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash.svg";
import { ReactComponent as AddIcon } from "../../assets/plus.svg";

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

const ItemData = styled.td`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
const ListComponent: React.FC<Props> = (props) => {
  const {
    item: { key, value },
  } = props;
  const [itemValue, setItemValue] = React.useState<{
    value: string;
    index: number;
  }>();
  const [deleting, setDeleting] = React.useState(false);

  const handleAddOpen = () => {
    setItemValue({ value: "New value here...", index: -1 });
  };
  const handleItemSubmit = (value: string, index: number) => {
    if (index === -1) addListMember(key, value);
    else alterListMember(key, value, index);

    setItemValue(undefined);
  };

  const handleItemDelete = (value: string, index: number) => {
    removeListMember(key, index);
    setItemValue(undefined);
  };

  const handleItemClose = () => {
    setItemValue(undefined);
  };

  const handleItemEdit = (value: string, index: number) => {
    setItemValue({ value, index });
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
              <th>Index</th>
              <th>Value</th>
            </tr>
            {value.map((item: string, index: number) => {
              return (
                <Row onClick={() => handleItemEdit(item, index)} key={index}>
                  <td align="center">{index}</td>
                  <ItemData>{item}</ItemData>
                </Row>
              );
            })}
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
      {!!itemValue && (
        <AddListMember
          value={itemValue}
          onSubmit={handleItemSubmit}
          onDelete={handleItemDelete}
          onClose={handleItemClose}
        />
      )}
    </>
  );
};

export default ListComponent;
