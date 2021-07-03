import React from "react";
import { SquareButton } from "./SquareButton";
import { Separator } from "./Separator";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../redux/Types/State";
import {
  deleteKey,
  disconnect,
  exportItems,
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
import { ReactComponent as TerminalIcon } from "../../assets/terminal.svg";
import { Connection } from "../../redux/Types/Connection";
import { Container } from "./Container";
import { LastRefresh } from "./LastRefresh";

type Props = {
  onRefresh: () => void;
  onAddKey: () => void;
};

const Toolbar: React.FC<Props> = (props) => {
  const { onRefresh, onAddKey } = props;
  const translation = useSelector<State, {[key: string]: any}>(state => state.settings.translation)

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
    exportItems(selected);
  };

  const handleDeleteSelected = () => {
    dispatch(
      actions.setConfirmation({
        message: `${translation.deleteconfirm} ${
          selected.length === 1
            ? translation.deletesingle
            : translation.deletemulti.replace('{{n}}', selected.length)
        }?`,
        title: translation.attention,
        onConfirm: () => {
          deleteKey(selected);
          dispatch(actions.clearSelection());
        },
      })
    );
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleTerminal = () => {
    if(!store.getState().terminal.open) dispatch(actions.terminalWelcome())
    dispatch(actions.setTerminal(!store.getState().terminal.open));
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
      <Container data-testid="toolbar">
        <SquareButton
          data-testid="data-add"
          title={translation.addkey}
          onClick={handleAdd}
        >
          <AddIcon />
        </SquareButton>
        <SquareButton
          data-testid="data-refresh"
          title={translation.refresh}
          onClick={handleRefresh}
        >
          <RefreshIcon />
        </SquareButton>
        <Separator />
        <SquareButton
          data-testid="data-remove"
          disabled={selected.length === 0}
          remove
          title={translation.multidelete}
          onClick={handleDeleteSelected}
        >
          <RemoveIcon />
        </SquareButton>
        <SquareButton
          data-testid="data-export"
          disabled={selected.length === 0}
          title={translation.export}
          onClick={handleDownloadSelected}
        >
          <DownloadIcon />
        </SquareButton>
        <Separator />
        <SquareButton
          data-testid="data-shell"
          title={translation.showterminal}
          onClick={handleTerminal}
        >
          <TerminalIcon />
        </SquareButton>
        <Separator />
        <SquareButton
          data-testid="data-disconnect"
          title={translation.closeconnection}
          onClick={handleDisconnect}
        >
          <DisconnectIcon />
        </SquareButton>
        {!favorites.find(
          (connection) => connection.id === currentConnection?.id
        ) && (
          <SquareButton
            data-testid="data-favorite"
            title={translation.favoriteconnection}
            onClick={handleFavorite}
          >
            <FavoriteIcon />
          </SquareButton>
        )}
        <LastRefresh>
          {translation.lastupdate}: {lastRefresh.toLocaleTimeString()}
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
