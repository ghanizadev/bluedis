import React from "react";
import {
  addSetMember,
  deleteKey,
  removeSetMember,
} from "../../services/mainProcess";
import { Item } from "../../redux/Types/Item";
import AddSetMember from "./AddSetMember";

import { ReactComponent as AddIcon } from "../../assets/plus.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash.svg";
import { ReactComponent as CopyIcon } from "../../assets/clipboard.svg";
import { ReactComponent as TTLIcon } from "../../assets/clock.svg";
import { PreviewActionButton } from "../common/PreviewActionButton";
import { PreviewActions } from "../common/PreviewActions";
import { PreviewContainer } from "../common/PreviewContainer";
import { PreviewTable } from "../common/PreviewTable";
import { PreviewTableRow } from "../common/PreviewTableRow";
import { PreviewTableData } from "../common/PreviewTableData";
import { useDispatch } from "react-redux";
import { actions } from "../../redux/store";

let timeout: number;

type Props = {
  item: Item;
};
const SetComponent: React.FC<Props> = (props) => {
  const { value, key, ttl } = props.item;
  const [itemValue, setItemValue] = React.useState<{
    isNew: boolean;
    value: string;
  }>();
  const [deleting, setDeleting] = React.useState(false);

  const dispatch = useDispatch();
  
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
      deleteKey([key]);
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

  const handleTTLOpen = () => {
    dispatch(actions.setEditTTL(props.item));
  };

  return (
    <>
      <PreviewContainer>
        <PreviewTable>
          <tbody>
            <tr>
              <th>Member</th>
            </tr>
            {(value as string[]).map((item, index) => {
              return (
                <PreviewTableRow
                  onClick={() => handleMemberEdit(item)}
                  key={index}
                >
                  <PreviewTableData>{item}</PreviewTableData>
                </PreviewTableRow>
              );
            })}
          </tbody>
        </PreviewTable>
      </PreviewContainer>
      <div>
        <span>
          {ttl !== -1 &&
            `TTL: ${new Date(ttl!).toLocaleString(navigator.language, { timeZoneName: "short" })}`}
        </span>
      </div>
      <PreviewActions>
        <PreviewActionButton
          data-testid="item-add"
          title="Add Item"
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
          data-testid="item-ttl"
          title="Edit TTL"
          onClick={handleTTLOpen}
        >
          <TTLIcon />
        </PreviewActionButton>
        <PreviewActionButton
          title="Remove document"
          data-testid="item-remove"
          remove
          inAction={deleting}
          onMouseUp={handleDeleteCancel}
          onMouseDown={handleDocumentDelete}
          onMouseLeave={handleDeleteCancel}
        >
          <RemoveIcon />
        </PreviewActionButton>
      </PreviewActions>
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
