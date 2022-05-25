import { act, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { store } from "../../redux/store";
import services from "../../services/services";

import SocialMedia from "./index";
import "@testing-library/jest-dom/extend-expect";

const GITHUB = "https://github.com/ghanizadev/bluedis";
const INSTAGRAM = "https://www.instagram.com/ghnzdev";
const TWITTER = "https://twitter.com/ghanizadev";
const LINKEDIN = "https://www.linkedin.com/in/ghanizadev/";
const FACEBOOK = "https://www.facebook.com/ghnzdev";

describe("<Search />", () => {
  let shellSpy: jest.SpyInstance;

  beforeEach(() => {
    shellSpy = jest
      .spyOn(services.shell, "openExternal")
      .mockImplementation(() => ({}));
  });

  it("Should render", () => {
    render(
      <Provider store={store}>
        <SocialMedia />
      </Provider>
    );

    const linkedin = screen.getByTestId("links-linkedin");
    const twitter = screen.getByTestId("links-twitter");
    const instagram = screen.getByTestId("links-instagram");
    const github = screen.getByTestId("links-github");

    expect(linkedin).toBeInTheDocument();
    expect(twitter).toBeInTheDocument();
    expect(instagram).toBeInTheDocument();
    expect(github).toBeInTheDocument();
  });

  it("Should open linkedin", () => {
    render(
      <Provider store={store}>
        <SocialMedia />
      </Provider>
    );

    const link = screen.getByTestId("links-linkedin");

    act(() => {
      link.click();
    });

    expect(shellSpy).toHaveBeenCalledTimes(1);
    expect(shellSpy).toHaveBeenCalledWith(LINKEDIN);
  });

  it("Should github", () => {
    render(
      <Provider store={store}>
        <SocialMedia />
      </Provider>
    );

    const link = screen.getByTestId("links-github");

    act(() => {
      link.click();
    });

    expect(shellSpy).toHaveBeenCalledTimes(1);
    expect(shellSpy).toHaveBeenCalledWith(GITHUB);
  });

  it("Should twitter", () => {
    render(
      <Provider store={store}>
        <SocialMedia />
      </Provider>
    );

    const link = screen.getByTestId("links-twitter");

    act(() => {
      link.click();
    });

    expect(shellSpy).toHaveBeenCalledTimes(1);
    expect(shellSpy).toHaveBeenCalledWith(TWITTER);
  });

  it("Should facebook", () => {
    render(
      <Provider store={store}>
        <SocialMedia />
      </Provider>
    );

    const link = screen.getByTestId("links-facebook");

    act(() => {
      link.click();
    });

    expect(shellSpy).toHaveBeenCalledTimes(1);
    expect(shellSpy).toHaveBeenCalledWith(FACEBOOK);
  });

  it("Should instagram", () => {
    render(
      <Provider store={store}>
        <SocialMedia />
      </Provider>
    );

    const link = screen.getByTestId("links-instagram");

    act(() => {
      link.click();
    });

    expect(shellSpy).toHaveBeenCalledTimes(1);
    expect(shellSpy).toHaveBeenCalledWith(INSTAGRAM);
  });
});
