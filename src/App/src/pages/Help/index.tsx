import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { State } from "../../redux/Types/State";
import { openLink } from "../../services/mainProcess";

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
`;
const Content = styled.div`
  flex: 1;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const Link = styled.button`
  padding: 0;
  margin: 0;

  white-space: nowrap;
  color: ${(props) => props.theme.foreground};
  text-decoration: underline;

  border: none;
  background-color: transparent;
  cursor: pointer;
`;

const TextArea = styled.textarea`
  flex: 1;
  width: 100%;
  resize: none;
`;

const GhanizadevIcon = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
  margin: 8px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const Help = () => {
  const license = useSelector<State, string | undefined>(
    (state) => state.settings.license
  );

  const handleOpenLink = (link: string) => {
    return () => {
      openLink(link);
    };
  };

  return (
    <Container>
      <h1>Help</h1>
      <Content>
        <Header>
          <GhanizadevIcon src={`${process.env.PUBLIC_URL}/logo_blue.png`} />
          <div>
            <h2>
              Bluedis <small>v1.0.0</small>
            </h2>
            <p>ghanizadev ltd.</p>
            <Link onClick={handleOpenLink("https://ghanizadev.com")}>
              https://ghanizadev.com
            </Link>
          </div>
        </Header>
        <br />
        <br />
        <p>author: Jean Felipe de Melo</p>
        <p>
          email:{" "}
          <Link onClick={handleOpenLink("mailto:jf.melo6@gmail.com")}>
            jf.melo6@gmail.com
          </Link>
        </p>
        <br />
        <TextArea readOnly value={license}></TextArea>
        <br />
        <p>
          repository:{" "}
          <Link
            onClick={handleOpenLink("https://github.com/ghanizadev/bluedis")}
          >
            https://github.com/ghanizadev/bluedis
          </Link>
        </p>
        <br />
        <p>
          issues:{" "}
          <Link
            onClick={handleOpenLink("https://github.com/ghanizadev/bluedis")}
          >
            https://github.com/ghanizadev/bluedis
          </Link>
        </p>
        <br />
        <br />
        <div>
          core icons made by{" "}
          <Link
            title="Feather Icons"
            onClick={handleOpenLink("https://feathericons.com")}
          >
            Feather Icons
          </Link>
        </div>
        <div>
          application icon made by{" "}
          <Link
            onClick={handleOpenLink(
              "https://www.flaticon.com/free-icon/server_957472"
            )}
            title="Kiranshastry"
          >
            Kiranshastry
          </Link>{" "}
          from{" "}
          <Link
            onClick={handleOpenLink("https://www.flaticon.com/")}
            title="Flaticon"
          >
            www.flaticon.com
          </Link>
        </div>
      </Content>
    </Container>
  );
};

export default Help;
