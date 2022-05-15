import React from "react";
import styled from "styled-components";

import { changeString, deleteKey } from "../../services/mainProcess";
import { Item } from "../../redux/Types/Item";

import { ReactComponent as TTLIcon } from "../../assets/clock.svg";
import { ReactComponent as CopyIcon } from "../../assets/clipboard.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash.svg";
import { ReactComponent as SaveIcon } from "../../assets/save.svg";
import { PreviewActionButton } from "../common/PreviewActionButton";
import { PreviewActions } from "../common/PreviewActions";
import { useDispatch } from "react-redux";
import { actions } from "../../redux/store";

const Container = styled.textarea`
  resize: none;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  flex: 1;
`;

let timeout: any;
let saveTimeout: any;

type Props = {
  item: Item;
};
const StringComponent: React.FC<Props> = (props) => {
  const { key, value, ttl } = props.item;
  const [itemValue, setItemValue] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const dispatch = useDispatch();

  const handleDocumentSave = () => {
    changeString(key, itemValue);
    clearTimeout(saveTimeout);
    setSaved(true);

    saveTimeout = setTimeout(() => {
      setSaved(false);
    }, 3000);
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
      deleteKey([key]);
      setDeleting(false);
    }, 1000);
  };

  const handleCancelDelete = () => {
    setDeleting(false);
    clearTimeout(timeout);
  };

  const handleTTLOpen = () => {
    dispatch(actions.setEditTTL(props.item));
  };

  return (
    <>
      <Container onChange={handleValueChange} defaultValue={value} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {saved && (
          <span
            style={{
              alignSelf: "flex-start",
              whiteSpace: "nowrap",
            }}
          >
            Document saved!
          </span>
        )}
      <div>
        <span>
          {ttl !== -1 &&
            `TTL: ${new Date(ttl).toLocaleString(navigator.language, { timeZoneName: "short" })}`}
        </span>
      </div>
        <PreviewActions>
          <PreviewActionButton
            title="Save document"
            onClick={handleDocumentSave}
            data-testid="item-save"
          >
            <SaveIcon />
          </PreviewActionButton>
          <PreviewActionButton
            data-testid="item-copy"
            title="Copy document as JSON"
            onClick={handleDocumentCopy}
          >
            <CopyIcon />
          </PreviewActionButton>
          <PreviewActionButton
          data-testid="item-ttl"
          title="Edit TTL"
          onClick={handleTTLOpen}
        >
          <TTLIcon />
        </PreviewActionButton>
          <PreviewActionButton
            data-testid="item-remove"
            title="Remove document"
            remove
            inAction={deleting}
            onMouseDown={handleDocumentDelete}
            onMouseLeave={handleCancelDelete}
            onMouseUp={handleCancelDelete}
          >
            <RemoveIcon />
          </PreviewActionButton>
        </PreviewActions>
      </div>
    </>
  );
};

export default StringComponent;
