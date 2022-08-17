import React from "react";

import { Item, ListType } from "../../redux/Types/Item";
import { PreviewContainer } from "../common/PreviewContainer";
import { PreviewTable } from "../common/PreviewTable";
import { PreviewTableRow } from "../common/PreviewTableRow";
import { PreviewTableData } from "../common/PreviewTableData";
import { t } from "../../i18n";

import AddListMember from "./AddListMember";
import { PreviewActions } from "./preview-actions";
import { parseConnectionString } from "../../shared/helpers/parse-connection-string.helper";
import { invoke } from "@tauri-apps/api";
import { FindKeyResponse } from "../../services/find-key-response.interface";
import { actions } from "../../redux/store";
import { parseKey } from "../../shared/helpers/parse-key.helper";
import { useDispatch, useSelector } from "react-redux";
import { Connection } from "../../redux/Types/Connection";
import { State } from "../../redux/Types/State";

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
  const connection = useSelector<State, Connection | undefined>(
    (state) => state.connection
  );
  const dispatch = useDispatch();

  const handleAddOpen = () => {
    setItemValue({ value: t`New value here...`, index: -1 });
  };
  const handleItemSubmit = async (value: string, index?: number) => {
    const cstr = parseConnectionString(connection!);

    let response = await invoke<FindKeyResponse>("alter_list", {
      cstr,
      action: "add_member",
      key,
      value,
      replace: index,
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

    dispatch(actions.setPreview(parseKey(data.key)));
    setItemValue(undefined);
  };

  const handleItemDelete = async (value: string, index: number) => {
    const cstr = parseConnectionString(connection!);
    let response = await invoke<FindKeyResponse>("alter_list", {
      cstr,
      action: "del_member",
      key,
      value,
      index,
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

    dispatch(actions.setPreview(parseKey(data.key)));
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
