import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.form_background};
  padding: 20px;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const TitleInput = styled.input`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.input_border};
  border-radius: 4px;
  font-size: 16px;
  width: 600px;
  
  margin-bottom: 16px;
`;

const ContentTextArea = styled.textarea`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.input_border};
  border-radius: 4px;
  font-size: 16px;
  resize: none;
  width: 600px;
  height: 200px;
  margin-bottom: 16px;
`;

const SubmitButton = styled.button`
  padding: 10px 16px;
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

const BlogForm = ({ addPost, closeForm }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/blogs",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      addPost({
        _id: response.data._id,
        title,
        content,
        author_id: response.data.author_id,
        created_at: response.data.created_at,
      });
      closeForm();
    } catch (error) {
      console.error("Error adding blog post:", error);
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <TitleInput
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div>
        <ContentTextArea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        </div>
        <SubmitButton type="submit">Submit</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default BlogForm;
