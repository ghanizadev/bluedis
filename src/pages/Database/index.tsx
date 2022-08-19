import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import Table from "../../components/Table";
import Search from "../../components/Search";
import { ItemType } from "../../redux/Types/Item";
import Toolbar from "../../components/Toolbar";
import Preview from "../../components/Preview";
import { actions } from "../../redux/store";
import AddKey from "../../components/AddKey";
import { State } from "../../redux/Types/State";
import Shell from "../../components/Shell";
import { invoke } from "@tauri-apps/api";
import { FindKeyResponse } from "../../services/find-key-response.interface";
import { Connection } from "../../redux/Types/Connection";
import { parseConnectionString } from "../../shared/helpers/parse-connection-string.helper";
import { parseKey } from "../../shared/helpers/parse-key.helper";
import { Query } from "../../redux/Types/Query";
import services from "../../services";

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Home = () => {
  const data = useSelector<State, ItemType[]>((state) => state.data);
  const preview = useSelector<State, ItemType | undefined>(
    (state) => state.preview
  );
  const connected = useSelector<State, boolean>((state) => state.connected);
  const connection = useSelector<State, Connection | undefined>(
    (state) => state.connection
  );
  const lastQuery = useSelector<State, Query>((state) => state.query);

  const [addItem, setAddItem] = React.useState(false);

  const dispatch = useDispatch();

  const handlePreview = async (item: ItemType) => {
    if (preview === item) {
      dispatch(actions.setPreview(undefined));
      return;
    }

    let cstr = parseConnectionString(connection!);
    let response = await invoke<FindKeyResponse>("get_key", {
      cstr,
      key: item.key,
    });

    if (response.Error) throw new Error("key not found or expired");

    let { key: rawKey } = response.Response!.Single!;

    dispatch(actions.setPreview(parseKey(rawKey)));
  };

  const handlePreviewClose = () => {
    dispatch(actions.setPreview(undefined));
  };

  const handleRefresh = async () => {
    let cstr = parseConnectionString(connection!);
    let response = await invoke<FindKeyResponse>("find_keys", {
      cstr,
      pattern: lastQuery.input,
      cursor: lastQuery.cursor ?? 0,
    });

    if (response.Error) {
      dispatch(
        actions.setError({
          title: "Error",
          message: "Failed refresh, check your connection",
        })
      );

      return;
    }

    const { keys, cursor } = response.Response!.Collection;
    dispatch(actions.setData(keys.map(parseKey)));
    dispatch(actions.setQuery({ ...lastQuery, cursor, done: cursor === 0 }));
  };

  const handleAddCancel = () => {
    setAddItem(false);
  };

  const handleAddOpen = () => {
    setAddItem(true);
  };

  const handleAddConfirm = async (
    type: "set" | "zset" | "hash" | "string" | "list",
    key: string,
    ttl: number,
    ttlAbsolute: boolean
  ) => {
    let cstr = parseConnectionString(connection!);

    let response = await invoke<any>("create_key", {
      cstr,
      keyName: key,
      keyType: type,
      ttl,
      abs: ttlAbsolute,
    });

    await services.findKeys();
    dispatch(actions.setPreview(parseKey(response.Response.Created)));
    setAddItem(false);
  };

  React.useEffect(() => {
    if (!connected || !connection) return;

    let cstr = parseConnectionString(connection);
    invoke<{ Count?: number; Error?: string }>("db_count", { cstr }).then(
      (response) => {
        if (response.Count) {
          dispatch(actions.setCount(response.Count));
        }
      }
    );
  }, [data, connected]);

  return (
    <>
      <Content>
        <Search />
        <Toolbar onAddKey={handleAddOpen} onRefresh={handleRefresh} />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flex: 1,
          }}
        >
          <Wrapper>
            <Table data={data} onItemEdit={handlePreview} />
          </Wrapper>
          <Preview onCloseRequest={handlePreviewClose} />
        </div>
        <Shell />
      </Content>
      {addItem && (
        <AddKey onCancel={handleAddCancel} onConfirm={handleAddConfirm} />
      )}
    </>
  );
};

export default Home;
