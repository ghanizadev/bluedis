import React from "react";
import styled from "styled-components";
import { SquareButton } from "./SquareButton";
import { Separator } from "./Separator";

import { ReactComponent as AddIcon } from "../../assets/plus.svg";
import { ReactComponent as RefreshIcon } from "../../assets/refresh.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash.svg";
import { ReactComponent as DownloadIcon } from "../../assets/download.svg";
import { ReactComponent as DisconnectIcon } from "../../assets/log-out.svg";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../redux/Types/State";
import { Item } from "../../redux/Types/Item";
import ItemDelete from "./ItemDelete";
import { deleteKey, disconnect } from "../../services/mainProcess";
import { actions } from "../../redux/store";

const Container = styled.div`
  margin: 8px;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

type Props = {
  onRefresh: () => void;
  onAddKey: () => void;
};

const Toolbar: React.FC<Props> = (props) => {
  const { onRefresh, onAddKey } = props;
  const selected = useSelector<State, string[]>((state) => state.selected);
  const data = useSelector<State, Item[]>((state) => state.data);
  const [toDelete, setToDelete] = React.useState(false);
  const dispatch = useDispatch();

  const handleRefresh = () => {
    onRefresh();
  };

  const handleAdd = () => {
    onAddKey();
  };

  const handleDownloadSelected = () => {
    const items = selected
      .map((key) => data.find((item) => item.key === key))
      .reduce(
        (prev, curr) => !!curr && { ...prev, [curr.key]: curr.value },
        {}
      );

    const string = JSON.stringify(items, null, 2);

    const blob = new Blob([Buffer.from(string, "utf-8")], {
      type: "application/json;charset=utf-8",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `export_${Date.now()}.json`;
    a.click();
  };

  const handleDeleteSelected = () => {
    setToDelete(true);
  };

  const handleDeleteConfirm = () => {
    deleteKey(selected);
    dispatch(actions.clearSelection());
    setToDelete(false);
  };

  const handleDeleteCancel = () => {
    setToDelete(false);
  };

  const handleDisconnect = () => {
    disconnect();
  }

  return (
    <>
      <Container>
        <SquareButton title="Add a new key" onClick={handleAdd}>
          <AddIcon />
        </SquareButton>
        <SquareButton title="Refresh list" onClick={handleRefresh}>
          <RefreshIcon />
        </SquareButton>
        <Separator />
        <SquareButton
          disabled={selected.length === 0}
          remove
          title="Remove selected"
          onClick={handleDeleteSelected}
        >
          <RemoveIcon />
        </SquareButton>
        <SquareButton
          disabled={selected.length === 0}
          title="Export selected"
          onClick={handleDownloadSelected}
        >
          <DownloadIcon />
        </SquareButton>
        <Separator />
        <SquareButton
          title="Close this connection"
          onClick={handleDisconnect}
        >
          <DisconnectIcon />
        </SquareButton>
      </Container>
      {toDelete && (
        <ItemDelete
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
};

export default Toolbar;
