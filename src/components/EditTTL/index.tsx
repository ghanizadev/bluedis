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
import * as services from "../../services/main-process";
import { t } from "../../i18n";

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
  const [ttl, setTTL] = React.useState<number | string>(0);
  const [displayTTL, setDisplayTTL] = React.useState<string>("");

  const dispatch = useDispatch();

  const handleConfirm = () => {
    if (!item) return;
    services.setTTL(item.key, ttl);
    dispatch(actions.setEditTTL(undefined));
  };

  const handleRemove = () => {
    if (!item) return;
    services.removeTTL(item.key);
    dispatch(actions.setEditTTL(undefined));
  };

  const handleCancel = () => {
    dispatch(actions.setEditTTL(undefined));
  };

  const handleTTLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (ttlAbsolute) {
      setTTL(e.target.value);
    } else setTTL(e.target.valueAsNumber);
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
                onChange={() => {
                  setTTLAbsolute(!ttlAbsolute);
                }}
              />
            </Row>
            <Row>
              <span>
                {ttlAbsolute ? t`Expires At` : t`Expiration (seconds)`}:{" "}
              </span>
              <Input
                type={ttlAbsolute ? "datetime-local" : "number"}
                style={{ width: ttlAbsolute ? "unset" : "80px" }}
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
