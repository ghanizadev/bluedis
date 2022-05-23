import React from "react";
import styled from "styled-components";

import { openLink } from "../../services/mainProcess";
import { ReactComponent as Instagram } from "../../assets/instagram.svg";
import { ReactComponent as Github } from "../../assets/github.svg";
import { ReactComponent as Facebook } from "../../assets/facebook.svg";
import { ReactComponent as Linkedin } from "../../assets/linkedin.svg";
import { ReactComponent as Twitter } from "../../assets/twitter.svg";

const GITHUB = "https://github.com/ghanizadev/bluedis";
const INSTAGRAM = "https://www.instagram.com/ghnzdev";
const TWITTER = "https://twitter.com/ghanizadev";
const LINKEDIN = "https://www.linkedin.com/in/ghanizadev/";
const FACEBOOK = "https://www.facebook.com/ghnzdev";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  & button {
    margin: 5px;
  }
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.text};

  & svg {
  }

  &:hover {
    transform: scale(1.05);
    color: ${(props) => props.theme.foreground};
  }
`;

const SocialMedia: React.FC = () => {
  const handleClick = (url: string) => {
    return (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      openLink(url);
    };
  };
  return (
    <Container>
      <Button onClick={handleClick(LINKEDIN)}>
        <Linkedin />
      </Button>
      <Button onClick={handleClick(GITHUB)}>
        <Github />
      </Button>
      <Button onClick={handleClick(FACEBOOK)}>
        <Facebook />
      </Button>
      <Button onClick={handleClick(INSTAGRAM)}>
        <Instagram />
      </Button>
      <Button onClick={handleClick(TWITTER)}>
        <Twitter />
      </Button>
    </Container>
  );
};

export default SocialMedia;
