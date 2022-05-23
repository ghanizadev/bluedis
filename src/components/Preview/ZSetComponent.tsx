import React from "react";
import { useDispatch } from "react-redux";

import { Item } from "../../redux/Types/Item";
import { PreviewContainer } from "../common/PreviewContainer";
import { PreviewActions } from "../common/PreviewActions";
import { PreviewActionButton } from "../common/PreviewActionButton";
import { PreviewTable } from "../common/PreviewTable";
import { PreviewTableRow } from "../common/PreviewTableRow";
import { PreviewTableData } from "../common/PreviewTableData";
import {
  addZSetMember,
  deleteKey,
  removeZSetMember,
} from "../../services/mainProcess";
import { ReactComponent as TTLIcon } from "../../assets/clock.svg";
import { ReactComponent as CopyIcon } from "../../assets/clipboard.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash.svg";
import { ReactComponent as AddIcon } from "../../assets/plus.svg";
import { actions } from "../../redux/store";
import { t } from "../../i18n";

import AddOrderedItem from "./AddOrderedItem";

let timeout: NodeJS.Timeout;

type Props = {
  item: Item;
};

const ZSetComponent: React.FC<Props> = (props) => {
  const { key, value, ttl } = props.item;

  const [itemValue, setItemValue] = React.useState<{
    score: string;
    value: string;
    isNew: boolean;
  }>();
  const [deleting, setDeleting] = React.useState(false);

  const dispatch = useDispatch();

  const handleAddOpen = () => {
    setItemValue({ isNew: true, score: "0", value: t`New value here...` });
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
      deleteKey([key]);
    }, 1000);
  };

  const handleDeleteCancel = () => {
    setDeleting(false);
    clearTimeout(timeout);
  };

  const handleTTLOpen = () => {
    dispatch(actions.setEditTTL(props.item));
  };

  return (
    <>
      <PreviewContainer>
        <PreviewTable>
          <tbody>
            <tr>
              <th align="center" style={{ width: "80px" }}>
                {t`Score`}
              </th>
              <th>{t`Value`}</th>
            </tr>
            {(value as { score: string; value: string }[]).map(
              (item, index) => {
                return (
                  <PreviewTableRow
                    key={index}
                    onClick={() => handleItemEdit(item)}
                  >
                    <td style={{ width: "80px" }} align="center">
                      {item.score}
                    </td>
                    <PreviewTableData>{item.value}</PreviewTableData>
                  </PreviewTableRow>
                );
              }
            )}
          </tbody>
        </PreviewTable>
      </PreviewContainer>
      <div>
        <span>
          {ttl !== -1 &&
            t`TTL: ${new Date(ttl).toLocaleString(navigator.language, {
              timeZoneName: "short",
            })}`}
        </span>
      </div>
      <PreviewActions>
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
          data-testid="item-remove"
          title={t`Remove key`}
          remove
          inAction={deleting}
          onMouseUp={handleDeleteCancel}
          onMouseDown={handleDocumentDelete}
          onMouseLeave={handleDeleteCancel}
        >
          <RemoveIcon />
        </PreviewActionButton>
      </PreviewActions>
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
