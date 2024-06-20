import React from "react";
import styled from "styled-components";

const Card = styled.div`
  background-color: ${({ theme }) => theme.card_background};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  width: 80%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0 auto 20px auto;
`;

const BlogTitle = styled.h2`
  font-size: 20px;
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
`;

const BlogContent = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
  white-space: pre-wrap;
`;

const BlogCard = ({ post }) => (
  <Card>
    <BlogTitle>{post.title}</BlogTitle>
    <BlogContent>{post.content}</BlogContent>
  </Card>
);

export default BlogCard;
