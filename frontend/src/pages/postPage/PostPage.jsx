import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import styled from "styled-components";
import { Link } from "react-router-dom";

import colors from "../../utils/style/colors";
import {
  FormWrapper,
  Label,
  FileInput,
  CancelImg,
  TextArea,
  Button,
} from "../../components/postform/PostForm";
import { PostText } from "../../components/post/Post";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import { useNavigate, useParams } from "react-router-dom";

const PostFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 15px;
  width: 90%;
  max-width: 700px;
  padding:15px;
  margin: 20px auto 50px;
  background-color: whitesmoke;
  border-radius: 10px;
  border:1px solid ${colors.primary};
  box-shadow: 3px 5px 5px ${colors.secondary};
`;

const PostFormImgContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 200px;
  width:70%;
  padding: 0 20px 10px 20px;
  margin: 0 auto;
  position: relative;
`;

const PostFileImg = styled.img`
  border-radius: 10px;
  height:auto;
  width: 70%;
  object-fit: cover;
`;

const Title = styled.h2`
  display: flex;
  width: 100%;
  justify-content: center;
  margin: 50px 0 50px;
  color: ${colors.tertiary};
`;

const ReturnIcon = styled(Link)`
  display: flex;
  align-items: center;
  column-gap: 25px;
  font-size: 25px;
  text-decoration:underline;
  text-decoration-color:${colors.primary};
  color: ${colors.tertiary};
  margin: 25px 0 0 25px;
  &:hover {
    cursor: pointer;
    color: ${colors.primary};
  }
`;

export default function PostPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [postFile, setPostFile] = useState("");
  const [file, setFile] = useState("");

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get(
        `http://localhost:3002/api/posts/${id}`,
        {
          headers: { Authorization: user.token },
        }
      );
      setPostFile(res.data.image);
      setMessage(res.data.message);
    };
    getPost();
  }, [id, user]);

  const handleUpdate = async (e) => {
    const newFile = file ? file : "";
    e.preventDefault();
    const formData = new FormData();
    formData.append("userId", user.currentUser.userId);
    formData.append("image", newFile);
    formData.append("message", message);

    await axios.put(
      `http://localhost:3002/api/posts/${id}`,
      formData,
      {
        headers: {
          Authorization: user.token,
        },
      }
    );
    navigate("/");
  };

  return (
    <FormWrapper>
      <ReturnIcon to="/">
        Retour
      </ReturnIcon>
      <Title>Modifiez votre Post :</Title>
      <PostFormContainer onSubmit={handleUpdate}>
        {postFile ? (
          <>
            <PostText>Image actuelle</PostText>
            <PostFormImgContainer>
              <PostFileImg src={postFile} />
            </PostFormImgContainer>
          </>
        ) : (
          ""
        )}
        {file && (
          <>
            <PostText>Nouvelle image</PostText>
            <PostFormImgContainer>
              <PostFileImg src={URL.createObjectURL(file)} alt="post_image" />
              <CancelImg
                onClick={() => {
                  setFile("");
                  setPostFile(postFile);
                }}
              />
            </PostFormImgContainer>
          </>
        )}
        <Label htmlFor="file">
          Modifier image :
          <PermMediaIcon htmlColor={`${colors.primary}`} />
          <FileInput
            type="file"
            id="file"
            accept=".png,.jpg,.jpeg"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Label>
        <Label htmlFor="message">Modifier message :</Label>
        <TextArea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></TextArea>
        <Button>VALIDER</Button>
      </PostFormContainer>
    </FormWrapper>
  );
}
