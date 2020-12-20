import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../services/mainProcess";
import Table from "../../components/Table";
import styled from "styled-components";
import Search from "../../components/Search";
import { Item } from "../../redux/Types/Item";
import Toolbar from "../../components/Toolbar";
import Preview from "../../components/Preview";
import { actions } from "../../redux/store";

import { updateData, addKey } from "../../services/mainProcess";
import AddKey from "../../components/AddKey";
import Pagination from "../../components/Pagination";
import Connect from "./Connect";
import { State } from "../../redux/Types/State";

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
  const data = useSelector<State, Item[]>((state) => state.data);
  const preview = useSelector<State, Item | undefined>((state) => state.preview);
  const connected = useSelector<State, boolean>((state) => state.connected);

  const [addItem, setAddItem] = React.useState(false);

  const dispatch = useDispatch();

  const handlePreview = (item: Item) => {
    if (preview === item) {
      dispatch(actions.setPreview(undefined));
      return;
    }

    dispatch(actions.setPreview(item));
  };

  const handlePreviewClose = () => {
    dispatch(actions.setPreview(undefined));
  };

  const handleRefresh = () => {
    updateData("");
  };

  const handleAddCancel = () => {
    setAddItem(false);
  };

  const handleAddOpen = () => {
    setAddItem(true);
  };

  const handleAddConfirm = (
    type: "set" | "zset" | "hash" | "string" | "list",
    key: string
  ) => {
    setAddItem(false);
    addKey(key, type);
  };

  return (
    <>
      <Content>
        {connected && (
          <>
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
                <Pagination />
              </Wrapper>
              <Preview onCloseRequest={handlePreviewClose} />
            </div>
          </>
        )}
        {!connected && <Connect />}
      </Content>
      {addItem && (
        <AddKey onCancel={handleAddCancel} onConfirm={handleAddConfirm} />
      )}
    </>
  );
};

export default Home;
