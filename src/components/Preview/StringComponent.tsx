import React from "react";
import styled from "styled-components";

import { Item, StringType } from "../../redux/Types/Item";
import { t } from "../../i18n";
// import { alterKey } from "../../services/main-process";

import { PreviewActions } from "./preview-actions";
import { parseConnectionString } from "../../shared/helpers/parse-connection-string.helper";
import { invoke } from "@tauri-apps/api";
import { FindKeyResponse } from "../../services/find-key-response.interface";
import { actions } from "../../redux/store";
import { parseKey } from "../../shared/helpers/parse-key.helper";
import { useDispatch, useSelector } from "react-redux";
import { Connection } from "../../redux/Types/Connection";
import { State } from "../../redux/Types/State";

const TextArea = styled.textarea`
  resize: none;
  padding: 8px;
  border: none;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  flex: 1;
`;

let saveTimeout: NodeJS.Timeout;

type Props = {
  item: Item<StringType>;
};
const StringComponent: React.FC<Props> = (props) => {
  const { key, value, ttl } = props.item;
  const [itemValue, setItemValue] = React.useState("");
  const [saved, setSaved] = React.useState(false);
  const dispatch = useDispatch();
  const connection = useSelector<State, Connection | undefined>(
    (state) => state.connection
  );

  const handleDocumentSave = async () => {
    const cstr = parseConnectionString(connection!);
    let response = await invoke<FindKeyResponse>("alter_string", {
      cstr,
      key,
      value: itemValue,
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

    clearTimeout(saveTimeout);
    setSaved(true);

    saveTimeout = setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setItemValue(e.target.value);
  };

  return (
    <>
      <TextArea
        data-testid={"string-textarea"}
        onChange={handleValueChange}
        defaultValue={value}
        spellCheck={false}
        autoCapitalize={"off"}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {saved && (
          <span
            data-testid={"save-message"}
            style={{
              alignSelf: "flex-start",
              whiteSpace: "nowrap",
            }}
          >
            {t`Key saved`}!
          </span>
        )}
        <span data-testid={"string-ttl"}>
          {ttl !== -1 &&
            t`TTL: ${new Date(ttl).toLocaleString(navigator.language, {
              timeZoneName: "short",
            })}`}
        </span>
        <PreviewActions
          data-testid={"string-actions"}
          item={props.item}
          onSaveClick={handleDocumentSave}
        />
      </div>
    </>
  );
};

export default StringComponent;
