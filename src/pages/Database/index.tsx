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
import { parseKey } from "../../shared/helpers/parse-key.helper";
import { Query } from "../../redux/Types/Query";
import services from "../../services";
import { useLoading } from "../../shared/hooks/use-loading.hook";

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
  const lastQuery = useSelector<State, Query>((state) => state.query);

  const [addItem, setAddItem] = React.useState(false);

  const dispatch = useDispatch();
  const loading = useLoading();

  const handlePreview = async (item: ItemType) => {
    if (preview?.key === item.key) {
      dispatch(actions.setPreview(undefined));
      loading(false);
      return;
    }

    let response = await invoke<FindKeyResponse>("get_key", {
      key: item.key,
    });

    if (response.Error) {
      dispatch(actions.setError({
        title: "Error",
        message: response.Error,
      }));

      loading(false);
      await services.findKeys();
      return;
    }

    let data = response.Response!.Single!;

    if(data.key)
      dispatch(actions.setPreview(parseKey(data.key)));
    else {
      await services.findKeys();
    }

    loading(false);
  };

  const handlePreviewClose = () => {
    dispatch(actions.setPreview(undefined));
  };

  const handleRefresh = async () => {
    dispatch(actions.setSearching(true));
    let response = await invoke<FindKeyResponse>("find_keys", {
      pattern: lastQuery.input,
      cursor: 0,
    });

    dispatch(actions.setSearching(false));

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

    let response = await invoke<any>("create_key", {
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
    if (!connected) return;

    invoke<{ Count?: number; Error?: string }>("db_count").then(
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
