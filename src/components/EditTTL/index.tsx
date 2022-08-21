import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { actions } from "../../redux/store";
import { ItemType } from "../../redux/Types/Item";
import { State } from "../../redux/Types/State";
import Button from "../Button";
import { MessageBackground } from "../common/MessageBackground";
import { MessageContent } from "../common/MessageContent";
import { Input } from "../Input";
import Toggle from "../Toggle";
import { t } from "../../i18n";
import { invoke } from "@tauri-apps/api";
import { FindKeyResponse } from "../../services/find-key-response.interface";
import { parseKey } from "../../shared/helpers/parse-key.helper";

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 15px;

  & input {
    margin: 0 !important;
  }
`;

const EditTTL: React.FC = () => {
  const item = useSelector<State, ItemType | undefined>(
    (state) => state.editTTL
  );
  const [ttlAbsolute, setTTLAbsolute] = React.useState(false);
  const [ttl, setTTL] = React.useState<number>(0);
  const [displayTTL, setDisplayTTL] = React.useState<string>("");

  const dispatch = useDispatch();

  const handleConfirm = async () => {
    if (!item) return;
    let response = await invoke<FindKeyResponse>("set_ttl", {
      key: item.key,
      ttl,
      abs: ttlAbsolute,
    });

    if(response.Response?.Single)
      dispatch(actions.setPreview(parseKey(response.Response?.Single.key)));

    setTTL(0);
    setTTLAbsolute(false);
    dispatch(actions.setEditTTL(undefined));
  };

  const handleRemove = async () => {
    if (!item) return;

    const response = await invoke<FindKeyResponse>("set_ttl", {
      key: item.key,
      ttl: -1,
    });

    if (response.Response?.Single)
      dispatch(actions.setPreview(parseKey(response.Response?.Single.key)));

    setTTL(0);
    setTTLAbsolute(false);
    dispatch(actions.setEditTTL(undefined));
  };

  const handleCancel = () => {
    dispatch(actions.setEditTTL(undefined));
  };

  const handleTTLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (ttlAbsolute) {
      const absTTL = new Date(e.target.value);
      setTTL(absTTL.getTime());
    } else setTTL(+e.target.value);
  };

  React.useEffect(() => {
    if (!item) return;

    setDisplayTTL(
      item.ttl === -1
        ? t`not set`
        : new Date(item.ttl).toLocaleString(navigator.language, {
            timeZoneName: "short",
          })
    );
  }, [item]);

  return (
    <>
      {item && (
        <>
          <MessageBackground />
          <MessageContent data-testid={"edit-ttl-container"}>
            <h3>{t`Set TTL`}</h3>
            <small data-testid={"edit-ttl-label"}>
              {t`Actual`}: {displayTTL}
            </small>
            <Row>
              <span>{t`Absolute TTL`}: </span>
              <Toggle
                data-testid={"edit-ttl-toggle"}
                defaultChecked={ttlAbsolute}
                onChange={() => {
                  setTTLAbsolute(!ttlAbsolute);
                }}
              />
            </Row>
            <Row>
              <span>
                {ttlAbsolute ? t`Expires At` : t`Expiration (milliseconds)`}:{" "}
              </span>
              <Input
                type={ttlAbsolute ? "datetime-local" : "number"}
                style={{ width: ttlAbsolute ? "unset" : "80px" }}
                min={0}
                step={1000}
                data-testid={"edit-ttl-input"}
                onChange={handleTTLChange}
              />
            </Row>
            <Row style={{ justifyContent: "flex-end" }}>
              <Button
                disabled={item?.ttl === -1}
                label={t`Remove`}
                onClick={handleRemove}
                data-testid={"edit-ttl-remove"}
              />
              <Button
                label={t`Cancel`}
                onClick={handleCancel}
                data-testid={"edit-ttl-cancel"}
              />
              <Button
                disabled={ttl === 0}
                label={t`Confirm`}
                onClick={handleConfirm}
                data-testid={"edit-ttl-confirm"}
              />
            </Row>
          </MessageContent>
        </>
      )}
    </>
  );
};

export default EditTTL;
