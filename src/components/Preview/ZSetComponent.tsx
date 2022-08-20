import React from "react";

import { Item, ZSetType } from "../../redux/Types/Item";
import { PreviewContainer } from "../common/PreviewContainer";
import { PreviewTable } from "../common/PreviewTable";
import { PreviewTableRow } from "../common/PreviewTableRow";
import { PreviewTableData } from "../common/PreviewTableData";
import { t } from "../../i18n";

import AddOrderedItem from "./AddOrderedItem";
import { PreviewActions } from "./preview-actions";
import { invoke } from "@tauri-apps/api";
import { parseConnectionString } from "../../shared/helpers/parse-connection-string.helper";
import { useDispatch, useSelector } from "react-redux";
import { Connection } from "../../redux/Types/Connection";
import { State } from "../../redux/Types/State";
import { actions } from "../../redux/store";
import { parseKey } from "../../shared/helpers/parse-key.helper";
import { FindKeyResponse } from "../../services/find-key-response.interface";

type Props = {
  item: Item<ZSetType>;
};

const ZSetComponent: React.FC<Props> = (props) => {
  const { key, value, ttl } = props.item;
  const dispatch = useDispatch();
  const connection = useSelector<State, Connection | undefined>(
    (state) => state.connection
  );

  const [itemValue, setItemValue] = React.useState<{
    isNew?: boolean;
    score: string;
    value: string;
  }>();

  const handleItemSubmit = async (
    oldValue: string,
    newValue: string,
    score: string
  ) => {
    const cstr = parseConnectionString(connection!);
    let response = await invoke<FindKeyResponse>("alter_zset", {
      cstr,
      action: "add_member",
      key,
      value: { score: +score, value: newValue },
      oldValue,
    });

    if (response.Error) {
      dispatch(
          actions.setError({
            title: "Error",
            message: response.Error,
          })
      );

      return;
    }

    let data = response.Response!.Single!;
    dispatch(actions.setPreview(data.key ? parseKey(data.key) : undefined));

    setItemValue(undefined);
  };

  const handleItemDelete = async (item: { score: string; value: string }) => {
    const cstr = parseConnectionString(connection!);
    let response = await invoke<FindKeyResponse>("alter_zset", {
      cstr,
      action: "del_member",
      key,
      oldValue: item.value,
    });

    if (response.Error) {
      dispatch(
        actions.setError({
          title: "Error",
          message: response.Error,
        })
      );

      return;
    }

    let data = response.Response!.Single!;
    dispatch(actions.setPreview(data.key ? parseKey(data.key) : undefined));

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
