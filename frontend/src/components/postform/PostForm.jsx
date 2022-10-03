import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import styled from "styled-components";
import colors from "../../utils/style/colors";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";

// Composants
export const FormWrapper = styled.div`
  padding: 10px;
`;

const PostFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 15px;
  width: 90%;
  margin: 20px auto 50px;
  background-color: whitesmoke;
  border-radius: 10px;
  border:1px solid ${colors.primary};
  box-shadow: 3px 5px 5px ${colors.secondary};
`;

export const Label = styled.label`
  display: flex;
  padding:15px 15px 0px 15px;
  align-items: center;
  column-gap: 15px;
  color: ${colors.tertiary};
  font-size: 20px;
  font-style: italic;
`;

export const FileInput = styled.input`
  display: none;
`;

const PostFormImgContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 150px;
  padding: 0 20px 10px 20px;
  margin: 0 auto;
  position: relative;
`;

const PostFileImg = styled.img`
  border-radius: 10px;
  width: 150px;
  object-fit: cover;
`;

export const CancelImg = styled(CancelIcon)`
  color: ${colors.tertiary};
  position: absolute;
  top: 5px;
  right: 25px;
  cursor: pointer;
  opacity: 0.7;
`;

export const TextArea = styled.textarea`
  display: flex;
  flex-wrap: wrap;
  align-self: center;
  height:100px;
  width: 90%;
  padding: 5px 5px 5px 10px;
  border: solid 2px ${colors.tertiary};
  border-radius: 10px;
  resize: none;
  &:focus {
    outline: none;
  }
`;

export const Button = styled.button`
  height: 35px;
  width: 25%;
  margin: 15px auto 15px auto;
  background-color: ${colors.secondary};
  color: ${colors.primary};
  border: 0;
  border-radius: 25px;
  box-shadow: ${colors.tertiary} 2px 2px 5px;
  font-size: large;
  &:hover {
    cursor: pointer;
    box-shadow: 5px 5px 8px ${colors.tertiary};
    background-color: ${colors.primary};
    color: white;
  }
`;

export default function PostForm() {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { userId, username } = user.currentUser;
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("username", username);
    formData.append("image", file);
    formData.append("message", message);

    await axios.post(`http://localhost:3002/api/posts`, formData, {
      headers: { Authorization: currentUser.token },
    });
    setMessage("");
    setFile(null);
    window.location.reload();
  };

  return (
    <FormWrapper>
      <PostFormContainer onSubmit={handleFormSubmit}>
        {file && (
          <PostFormImgContainer>
            <PostFileImg src={URL.createObjectURL(file)} alt="post_img" />
            <CancelImg onClick={() => setFile(null)} />
          </PostFormImgContainer>
        )}
        <Label htmlFor="file">
          Ajouter une image :
          <PermMediaIcon htmlColor={`${colors.primary}`} />
          <FileInput
            type="file"
            id="file"
            accept=".png,.jpeg,jpg"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Label>
        <Label>Message :</Label>
        <TextArea
          name="message"
          value={message}
          required
          placeholder="Votre message"
          onChange={(e) => setMessage(e.target.value)}
        ></TextArea>
        <Button>PUBLIER</Button>
      </PostFormContainer>
    </FormWrapper>
  );
}
