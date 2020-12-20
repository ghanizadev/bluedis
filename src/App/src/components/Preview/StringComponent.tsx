import React from "react";
import styled from "styled-components";

import { changeString, deleteKey } from "../../services/mainProcess";
import { Item } from "../../redux/Types/Item";
import { SquareButton } from "./SquareButton";

import { ReactComponent as CopyIcon } from "../../assets/clipboard.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash.svg";
import { ReactComponent as SaveIcon } from "../../assets/save.svg";

const Container = styled.textarea`
  resize: none;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  flex: 1;
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
let saveTimeout : number;

type Props = {
  item: Item;
};
const StringComponent: React.FC<Props> = (props) => {
  const { key, value } = props.item;
  const [itemValue, setItemValue] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const handleDocumentSave = () => {
    changeString(key, itemValue);
    clearTimeout(saveTimeout);
    setSaved(true);

    saveTimeout = setTimeout(() => {
      setSaved(false)
    }, 3000)
  };

  const handleDocumentCopy = () => {
    const text = JSON.stringify({ [key]: value });
    navigator.clipboard.writeText(text);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setItemValue(e.target.value);
  };

  const handleDocumentDelete = () => {
    setDeleting(true);
    timeout = setTimeout(() => {
      deleteKey(key);
      setDeleting(false);
    }, 1000);
  };

  const handleCancelDelete = () => {
    setDeleting(false);
    clearTimeout(timeout);
  };

  return (
    <>
      <Container onChange={handleValueChange}>{value}</Container>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {saved && <span
          style={{
            alignSelf: "flex-start",
            whiteSpace: "nowrap",
          }}
        >
          Document saved!
        </span>}
        <Actions>
          <ActionButton title="Save document" onClick={handleDocumentSave}>
            <SaveIcon />
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
            onMouseDown={handleDocumentDelete}
            onMouseLeave={handleCancelDelete}
            onMouseUp={handleCancelDelete}
          >
            <RemoveIcon />
          </ActionButton>
        </Actions>
      </div>
    </>
  );
};

export default StringComponent;
