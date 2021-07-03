import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { actions } from "../../redux/store";
import { Item } from "../../redux/Types/Item";
import { State } from "../../redux/Types/State";
import Button from "../Button";
import { MessageBackground } from "../common/MessageBackground";
import { MessageContent } from "../common/MessageContent";
import Input from "../Input";
import Toggle from "../Toggle";
import * as services from "../../services/mainProcess";

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
  const item = useSelector<State, Item | undefined>((state) => state.editTTL);
  const [ttlAbsolute, setTTLAbsolute] = React.useState(false);
  const [ttl, setTTL] = React.useState<number | string>(0);
  const [displayTTL, setDisplayTTL] = React.useState<string>("");
  const translation = useSelector<State, {[key: string]: string}>(state => state.settings.translation);

  const dispatch = useDispatch();

  const handleConfirm = () => {
    services.setTTL(item!.key, ttl);
    dispatch(actions.setEditTTL(undefined));
  };

  const handleRemove = () => {
    services.removeTTL(item!.key);
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
        ? "-"
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
          <MessageContent>
            <h3>{translation.setttl}</h3>
            <small>{translation.actual}: {displayTTL}</small>
            <Row>
              <span>{translation.absolutettl}: </span>
              <Toggle
                onChange={() => {
                  setTTLAbsolute(!ttlAbsolute);
                }}
              />
            </Row>
            <Row>
              <span>
                {ttlAbsolute ? translation.expiresat : translation.expirationsec}:{" "}
              </span>
              <Input
                type={ttlAbsolute ? "datetime-local" : "number"}
                style={{ width: ttlAbsolute ? "unset" : "80px" }}
                onChange={handleTTLChange}
              />
            </Row>
            <Row style={{ justifyContent: "flex-end" }}>
              <Button
                disabled={item?.ttl === -1}
                label={translation.removettl}
                onClick={handleRemove}
              />
              <Button label={translation.cancel} onClick={handleCancel} />
              <Button label={translation.confirm} onClick={handleConfirm} />
            </Row>
          </MessageContent>
        </>
      )}
    </>
  );
};

export default EditTTL;
