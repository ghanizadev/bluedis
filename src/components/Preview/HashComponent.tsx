import React from "react";

import { PreviewContainer } from "../common/PreviewContainer";
import { PreviewTable } from "../common/PreviewTable";
import { PreviewTableData } from "../common/PreviewTableData";
import { PreviewTableRow } from "../common/PreviewTableRow";
import { Item } from "../../redux/Types/Item";
import { addHashMember, removeHashMember } from "../../services/mainProcess";
import { t } from "../../i18n";

import AddHashItem from "./AddHashItem";
import { PreviewActions } from "./preview-actions";

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

  return (
    <>
      <PreviewContainer data-testid={"hash-preview"}>
        <PreviewTable>
          <tbody>
            <tr>
              <th>{t`Key`}</th>
              <th>{t`Value`}</th>
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
      <span data-testid={"hash-ttl"}>
        {ttl !== -1 &&
          t`TTL: ${new Date(ttl).toLocaleString(navigator.language, {
            timeZoneName: "short",
          })}`}
      </span>
      <PreviewActions
        data-testid={"hash-actions"}
        item={props.item}
        onAddClick={handleAddOpen}
      />
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
