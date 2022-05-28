import { act, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { actions, store } from "../../redux/store";
import services from "../../services/services";

import Frame from "./index";
import "@testing-library/jest-dom/extend-expect";

describe("<OSXBar />", () => {
  let sendSpy: jest.SpyInstance;

  beforeAll(() => {
    window.electron.platform = "darwin";
  });

  beforeEach(() => {
    sendSpy = jest.spyOn(services, "send").mockImplementation(() => ({}));
  });

  it("Should render", () => {
    render(
      <Provider store={store}>
        <Frame />
      </Provider>
    );

    const bar = screen.getByTestId("osx-bar");
    const fullscreen = screen.getByTestId("frame-fullscreen");
    const minimize = screen.getByTestId("frame-minimize");
    const close = screen.getByTestId("frame-close");
    const title = screen.getByTestId("frame-titlebar");

    expect(bar).toBeInTheDocument();
    expect(minimize).toBeInTheDocument();
    expect(fullscreen).toBeInTheDocument();
    expect(close).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Bluedis");
  });

  it("Should go fullscreen", () => {
    render(
      <Provider store={store}>
        <Frame />
      </Provider>
    );

    const maximize = screen.getByTestId("frame-fullscreen");

    act(() => {
      maximize.click();
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith("fullscreen");
  });

  it("Should maximize", () => {
    render(
      <Provider store={store}>
        <Frame />
      </Provider>
    );

    const title = screen.getByTestId("frame-titlebar").parentElement;

    if (!title) throw new Error("Title wrapper is not present");

    act(() => {
      fireEvent.doubleClick(title);
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith("maximize");
  });

  it("Should minimize", () => {
    render(
      <Provider store={store}>
        <Frame />
      </Provider>
    );

    const minimize = screen.getByTestId("frame-minimize");

    act(() => {
      minimize.click();
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith("minimize");
  });

  it("Should close", () => {
    render(
      <Provider store={store}>
        <Frame />
      </Provider>
    );

    const close = screen.getByTestId("frame-close");

    act(() => {
      close.click();
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith("close");
  });

  it("Should turn button gray on blur", () => {
    render(
      <Provider store={store}>
        <Frame />
      </Provider>
    );

    const close = screen.getByTestId("frame-close");
    const fullscreen = screen.getByTestId("frame-fullscreen");
    const minimize = screen.getByTestId("frame-minimize");

    act(() => {
      fireEvent.blur(window);
    });

    expect(getComputedStyle(fullscreen).backgroundColor).toEqual(
      "rgb(204, 204, 204)"
    );
    expect(getComputedStyle(close).backgroundColor).toEqual(
      "rgb(204, 204, 204)"
    );
    expect(getComputedStyle(minimize).backgroundColor).toEqual(
      "rgb(204, 204, 204)"
    );
  });

  it("Should have right title", () => {
    render(
      <Provider store={store}>
        <Frame />
      </Provider>
    );

    act(() => {
      store.dispatch(actions.setConnected(true));
      store.dispatch(
        actions.currentConnection({
          host: "localhost",
          port: "6379",
          tls: false,
          password: "",
          id: "0",
        })
      );
    });

    expect(screen.getByTestId("frame-titlebar")).toHaveTextContent(
      "Bluedis - redis://localhost:6379"
    );

    act(() => {
      store.dispatch(
        actions.currentConnection({
          host: "host",
          port: "1234",
          tls: true,
          password: "",
          id: "1",
        })
      );
    });

    expect(screen.getByTestId("frame-titlebar")).toHaveTextContent(
      "Bluedis - rediss://host:1234"
    );

    act(() => {
      store.dispatch(
        actions.currentConnection({
          host: "host",
          port: "1234",
          tls: true,
          password: "",
          id: "2",
          name: "local",
        })
      );
    });

    expect(screen.getByTestId("frame-titlebar")).toHaveTextContent(
      "Bluedis - rediss://host:1234 | [local]"
    );

    act(() => {
      const connection = {
        host: "host",
        port: "1234",
        tls: true,
        password: "",
        id: "4",
      };

      store.dispatch(
        actions.addFavorite({
          host: "redis",
          port: "6379",
          tls: false,
          password: "abcd123!",
          id: "25",
        })
      );
      store.dispatch(actions.addFavorite({ ...connection, name: "the name" }));
      store.dispatch(actions.currentConnection(connection));
    });

    expect(screen.getByTestId("frame-titlebar")).toHaveTextContent(
      "Bluedis - rediss://host:1234 | [the name]"
    );

    act(() => {
      store.dispatch(
        actions.currentConnection({
          host: "asbdiubegbwebguewbugiuasbvdaslgakgoeivbadvfefvuaasdfasfasfsafasfeo",
          port: "1234",
          tls: false,
          password: "",
          id: "7",
          name: "gionrwigorenbbhreoihbreoibhreiogberoibherobheoirbhwbdwquibdqwiuvd",
        })
      );
    });

    expect(screen.getByTestId("frame-titlebar")).toHaveTextContent(
      "Bluedis - redis://asbdiubegbwe...fasfsafasfeo:1234 | [gionrwigoren...wquibdqwiuvd]"
    );
  });
});
