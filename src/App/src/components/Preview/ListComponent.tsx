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

let timeout: number;

type Props = {
  item: Item;
};
const ListComponent: React.FC<Props> = (props) => {
  const {
    item: { key, value },
  } = props;
  const [itemValue, setItemValue] = React.useState<{
    value: string;
    index: number;
  }>();
  const [deleting, setDeleting] = React.useState(false);

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
              <th style={{ width: "80px" }}>Index</th>
              <th>Value</th>
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
      <PreviewActions>
        <PreviewActionButton data-testid="item-add" title="Add new member" onClick={handleAddOpen}>
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
