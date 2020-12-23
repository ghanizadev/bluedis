import React from "react";
import { SquareButton } from "./SquareButton";
import { Separator } from "./Separator";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../redux/Types/State";
import { Item } from "../../redux/Types/Item";
import ItemDelete from "./ItemDelete";
import {
  deleteKey,
  disconnect,
  saveFavorites,
} from "../../services/mainProcess";
import { actions, store } from "../../redux/store";
import PickName from "./PickName";

import { ReactComponent as AddIcon } from "../../assets/plus.svg";
import { ReactComponent as RefreshIcon } from "../../assets/refresh.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash.svg";
import { ReactComponent as DownloadIcon } from "../../assets/download.svg";
import { ReactComponent as DisconnectIcon } from "../../assets/log-out.svg";
import { ReactComponent as FavoriteIcon } from "../../assets/star.svg";
import { Connection } from "../../redux/Types/Connection";
import { Container } from "./Container";

type Props = {
  onRefresh: () => void;
  onAddKey: () => void;
};

const Toolbar: React.FC<Props> = (props) => {
  const { onRefresh, onAddKey } = props;

  const selected = useSelector<State, string[]>((state) => state.selected);
  const data = useSelector<State, Item[]>((state) => state.data);
  const favorites = useSelector<State, Connection[]>(
    (state) => state.favorites
  );
  const currentConnection = useSelector<State, Connection | undefined>(
    (state) => state.connection
  );

  const [newName, setNewName] = React.useState(false);
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
  };

  const handleFavorite = () => {
    setNewName(true);
  };

  const handleNewFavoriteName = (name: string) => {
    if (currentConnection) {
      dispatch(actions.addFavorite({ ...currentConnection, name }));
      dispatch(actions.currentConnection({ ...currentConnection, name }));

      const updated = store.getState();
      saveFavorites(updated.favorites);
    }
    setNewName(false);
  };

  const handleNewNameCancel = () => {
    setNewName(false);
  };

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
        <SquareButton title="Close this connection" onClick={handleDisconnect}>
          <DisconnectIcon />
        </SquareButton>
        {!favorites.find(
          (connection) => connection.id === currentConnection?.id
        ) && (
          <SquareButton
            title="Favorite this connection"
            onClick={handleFavorite}
          >
            <FavoriteIcon />
          </SquareButton>
        )}
      </Container>
      {newName && (
        <PickName
          onConfirm={handleNewFavoriteName}
          onCancel={handleNewNameCancel}
        />
      )}
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
