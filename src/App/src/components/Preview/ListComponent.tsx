import React from "react";
import AddListMember from "./AddListMember";
import { Item } from "../../redux/Types/Item";
import { PreviewActionButton } from "../common/PreviewActionButton";
import { PreviewActions } from "../common/PreviewActions";
import { PreviewContainer } from "../common/PreviewContainer";
import { PreviewTable } from "../common/PreviewTable";
import { PreviewTableRow } from "../common/PreviewTableRow";
import { PreviewTableData } from "../common/PreviewTableData";
import {
  addListMember,
  alterListMember,
  deleteKey,
  removeListMember,
} from "../../services/mainProcess";

import { ReactComponent as CopyIcon } from "../../assets/clipboard.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash.svg";
import { ReactComponent as AddIcon } from "../../assets/plus.svg";
import { ReactComponent as TTLIcon } from "../../assets/clock.svg";
import {useDispatch, useSelector} from "react-redux";
import { actions } from "../../redux/store";
import {State} from "../../redux/Types/State";

let timeout: number;

type Props = {
  item: Item;
};
const ListComponent: React.FC<Props> = (props) => {
  const {
    item: { key, value, ttl },
  } = props;
  const [itemValue, setItemValue] = React.useState<{
    value: string;
    index: number;
  }>();
  const [deleting, setDeleting] = React.useState(false);
  const translation = useSelector<State, {[key: string]: string}>(state => state.settings.translation);

  const dispatch = useDispatch();

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
      deleteKey([key]);
    }, 1000);
  };

  const handleTTLOpen = () => {
    dispatch(actions.setEditTTL(props.item));
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
              <th style={{ width: "80px" }}>{translation.index}</th>
              <th>{translation.value}</th>
            </tr>
            {value.map((item: string, index: number) => {
              return (
                <PreviewTableRow
                  onClick={() => handleItemEdit(item, index)}
                  key={index}
                >
                  <td style={{ width: "80px" }} align="center">
                    {index}
                  </td>
                  <PreviewTableData>{item}</PreviewTableData>
                </PreviewTableRow>
              );
            })}
          </tbody>
        </PreviewTable>
      </PreviewContainer>
      <span>
        {ttl !== -1 &&
          `TTL: ${new Date(ttl).toLocaleString(navigator.language, {
            timeZoneName: "short",
          })}`}
      </span>
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
          title={translation.removedoc}
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
