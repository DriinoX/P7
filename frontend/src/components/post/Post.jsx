import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../utils/date/localeDate";
import axios from "axios";
import styled from "styled-components";
import colors from "../../utils/style/colors";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import defaultProfileImg from "../../utils/images/noAvatar.png";

// Composants
const PostContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  row-gap: 15px;
  align-items: center;
  justify-content: center;
  width: 90%;
  min-height: 180px;
  margin: 0 auto 50px auto;
  padding: 15px;
  background-color: whitesmoke;
  border: 2px solid ${colors.secondary};
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 3px 5px 5px lightgrey;
`;

const PostImgContainer = styled.div`
  display: flex;
  width: 100%;
  height: 300px;
  margin-top: 15px;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid ${colors.secondary};
`;

const PostImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PostMessageContainer = styled.div`
  display: flex;
  width: 95%;
  height: 40%;
  padding: 5px 15px;
  border-radius: 5px;
  margin-top:20px;
  color: ${colors.tertiary};
  font-size: 18px;
`;

export const PostText = styled.p`
  display: flex;
  width: 100%;
  align-items:center;
  justify-self: flex-start;
  font-style: italic;
  font-weight: 500;
  font-size: 24px;
  color: ${colors.primary};
`;

const PostInfosContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 30px;
  margin-bottom: 15px;
  color: ${colors.tertiary};
  font-size: 18px;
  border-top: 1px solid grey;
  padding-top: 20px;
`;

const LikesContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  margin-left: 10px;
`;

const LikePost = styled(ThumbUpIcon)`
  display: flex;
  scale: 1;
  margin-right: 10px;
  &:hover {
    cursor: pointer;
    color: ${colors.secondary};
  }
`;

const PostOptions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 55px;
`;

const ModifyPost = styled(EditIcon)`
  color: ${colors.tertiary};
  scale: 1;
  &:hover {
    cursor: pointer;
    color: ${colors.secondary};
  }
`;

const DeletePost = styled(DeleteIcon)`
  color: ${colors.tertiary};
  scale: 1;
  &:hover {
    cursor: pointer;
    color: ${colors.secondary};
  }
`;

const ConfirmContainer = styled.div`
  display: flex;
  flex-wrap:wrap;
  position: absolute;
  top: 10px;
  z-index: 998;
  align-items: center;
  justify-content: space-around;
  width: 300px;
  height: 80px;
  padding: 15px;
  font-size: large;
  color: ${colors.tertiary};
  border: 2px solid ${colors.primary};
  background-color: white;
  border-radius: 5px;
`;

const ValidButton = styled.button`
  height: 30px;
  width: 30%;
  margin: 0px auto 0 auto;
  color: ${colors.primary};
  background-color: ${colors.secondary};
  border: 0;
  border-radius: 25px;
  cursor:pointer;
  box-shadow: ${colors.tertiary} 2px 2px 5px;
  font-size: 14px;
`;

const ProfileImg = styled.img`
  height: 50px;
  width: 50px;
  border-radius: 50%;
  margin-right:15px;
  box-shadow: 2px 2px 10px ${colors.tertiary};
`;

const ErrorMsg = styled.p`
  color: red;
  font-size: 18px;
  margin: 0 25px;
`;

const Post = ({ post, setPost }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [confirmBox, setConfirmBox] = useState(false);
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [likeError, setLikeError] = useState("");

  const cancelDelete = () => {
    setConfirmBox(false);
  };

  const deletePost = async () => {
    try {
      await axios.delete(
        `http://localhost:3002/api/posts/${post._id}`,
        {
          headers: {
            Authorization: user.token,
          },
        }
      );

      setConfirmBox(false);
      window.location.reload();
      setPost();
      setErrorMsg("");
    } catch (error) {
      setErrorMsg("Vous n'êtes pas autorisé à supprimé ce post !");
    }
  };

  useEffect(() => {
    setIsLiked(post.likes.includes(user.currentUser.userId));
  }, [post.likes, user]);

  const handleLike = () => {
    axios
      .post(
        `http://localhost:3002/api/posts/${post._id}`,
        user.currentUser,
        {
          headers: {
            Authorization: user.token,
          },
        }
      )
      .then((response) => {
        setLike(isLiked ? like - 1 : like + 1);
        setIsLiked(!isLiked);
      })
      .catch((error) => {
        setLikeError(error.response.data);
        setTimeout(() => {
          if (error) {
            setLikeError("");
          }
        }, 2000);
      });
  };

  return (
    <>
      <PostContainer key={post.postId}>
        {confirmBox && (
          <ConfirmContainer>
            Voulez-vous supprimer ce post ?
            <ValidButton onClick={cancelDelete}>NON</ValidButton>
            {!errorMsg ? (
              <>
                {" "}
                <ValidButton onClick={() => deletePost(post._id)}>OUI</ValidButton>
              </>
            ) : (
              <ErrorMsg>{errorMsg}</ErrorMsg>
            )}
          </ConfirmContainer>
        )}
        <PostText>
          <ProfileImg src={defaultProfileImg} alt="profile_image" />
          {post.username}
        </PostText>
        <PostMessageContainer key="postMessage">
          {post.message}
        </PostMessageContainer>
        {post.image && (
          <PostImgContainer key="postImage">
            <PostImg src={post.image} alt="image from post" />
          </PostImgContainer>
        )}
        <ErrorMsg>{likeError}</ErrorMsg>
        <PostInfosContainer key="postInfos">
          <LikesContainer>
            <LikePost color={isLiked ? "success" : ""} onClick={handleLike} />
            {like}
          </LikesContainer>
          {(post.userId === user.currentUser.userId ||
            user.currentUser.admin) && (
            <PostOptions>
              <ModifyPost
                onClick={() => {
                  navigate(`/post/${post._id}`);
                }}
              />
              <DeletePost
                onClick={() => {
                  setConfirmBox(true);
                }}
              />
            </PostOptions>
          )}
        </PostInfosContainer>
      </PostContainer>
    </>
  );
};

export default Post;
