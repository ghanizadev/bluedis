import React from "react";
import styled from "styled-components";
import Button from "../Button";
import { MessageBackground } from "../common/MessageBackground";
import { MessageContent } from "../common/MessageContent";
import Dropdown from "../Dropdown";
import Input from "../Input";
import Toggle from "../Toggle";
import {t} from "../../i18n";
import {KeyType} from "../../shared/constants/key-type.dto";

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
    type: KeyType,
    key: string,
    ttl: number | string
  ) => void;
};

const AddKey: React.FC<Props> = (props) => {
  const { onCancel, onConfirm } = props;
  const [type, setType] = React.useState<KeyType>("set");
  const [key, setKey] = React.useState("");
  const [ttl, setTTL] = React.useState<string | number>(0);
  const [useTTL, setUseTTL] = React.useState(false);
  const [ttlAbsolute, setTTLAbsolute] = React.useState(false);

  const handleConfirm = () => {
    if (!type || !key) return;
    onConfirm(type, key, ttl);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleTypeChange = (type: string) => {
    setType(type as KeyType);
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
      <MessageContent data-testid="add-key-component">
        <h3>{t`Add key`}</h3>
        <Row>
          <span>{t`Name`}: </span>
          <Key onChange={handleKeyChange} data-testid={"add-key-name"} />
        </Row>
        <Row>
          <span>{t`Type`}: </span>
          <Dropdown
            onChange={handleTypeChange}
            items={["set", "zset", "hash", "string", "list"]}
            data-testid={'add-key-select'}
          />
        </Row>
        <Row>
          <span>TTL: </span>
          <Toggle
            onChange={() => {
              setUseTTL(!useTTL);
            }}
            data-testid={'add-key-toggle'}
          />
        </Row>
        {useTTL && (
          <>
            <Row>
              <span>{t`Absolute TTL`}: </span>
              <Toggle
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
                onChange={handleTTLChange}
                data-testid={'add-key-ttl'}
              />
            </Row>
          </>
        )}
        <Row style={{ justifyContent: "flex-end" }}>
          <Button label={t`Cancel`} onClick={handleCancel} data-testid={"add-key-cancel"} />
          <Button label={t`Confirm`} onClick={handleConfirm} data-testid={"add-key-confirm"} />
        </Row>
      </MessageContent>
    </>
  );
};

export default AddKey;
