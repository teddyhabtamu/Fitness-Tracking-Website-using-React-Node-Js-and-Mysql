import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 36px;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
`;

const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 90};
`;

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangeName = (e) => setName(e.target.value);
  const handleChangeEmail = (e) => setEmail(e.target.value);
  const handleChangePassword = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    setError(""); // Clear any previous errors
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        { name, email, password }
      );
      console.log("Sign Up Success:", response.data);
      console.log("navigating");
      navigate("/signin"); // Redirect to the sign-in page after successful signup
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        console.error("Sign Up Error:", error);
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div>
        <Title>Create New Account 👋</Title>
        <Span>Please enter details to create a new account</Span>
      </div>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "20px", flexDirection: "column" }}
      >
        <TextInput
          label="Full name"
          placeholder="Enter your full name"
          value={name}
          handleChange={handleChangeName}
        />
        <TextInput
          label="Email Address"
          placeholder="Enter your email address"
          value={email}
          handleChange={handleChangeEmail}
        />
        <TextInput
          label="Password"
          placeholder="Enter your password"
          password
          value={password}
          handleChange={handleChangePassword}
          autoComplete="off"
        />
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button disabled={loading} type="submit">
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
    </Container>
  );
};

export default SignUp;
