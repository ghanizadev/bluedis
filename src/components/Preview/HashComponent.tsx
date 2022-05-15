import React from "react";
import AddHashItem from "./AddHashItem";
import { PreviewActionButton } from "../common/PreviewActionButton";
import { PreviewActions } from "../common/PreviewActions";
import { PreviewContainer } from "../common/PreviewContainer";
import { PreviewTable } from "../common/PreviewTable";
import { PreviewTableData } from "../common/PreviewTableData";
import { PreviewTableRow } from "../common/PreviewTableRow";
import { Item } from "../../redux/Types/Item";
import {
  addHashMember,
  removeHashMember,
  deleteKey,
} from "../../services/mainProcess";

import { ReactComponent as AddIcon } from "../../assets/plus.svg";
import { ReactComponent as CopyIcon } from "../../assets/clipboard.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash.svg";
import { ReactComponent as TTLIcon } from "../../assets/clock.svg";
import { useDispatch } from "react-redux";
import { actions } from "../../redux/store";

let timeout: any;

type Props = {
  item: Item;
};
const HashComponent: React.FC<Props> = (props) => {
  const { key, value, ttl } = props.item;
  const [itemValue, setItemValue] = React.useState<{
    key: string;
    value: string;
    new: boolean;
  }>();

  const dispatch = useDispatch();

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
              <th>Key</th>
              <th>Value</th>
            </tr>
            {Object.keys(value).map((key, index) => {
              return (
                <PreviewTableRow
                  key={index}
                  onClick={() => handleItemEdit({ key, value: value[key] })}
                >
                  <PreviewTableData>{key}</PreviewTableData>
                  <PreviewTableData>{value[key]}</PreviewTableData>
                </PreviewTableRow>
              );
            })}
          </tbody>
        </PreviewTable>
      </PreviewContainer>
      <div>
        <span>
          {ttl !== -1 &&
            `TTL: ${new Date(ttl).toLocaleString(navigator.language, { timeZoneName: "short" })}`}
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
