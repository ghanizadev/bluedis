import React from "react";

import { PreviewContainer } from "../common/PreviewContainer";
import { PreviewTable } from "../common/PreviewTable";
import { PreviewTableData } from "../common/PreviewTableData";
import { PreviewTableRow } from "../common/PreviewTableRow";
import { HashType, Item } from "../../redux/Types/Item";
import { t } from "../../i18n";

import AddHashItem from "./AddHashItem";
import { PreviewActions } from "./preview-actions";
import { invoke } from "@tauri-apps/api";
import { useSelector } from "react-redux";
import { State } from "../../redux/Types/State";
import { Connection } from "../../redux/Types/Connection";
import { useDispatch } from "react-redux";
import { parseConnectionString } from "../../shared/helpers/parse-connection-string.helper";
import { FindKeyResponse } from "../../services/find-key-response.interface";
import { actions } from "../../redux/store";
import { parseKey } from "../../shared/helpers/parse-key.helper";

type Props = {
  item: Item<HashType>;
};
const HashComponent: React.FC<Props> = (props) => {
  const { key, value, ttl } = props.item;
  const [itemValue, setItemValue] = React.useState<{
    key: string;
    value: string;
    new: boolean;
  }>();
  const connection = useSelector<State, Connection | undefined>(
    (state) => state.connection
  );
  const dispatch = useDispatch();

  const handleAddOpen = () => {
    setItemValue({ key: "", value: "", new: true });
  };
  const handleItemSubmit = async (item: { key: string; value: string }) => {
    const cstr = parseConnectionString(connection!);
    const response = await invoke<FindKeyResponse>("alter_hash", {
      cstr,
      action: "add_member",
      key,
      value: JSON.stringify(item),
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

  const handleItemDelete = async (item: { key: string; value: string }) => {
    const cstr = parseConnectionString(connection!);
    const response = await invoke<FindKeyResponse>("alter_hash", {
      cstr,
      action: "del_member",
      key,
      value: item.key,
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
