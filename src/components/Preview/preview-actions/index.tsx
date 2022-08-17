import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";

import { PreviewActionButton } from "../../common/PreviewActionButton";
import { t } from "../../../i18n";
import AddIcon from "../../../assets/Plus";
import CopyIcon from "../../../assets/Clipboard";
import TTLIcon from "../../../assets/Clock";
import RemoveIcon from "../../../assets/Trash";
import SaveIcon from "../../../assets/Save";
import { ItemType } from "../../../redux/Types/Item";
import { actions } from "../../../redux/store";

import { Container } from "./container";
import { invoke } from "@tauri-apps/api";
import { parseConnectionString } from "../../../shared/helpers/parse-connection-string.helper";
import { Connection } from "../../../redux/Types/Connection";
import { State } from "../../../redux/Types/State";

let timeout: NodeJS.Timeout;

export interface PreviewActionsProps {
  item: ItemType;
  onAddClick?: () => void;
  onSaveClick?: () => void;
  "data-testid"?: string;
}

export const PreviewActions: FC<PreviewActionsProps> = (props) => {
  const { item, onAddClick, onSaveClick } = props;

  const connection = useSelector<State, Connection | undefined>(
    (state) => state.connection
  );
  const [deleting, setDeleting] = React.useState(false);
  const dispatch = useDispatch();

  const handleDocumentCopy = async () => {
    const text = JSON.stringify({ [item.key]: item.value });
    await navigator.clipboard.writeText(text);
  };

  const handleDocumentDelete = () => {
    setDeleting(true);

    timeout = setTimeout(async () => {
      await invoke("rm_keys", {
        cstr: parseConnectionString(connection!),
        keys: [item.key],
      });
      dispatch(actions.setPreview());
      setDeleting(false);
    }, 1000);
  };

  const handleDeleteCancel = () => {
    setDeleting(false);
    clearTimeout(timeout);
  };

  const handleAddOpen = () => {
    onAddClick && onAddClick();
  };

  const handleItemSave = () => {
    onSaveClick && onSaveClick();
  };

  const handleTTLOpen = () => {
    dispatch(actions.setEditTTL(props.item));
  };

  return (
    <Container
      data-testid={props["data-testid"] ?? "preview-actions-container"}
    >
      {onAddClick && (
        <PreviewActionButton
          data-testid="item-add"
          title={t`Add new member`}
          onClick={handleAddOpen}
        >
          <AddIcon />
        </PreviewActionButton>
      )}
      {onSaveClick && (
        <PreviewActionButton
          title={t`Save key`}
          onClick={handleItemSave}
          data-testid="item-save"
        >
          <SaveIcon />
        </PreviewActionButton>
      )}
      <PreviewActionButton
        data-testid="item-copy"
        title={t`Copy key as JSON`}
        onClick={handleDocumentCopy}
      >
        <CopyIcon />
      </PreviewActionButton>
      <PreviewActionButton
        data-testid="item-ttl"
        title={t`Edit TTL`}
        onClick={handleTTLOpen}
      >
        <TTLIcon />
      </PreviewActionButton>
      <PreviewActionButton
        title={t`Remove key`}
        data-testid="item-remove"
        remove
        inAction={deleting}
        onMouseUp={handleDeleteCancel}
        onMouseDown={handleDocumentDelete}
        onMouseLeave={handleDeleteCancel}
      >
        <RemoveIcon />
      </PreviewActionButton>
    </Container>
  );
};
