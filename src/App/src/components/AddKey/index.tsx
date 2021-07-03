import React from "react";
import styled from "styled-components";
import Button from "../Button";
import { MessageBackground } from "../common/MessageBackground";
import { MessageContent } from "../common/MessageContent";
import Dropdown from "../Dropdown";
import Input from "../Input";
import Toggle from "../Toggle";
import {useSelector} from "react-redux";
import {State} from "../../redux/Types/State";

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

const Key = styled(Input)`
  flex: 1;
`;

type Props = {
  onCancel: () => void;
  onConfirm: (
    type: "set" | "zset" | "hash" | "string" | "list",
    key: string,
    ttl: number | string
  ) => void;
};

const AddKey: React.FC<Props> = (props) => {
  const { onCancel, onConfirm } = props;
  const [type, setType] = React.useState("set");
  const [key, setKey] = React.useState("");
  const [ttl, setTTL] = React.useState<string | number>(0);
  const [useTTL, setUseTTL] = React.useState(false);
  const [ttlAbsolute, setTTLAbsolute] = React.useState(false);
  const translation = useSelector<State, {[key: string]: string}>(state => state.settings.translation)

  const handleConfirm = () => {
    if (!type || !key) return;
    onConfirm(type as any, key, ttl);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleTypeChange = (type: string) => {
    setType(type);
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value);
  };

  const handleTTLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (ttlAbsolute) {
      setTTL(e.target.value);
    } else setTTL(e.target.valueAsNumber);
  };

  return (
    <>
      <MessageBackground />
      <MessageContent data-testid="data-add-message">
        <h3>{translation.addkey}</h3>
        <Row>
          <span>{translation.name}: </span>
          <Key onChange={handleKeyChange} />
        </Row>
        <Row>
          <span>{translation.type}: </span>
          <Dropdown
            onChange={handleTypeChange}
            items={["set", "zset", "hash", "string", "list"]}
          />
        </Row>
        <Row>
          <span>TTL: </span>
          <Toggle
            onChange={() => {
              setUseTTL(!useTTL);
            }}
          />
        </Row>
        {useTTL && (
          <>
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
          </>
        )}
        <Row style={{ justifyContent: "flex-end" }}>
          <Button label={translation.cancel} onClick={handleCancel} />
          <Button label={translation.confirm} onClick={handleConfirm} />
        </Row>
      </MessageContent>
    </>
  );
};

export default AddKey;
