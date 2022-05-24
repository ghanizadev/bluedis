import React, { FC } from "react";
import { useDispatch } from "react-redux";

import { PreviewActionButton } from "../../common/PreviewActionButton";
import { t } from "../../../i18n";
import { ReactComponent as AddIcon } from "../../../assets/plus.svg";
import { ReactComponent as CopyIcon } from "../../../assets/clipboard.svg";
import { ReactComponent as TTLIcon } from "../../../assets/clock.svg";
import { ReactComponent as RemoveIcon } from "../../../assets/trash.svg";
import { deleteKey } from "../../../services/mainProcess";
import { Item } from "../../../redux/Types/Item";
import { actions } from "../../../redux/store";

import { Container } from "./container";

let timeout: NodeJS.Timeout;

export interface PreviewActionsProps {
  item: Item;
  onAddClick: () => void;
  "data-testid"?: string;
}

export const PreviewActions: FC<PreviewActionsProps> = (props) => {
  const { item, onAddClick } = props;

  const [deleting, setDeleting] = React.useState(false);
  const dispatch = useDispatch();

  const handleDocumentCopy = () => {
    const text = JSON.stringify({ [item.key]: item.value });
    navigator.clipboard.writeText(text);
  };

  const handleDocumentDelete = () => {
    setDeleting(true);

    timeout = setTimeout(() => {
      setDeleting(false);
      deleteKey([item.key]);
    }, 1000);
  };

  const handleDeleteCancel = () => {
    setDeleting(false);
    clearTimeout(timeout);
  };

  const handleAddOpen = () => {
    onAddClick();
  };

  const handleTTLOpen = () => {
    dispatch(actions.setEditTTL(props.item));
  };

  return (
    <Container
      data-testid={props["data-testid"] ?? "preview-actions-container"}
    >
      <PreviewActionButton
        data-testid="item-add"
        title={t`Add new member`}
        onClick={handleAddOpen}
      >
        <AddIcon />
      </PreviewActionButton>
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
