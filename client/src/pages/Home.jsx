import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import HomeImg from "../utils/Images/Home.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  min-height: 100vh;
  overflow: auto;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const LeftContent = styled.div`
  flex: 1;
  padding: 0 20px;
  text-align: center;

  @media (min-width: 768px) {
    text-align: left;
  }
`;

const RightContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;

  @media (min-width: 768px) {
    margin-top: 0;
  }
`;

const Header = styled.header`
  color: white;
  margin-top: -40px;
`;

const Title = styled.h1`
  font-size: 62px;
  color: #000000;
  margin: 0;
`;

const SubTitle = styled.h2`
  font-size: 52px;
  color: #c74c8e;
  margin: 0;
  margin-top: -10px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #5d5d5d;
  margin: 20px 0;
  max-width: 600px;
  margin: 0 auto;
  margin-bottom: 40px;
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
  margin: 20px 0;

  @media (min-width: 768px) {
    max-width: 400px;
    margin: 0;
   
  }

  @media (max-width: 768px) {
    margin: 0;
    display: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const Button = styled.button`
  padding: 15px 30px;
  font-size: 16px;
  color: ${({ theme }) => theme.bg};
  background-color: ${({ theme }) => theme.primary};
  border-radius: 5px;
  cursor: pointer;

  @media (min-width: 768px) {
    margin: 0 10px;
  }
`;

const Footer = styled.footer`
  padding: 20px;
  background-color: #333333;
  color: white;
  text-align: center;
  margin-top: auto;

  @media (min-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
`;

const SocialIcons = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
`;

const SocialIconLink = styled.a`
  font-size: 24px;
  color: white;
  margin: 0 10px;
  transition: color 0.3s ease;

  &:hover {
    color: #c74c8e;
  }
`;

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/signin");
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  return (
    <Container>
      <LeftContent>
        <Header>
          <Title>HEALTHY</Title>
          <SubTitle>BETTER LIFE</SubTitle>
          <Description>
            Welcome to PeakPulse: Your Ultimate Fitness Companion Discover the
            power of PeakPulse, where fitness meets technology to revolutionize
            your health journey. Whether you're a seasoned athlete or just
            starting out, our innovative fitness tracking platform empowers you
            to achieve your goals like never before.
          </Description>
          <ButtonGroup>
            <Button primary onClick={handleLoginClick}>
              Sign In
            </Button>
            <Button onClick={handleSignupClick}>Sign Up</Button>
          </ButtonGroup>
        </Header>
      </LeftContent>
      <RightContent>
        <Image src={HomeImg} alt="Fitness" />
      </RightContent>
      <Footer>
        <div>
          © 2024 Healthy Better Life. All rights reserved.
          <SocialIcons>
            <SocialIconLink
              href="https://www.facebook.com/fitnesshousee"
              target="_blank"
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </SocialIconLink>
            <SocialIconLink href="https://x.com/TheGymElite" target="_blank">
              <FontAwesomeIcon icon={faTwitter} />
            </SocialIconLink>
            <SocialIconLink
              href="https://www.instagram.com/muscleandfitness/"
              target="_blank"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </SocialIconLink>
            <SocialIconLink
              href="https://www.linkedin.com/groups/123661/"
              target="_blank"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </SocialIconLink>
          </SocialIcons>
        </div>
      </Footer>
    </Container>
  );
};

export default Home;
