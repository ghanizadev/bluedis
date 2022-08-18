import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { State } from "../../redux/Types/State";
import { actions, store } from "../../redux/store";
import AddIcon from "../../assets/Plus";
import RefreshIcon from "../../assets/Refresh";
import RemoveIcon from "../../assets/Trash";
import DownloadIcon from "../../assets/Download";
import DisconnectIcon from "../../assets/LogOut";
import FavoriteIcon from "../../assets/Star";
import TerminalIcon from "../../assets/Terminal";
import { Connection } from "../../redux/Types/Connection";
import { t } from "../../i18n";

import { Container } from "./Container";
import { LastRefresh } from "./LastRefresh";
import PickName from "./PickName";
import { Separator } from "./Separator";
import { SquareButton } from "./SquareButton";
import { invoke } from "@tauri-apps/api";
import {parseConnectionString} from "../../shared/helpers/parse-connection-string.helper";

type Props = {
  onRefresh: () => void;
  onAddKey: () => void;
};

const Toolbar: React.FC<Props> = (props) => {
  const { onRefresh, onAddKey } = props;

  const selected = useSelector<State, string[]>((state) => state.selected);
  const favorites = useSelector<State, Connection[]>(
    (state) => state.favorites
  );
  const currentConnection = useSelector<State, Connection | undefined>(
    (state) => state.connection
  );
  const lastRefresh = useSelector<State, Date>((state) => state.lastRefresh);

  const [newName, setNewName] = React.useState(false);
  const dispatch = useDispatch();

  const handleRefresh = () => {
    onRefresh();
  };

  const handleAdd = () => {
    onAddKey();
  };

  const handleDownloadSelected = () => {
    // exportItems(selected);
  };

  const handleDeleteSelected = () => {
    const title = t`Attention`;
    const message =
      selected.length === 1
        ? t`Do you really want to delete THIS KEY?`
        : t`Do you really want to delete THESE ${selected.length} KEYS?`;

    dispatch(
      actions.setConfirmation({
        message,
        title,
        onConfirm: async () => {
          await invoke("rm_keys", { cstr: parseConnectionString(currentConnection!), keys: selected }).then(() => {
            dispatch(actions.clearSelection());
          });

          handleRefresh();
        },
      })
    );
  };

  const handleDisconnect = async () => {
    await invoke("disconnect");
    dispatch(actions.setConnected(false));
    dispatch(actions.resetTerminal());
  };

  const handleTerminal = () => {
    dispatch(actions.setTerminal(!store.getState().terminal.open));
  };

  const handleFavorite = () => {
    setNewName(true);
  };

  const handleNewFavoriteName = async (name: string) => {
    if (currentConnection) {
      dispatch(actions.addFavorite({ ...currentConnection, name }));
      dispatch(actions.currentConnection({ ...currentConnection, name }));

      const updated = store.getState();

      await Promise.all(
        updated.favorites.map(async (fav) => {
          let resp = await invoke<any>("save_favorite", {
            fav: { ...fav, port: +fav.port },
          });

          if (resp.Error)
            dispatch(
              actions.setError({
                title: "Error",
                message: resp.Error,
              })
            );
        })
      );
    }
    setNewName(false);
  };

  const handleNewNameCancel = () => {
    setNewName(false);
  };

  return (
    <>
      <Container data-testid="toolbar">
        <SquareButton
          data-testid="data-add"
          title={t`Add a new key`}
          onClick={handleAdd}
        >
          <AddIcon />
        </SquareButton>
        <SquareButton
          data-testid="data-refresh"
          title={t`Refresh list`}
          onClick={handleRefresh}
        >
          <RefreshIcon />
        </SquareButton>
        <Separator />
        <SquareButton
          data-testid="data-remove"
          disabled={selected.length === 0}
          remove
          title={t`Remove selected`}
          onClick={handleDeleteSelected}
        >
          <RemoveIcon />
        </SquareButton>
        <SquareButton
          data-testid="data-export"
          disabled={selected.length === 0}
          title={t`Export selected`}
          onClick={handleDownloadSelected}
        >
          <DownloadIcon />
        </SquareButton>
        <Separator />
        <SquareButton
          data-testid="data-shell"
          title={t`Open terminal`}
          onClick={handleTerminal}
        >
          <TerminalIcon />
        </SquareButton>
        <Separator />
        <SquareButton
          data-testid="data-disconnect"
          title={t`Close this connection`}
          onClick={handleDisconnect}
        >
          <DisconnectIcon />
        </SquareButton>
        {!favorites.find((connection) => {
          return (
            currentConnection?.host === connection.host &&
            currentConnection?.port === connection.port &&
            currentConnection?.password === connection.password &&
            currentConnection?.tls === connection.tls
          );
        }) && (
          <SquareButton
            data-testid="data-favorite"
            title={t`Favorite this connection`}
            onClick={handleFavorite}
          >
            <FavoriteIcon />
          </SquareButton>
        )}
        <LastRefresh>
          {t`Last update`}: {lastRefresh.toLocaleTimeString()}
        </LastRefresh>
      </Container>
      {newName && (
        <PickName
          onConfirm={handleNewFavoriteName}
          onCancel={handleNewNameCancel}
        />
      )}
    </>
  );
};

export default Toolbar;
