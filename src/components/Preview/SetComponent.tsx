import React from "react";

// import { alterKey, delKeyMember } from "../../services/main-process";
import { Item, SetType } from "../../redux/Types/Item";
import { PreviewContainer } from "../common/PreviewContainer";
import { PreviewTable } from "../common/PreviewTable";
import { PreviewTableRow } from "../common/PreviewTableRow";
import { PreviewTableData } from "../common/PreviewTableData";
import { t } from "../../i18n";

import AddSetMember from "./AddSetMember";
import { PreviewActions } from "./preview-actions";

type Props = {
  item: Item<SetType>;
};
const SetComponent: React.FC<Props> = (props) => {
  const { value, key, ttl } = props.item;
  const [itemValue, setItemValue] = React.useState<{
    isNew: boolean;
    value: string;
  }>();

  const handleAddOpen = () => {
    setItemValue({ isNew: true, value: "New member here..." });
  };

  const handleItemSubmit = (value: string) => {
    if (!itemValue) return;

    // alterKey(key, [value], {
    //   oldValue: itemValue.isNew ? null : itemValue.value,
    // });

    setItemValue(undefined);
  };

  const handleItemClose = () => {
    setItemValue(undefined);
  };

  const handleMemberDelete = (value: string) => {
    setItemValue(undefined);
    // delKeyMember(key, value);
  };

  const handleMemberEdit = (item: string) => {
    setItemValue({ isNew: false, value: item });
  };

  return (
    <>
      <PreviewContainer data-testid={"set-preview"}>
        <PreviewTable>
          <tbody>
            <tr>
              <th>{t`Member`}</th>
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
      <span data-testid={"set-ttl"}>
        {ttl !== -1 &&
          t`TTL: ${new Date(ttl).toLocaleString(navigator.language, {
            timeZoneName: "short",
          })}`}
      </span>
      <PreviewActions
        item={props.item}
        onAddClick={handleAddOpen}
        data-testid={"set-actions"}
      />
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
