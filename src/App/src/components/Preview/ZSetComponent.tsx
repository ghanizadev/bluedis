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

import { ReactComponent as TTLIcon } from "../../assets/clock.svg";
import { ReactComponent as CopyIcon } from "../../assets/clipboard.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash.svg";
import { ReactComponent as AddIcon } from "../../assets/plus.svg";
import {useDispatch, useSelector} from "react-redux";
import { actions } from "../../redux/store";
import {State} from "../../redux/Types/State";

let timeout: number;

type Props = {
  item: Item;
};

const ZSetComponent: React.FC<Props> = (props) => {
  const { key, value, ttl } = props.item;
  const translation = useSelector<State, {[key: string]: string}>(state => state.settings.translation);

  const [itemValue, setItemValue] = React.useState<{
    score: string;
    value: string;
    isNew: boolean;
  }>();
  const [deleting, setDeleting] = React.useState(false);

  const dispatch = useDispatch();
  
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
                {translation.score}
              </th>
              <th>{translation.value}</th>
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
            `TTL: ${new Date(ttl).toLocaleString(navigator.language, { timeZoneName: "short" })}`}
        </span>
      </div>
      <PreviewActions>
        <PreviewActionButton
          data-testid="item-add"
          title={translation.addmember}
          onClick={handleAddOpen}
        >
          <AddIcon />
        </PreviewActionButton>
        <PreviewActionButton
          data-testid="item-copy"
          title={translation.copydoc}
          onClick={handleDocumentCopy}
        >
          <CopyIcon />
        </PreviewActionButton>
        <PreviewActionButton
          data-testid="item-ttl"
          title={translation.setttl}
          onClick={handleTTLOpen}
        >
          <TTLIcon />
        </PreviewActionButton>
        <PreviewActionButton
          data-testid="item-remove"
          title={translation.removedoc}
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
