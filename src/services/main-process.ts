/* eslint-disable  @typescript-eslint/no-explicit-any */

import { actions, store } from "../redux/store";

import services from "./services";
// import "./listeners";
//
// export const close = () => {
//   services.send("close");
// };
//
// export const minimize = () => {
//   services.send("minimize");
// };
//
// export const maximize = () => {
//   services.send("maximize");
// };
//
// export const fullscreen = () => {
//   services.send("fullscreen");
// };
//
// export const deleteKey = (key: string[]) => {
//   services.send("remove", key);
// };
//
// export const updateData = () => {
//   const query = store.getState().query;
//   services.send("update", query);
// };
//
// export const getDBCount = () => {
//   services.send("getCountDB");
// };
//
// export const addKey = (
//   key: string,
//   type: string,
//   ttl: number,
//   ttlAbsolute: boolean
// ) => {
//   services.send("add", key, type, ttl, ttlAbsolute);
// };
//
// export const alterKey = (key: string, value: any, update?: any) => {
//   services.send("alter", key, value, update);
// };
//
// export const delKeyMember = (key: string, indexOrName: number | string) => {
//   services.send("del", key, indexOrName);
// };
//
// export const selectDatabase = (index: number) => {
//   services.send("selectDatabase", index);
// };
//
// export const find = (match: string, cursor: number) => {
//   services.send("find", match, cursor);
// };
//
// export const findKeys = (match: string, cursor: number) => {
//   store.dispatch(actions.setSearching(true));
//   store.dispatch(actions.setData([]));
//   services.send("findKeys", match, cursor);
// };
//
// export const loadMore = (match: string, cursor: number) => {
//   services.send("loadMore", match, cursor);
// };
//
// export const updatePreview = (key: string) => {
//   services.send("updatePreview", key);
// };
//
// export const setTTL = (key: string, ttl: number, absolute?: boolean) => {
//   services.send("setTTL", key, ttl, absolute);
// };
//
// export const savePreferences = (preferences: any) => {
//   services.send("savePreferences", preferences);
// };
//
// export const saveFavorites = (favorites: any) => {
//   services.send("saveFavorites", favorites);
// };
//
// export const executeCommand = (command: string) => {
//   services.send("execute", command);
// };
//
// export const exportItems = (items: string[]) => {
//   services.send("exportItems", items);
// };
//
// export const wipeData = () => {
//   services.send("wipeData");
// };
//
// export const openLink = (link: string) => {
//   services.shell.openExternal(link);
// };
//
// export const getPreferences = () => {
//   services.send("initial");
// };
//
// export const connect = (connection: any) => {
//   store.dispatch(actions.setLoading(true));
//   services.send("connect", connection);
// };
//
// export const disconnect = () => {
//   services.send("disconnect");
//   store.dispatch(actions.setConnected(false));
//   store.dispatch(actions.resetTerminal());
// };
