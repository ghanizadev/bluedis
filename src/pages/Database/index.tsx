import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import Table from "../../components/Table";
import Search from "../../components/Search";
import { ItemType } from "../../redux/Types/Item";
import Toolbar from "../../components/Toolbar";
import Preview from "../../components/Preview";
import { actions } from "../../redux/store";
// import {
//   addKey,
//   getDBCount,
//   updateData,
//   updatePreview,
// } from "../../services/main-process";
import AddKey from "../../components/AddKey";
import { State } from "../../redux/Types/State";
import Shell from "../../components/Shell";

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

  const [addItem, setAddItem] = React.useState(false);

  const dispatch = useDispatch();

  const handlePreview = (item: ItemType) => {
    if (preview === item) {
      dispatch(actions.setPreview(undefined));
      return;
    }

    // updatePreview(item.key);
  };

  const handlePreviewClose = () => {
    dispatch(actions.setPreview(undefined));
  };

  const handleRefresh = () => {
    // updateData();
  };

  const handleAddCancel = () => {
    setAddItem(false);
  };

  const handleAddOpen = () => {
    setAddItem(true);
  };

  const handleAddConfirm = (
    type: "set" | "zset" | "hash" | "string" | "list",
    key: string,
    ttl: number,
    ttlAbsolute: boolean
  ) => {
    // addKey(key, type, ttl, ttlAbsolute);
    setAddItem(false);
  };

  React.useEffect(() => {
    // connected && getDBCount();
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
