import React from "react";
import styled from "styled-components";

// import { openLink } from "../../services/main-process";
import Github from "../../assets/Github";
import Linkedin from "../../assets/Linkedin";

const GITHUB = "https://github.com/ghanizadev/bluedis";
const LINKEDIN = "https://www.linkedin.com/in/ghanizadev/";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 100px;

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
      // openLink(url);
    };
  };

  return (
    <Container>
      <Button data-testid={"links-linkedin"} onClick={handleClick(LINKEDIN)}>
        <Linkedin />
      </Button>
      <Button data-testid={"links-github"} onClick={handleClick(GITHUB)}>
        <Github />
      </Button>
    </Container>
  );
};

export default SocialMedia;
