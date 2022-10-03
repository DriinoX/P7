import axios from "axios";
import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import PostForm from "../postform/PostForm";
import Post from "../post/Post";
import colors from "../../utils/style/colors";
import { AuthContext } from "../../context/AuthContext";

// Composants
const FeedContainer = styled.div`
  width:100vw;
  max-width: 700px;
  margin:auto;
`;

const FeedWrapper = styled.div`
  padding: 20px;
  width:90%;
  margin:auto;
`;

const Title = styled.h2`
  text-align: center;
  margin-top: 25px;
  font-style: italic;
  font-size: 30px;
  color: ${colors.tertiary};
`;

export default function Feed() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const getPosts = async () => {
      await axios
        .get(`http://localhost:3002/api/posts`, {
          headers: { Authorization: user.token },
        })
        .then((response) => {
          setPosts(response.data);
        });
    };
    getPosts();
  }, [user.token]);
  return (
    <FeedContainer>
      <PostForm />
      <Title>Fil d'actualité :</Title>
      <FeedWrapper>
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </FeedWrapper>
    </FeedContainer>
  );
}
