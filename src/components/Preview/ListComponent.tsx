import React from "react";

import { Item, ListType } from "../../redux/Types/Item";
import { PreviewContainer } from "../common/PreviewContainer";
import { PreviewTable } from "../common/PreviewTable";
import { PreviewTableRow } from "../common/PreviewTableRow";
import { PreviewTableData } from "../common/PreviewTableData";
import {
  addListMember,
  alterListMember,
  removeListMember,
} from "../../services/mainProcess";
import { t } from "../../i18n";

import AddListMember from "./AddListMember";
import { PreviewActions } from "./preview-actions";

type Props = {
  item: Item<ListType>;
};
const ListComponent: React.FC<Props> = (props) => {
  const {
    item: { key, value, ttl },
  } = props;
  const [itemValue, setItemValue] = React.useState<{
    value: string;
    index: number;
  }>();

  const handleAddOpen = () => {
    setItemValue({ value: t`New value here...`, index: -1 });
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

  return (
    <>
      <PreviewContainer data-testid={"list-preview"}>
        <PreviewTable>
          <tbody>
            <tr>
              <th style={{ width: "80px" }}>{t`Index`}</th>
              <th>{t`Value`}</th>
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
      <span data-testid={"list-ttl"}>
        {ttl !== -1 &&
          t`TTL: ${new Date(ttl).toLocaleString(navigator.language, {
            timeZoneName: "short",
          })}`}
      </span>
      <PreviewActions
        data-testid={"list-actions"}
        item={props.item}
        onAddClick={handleAddOpen}
      />
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
