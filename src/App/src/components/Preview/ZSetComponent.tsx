import React from "react";
import AddOrderedItem from "./AddOrderedItem";
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

import { ReactComponent as CopyIcon } from "../../assets/clipboard.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash.svg";
import { ReactComponent as AddIcon } from "../../assets/plus.svg";

let timeout: number;

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
      <PreviewContainer>
        <PreviewTable>
          <tbody>
            <tr>
              <th align="center" style={{ width: "80px" }}>
                Score
              </th>
              <th>Value</th>
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
        <span>TTL: {ttl}</span>
      </div>
      <PreviewActions>
        <PreviewActionButton
          data-testid="item-add"
          title="Add new member"
          onClick={handleAddOpen}
        >
          <AddIcon />
        </PreviewActionButton>
        <PreviewActionButton
          data-testid="item-copy"
          title="Copy document as JSON"
          onClick={handleDocumentCopy}
        >
          <CopyIcon />
        </PreviewActionButton>
        <PreviewActionButton
          data-testid="item-remove"
          title="Remove document"
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
