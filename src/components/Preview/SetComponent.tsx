import React from "react";

import { Item, SetType } from "../../redux/Types/Item";
import { PreviewContainer } from "../common/PreviewContainer";
import { PreviewTable } from "../common/PreviewTable";
import { PreviewTableRow } from "../common/PreviewTableRow";
import { PreviewTableData } from "../common/PreviewTableData";
import { t } from "../../i18n";

import AddSetMember from "./AddSetMember";
import { PreviewActions } from "./preview-actions";
import { invoke } from "@tauri-apps/api";
import { useDispatch, useSelector } from "react-redux";
import { Connection } from "../../redux/Types/Connection";
import { State } from "../../redux/Types/State";
import { parseConnectionString } from "../../shared/helpers/parse-connection-string.helper";
import { actions } from "../../redux/store";
import { parseKey } from "../../shared/helpers/parse-key.helper";
import { FindKeyResponse } from "../../services/find-key-response.interface";

type Props = {
  item: Item<SetType>;
};
const SetComponent: React.FC<Props> = (props) => {
  const { value, key, ttl } = props.item;
  const dispatch = useDispatch();
  const [itemValue, setItemValue] = React.useState<{
    isNew: boolean;
    value: string;
  }>();
  const connection = useSelector<State, Connection | undefined>(
    (state) => state.connection
  );

  const handleAddOpen = () => {
    setItemValue({ isNew: true, value: "New member here..." });
  };

  const handleItemSubmit = async (value: string) => {
    if (!itemValue) return;

    let response = await invoke<FindKeyResponse>("alter_set", {
      cstr: parseConnectionString(connection!),
      action: "add_member",
      key,
      value,
      replace: itemValue.isNew ? null : itemValue.value,
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

  const handleMemberDelete = async (value: string) => {
    const response = await invoke<FindKeyResponse>("alter_set", {
      cstr: parseConnectionString(connection!),
      action: "del_member",
      key,
      value,
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
