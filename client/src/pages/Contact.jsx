import React, { useState } from "react";
import styled from "styled-components";
import emailjs from "emailjs-com";
import { ReactComponent as PhoneIcon } from "../utils/icons/PhoneIcon.svg";
import { ReactComponent as FacebookIcon } from "../utils/icons/FacebookIcon.svg";
import { ReactComponent as TwitterIcon } from "../utils/icons/TwitterIcon.svg";
import { ReactComponent as InstagramIcon } from "../utils/icons/InstagramIcon.svg";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Title = styled.div`
  padding: 0px 16px;
  margin-top: 100px;
  font-size: 25px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 800;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  @media (max-width: 800px) {
    flex-direction: column;
    align-items: center;
  }
`;

const FormContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 22px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 90%;
  max-width: 600px;
  background-color: ${({ theme }) => theme.card_background};
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TextArea = styled.textarea`
  padding: 12px;
  font-size: 16px;
  border: 1px solid ${({ theme }) => theme.border_color};
  border-radius: 4px;
  resize: none;
  height: 200px;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 16px;
  border: 1px solid ${({ theme }) => theme.border_color};
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 12px;
  font-size: 16px;
  color: ${({ theme }) => theme.button_text};
  background-color: ${({ theme }) => theme.button_background};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.button_hover};
  }
`;

const ContactGrid = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  padding: 0px 16px;
`;

const ContactCard = styled.a`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 80%;
  max-width: 300px;
  padding: 16px;
  background-color: ${({ theme }) => theme.card_background};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: ${({ theme }) => theme.text_primary};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.button_hover};
  }
`;

const Icon = styled.div`
  font-size: 24px;
  color: ${({ theme }) => theme.icon_color};

  svg {
    width: 24px;
    height: 24px;
  }
`;

const ContactInfo = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
`;

const Contact = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the email data
    const templateParams = {
      fullName,
      email,
      message,
    };

    // Send email using EmailJS
    emailjs
      .send(
        "service_ox4h4v4", // Replace with your EmailJS service ID
        "template_lddrrgj", // Replace with your EmailJS template ID
        templateParams,
        "71Why-0DNw84ZPsnA" // Replace with your EmailJS user ID
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          alert("Message sent successfully!");
        },
        (error) => {
          console.log("FAILED...", error);
          alert("Failed to send message, please try again later.");
        }
      );

    // Clear the form fields
    setFullName("");
    setEmail("");
    setMessage("");
  };

  return (
    <Container>
      <Wrapper>
        <Title>Contact Us</Title>
        <Content>
          <ContactGrid>
            <ContactCard href="tel:+1234567890">
              <Icon>
                <PhoneIcon />
              </Icon>
              <ContactInfo>Phone</ContactInfo>
            </ContactCard>
            <ContactCard
              href="https://www.facebook.com/your-profile"
              target="_blank"
            >
              <Icon>
                <FacebookIcon />
              </Icon>
              <ContactInfo>Facebook</ContactInfo>
            </ContactCard>
            <ContactCard
              href="https://twitter.com/your-profile"
              target="_blank"
            >
              <Icon>
                <TwitterIcon />
              </Icon>
              <ContactInfo>Twitter</ContactInfo>
            </ContactCard>
            <ContactCard
              href="https://www.instagram.com/your-profile"
              target="_blank"
            >
              <Icon>
                <InstagramIcon />
              </Icon>
              <ContactInfo>Instagram</ContactInfo>
            </ContactCard>
          </ContactGrid>
          <FormContainer>
            <Form onSubmit={handleSubmit}>
              <TextArea
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit">Send Message</Button>
            </Form>
          </FormContainer>
        </Content>
      </Wrapper>
    </Container>
  );
};

export default Contact;
