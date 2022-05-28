import React from "react";

import { Item, ZSetType } from "../../redux/Types/Item";
import { PreviewContainer } from "../common/PreviewContainer";
import { PreviewTable } from "../common/PreviewTable";
import { PreviewTableRow } from "../common/PreviewTableRow";
import { PreviewTableData } from "../common/PreviewTableData";
import { alterKey, delKeyMember } from "../../services/mainProcess";
import { t } from "../../i18n";

import AddOrderedItem from "./AddOrderedItem";
import { PreviewActions } from "./preview-actions";

type Props = {
  item: Item<ZSetType>;
};

const ZSetComponent: React.FC<Props> = (props) => {
  const { key, value, ttl } = props.item;

  const [itemValue, setItemValue] = React.useState<{
    isNew?: boolean;
    score: string;
    value: string;
  }>();

  const handleItemSubmit = (
    oldValue: string,
    newValue: string,
    score: string
  ) => {
    alterKey(key, [{ score, value: newValue }], { oldValue });
    setItemValue(undefined);
  };

  const handleItemDelete = (item: { score: string; value: string }) => {
    delKeyMember(key, item.value);
    setItemValue(undefined);
  };

  const handleItemClose = () => {
    setItemValue(undefined);
  };

  const handleItemEdit = (item: { score: string; value: string }) => {
    setItemValue({ isNew: false, ...item });
  };

  const handleItemAdd = () => {
    setItemValue({ isNew: true, score: "0", value: t`New sorted item...` });
  };

  return (
    <>
      <PreviewContainer data-testid={"zset-preview"}>
        <PreviewTable>
          <tbody>
            <tr>
              <th align="center" style={{ width: "80px" }}>
                {t`Score`}
              </th>
              <th>{t`Value`}</th>
            </tr>
            {value.map((item, index) => {
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
            })}
          </tbody>
        </PreviewTable>
      </PreviewContainer>
      <span data-testid={"zset-ttl"}>
        {ttl !== -1 &&
          t`TTL: ${new Date(ttl).toLocaleString(navigator.language, {
            timeZoneName: "short",
          })}`}
      </span>
      <PreviewActions
        data-testid={"zset-actions"}
        item={props.item}
        onAddClick={handleItemAdd}
      />
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
