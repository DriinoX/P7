import axios from "axios";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import colors from "../../utils/style/colors";
import logo from "../../utils/images/logo.png";

// Composants
const RegisterContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 40px;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  width:80%;
  row-gap: 25px;
  padding: 25px;
  border-radius: 10px;
  border:1px solid ${colors.primary};
  box-shadow: lightgrey 3px 5px 5px;
`;

const Title = styled.h2`
  margin: 0 auto;
  color: ${colors.tertiary};
  text-decoration: underline;
  text-decoration-color: ${colors.primary};
`;

const Infos = styled.h4`
  display: flex;
  width: 50%;
  color: ${colors.tertiary};
  margin: 10px 0;
`;

const ErrorMsg = styled.p`
  color: red;
  font-size: 18px;
  margin: 0 auto;
`;

const Label = styled.label`
  color: ${colors.tertiary};
  font-size: 20px;
  font-style: italic;
  text-decoration: underline;
  text-decoration-color: ${colors.primary};
`;

const Input = styled.input`
  height: 25px;
  border: 2px solid ${colors.tertiary};
  border-radius: 12px;
  padding-left:10px;
  ::placeholder {
    text-align: left;
    opacity: 0.7;
  }
  &:focus {
    outline: none;
    border: 2px solid ${colors.primary};
  }
`;

const Button = styled.button`
  height: 50px;
  width: 40%;
  margin: 10px auto 0 auto;
  background-color: ${colors.secondary};
  color: ${colors.tertiary};
  border: 0;
  border-radius: 25px;
  box-shadow: ${colors.tertiary} 1px 1px 5px;
  font-size: large;
  &:hover {
    font-weight: bolder;
    box-shadow: ${colors.tertiary} 1px 3px 10px;
  }
`;

function Register() {
  const navigate = useNavigate();
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  const [errorFormMsg, setErrorFormMsg] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password.current.value !== confirmPassword.current.value) {
      confirmPassword.current.setCustomValidity(
        "Les mots de passe doivent être identiques"
      );
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post(
          `http://localhost:3002/api/auth/signup`,
          user
        );
        navigate("/login");
      } catch (error) {
        setErrorFormMsg(error.response.data);
      }
    }
  };

  return (
    <RegisterContainer>
      <LogoContainer>
        <img src={logo} alt="" />
      </LogoContainer>
      <FormContainer onSubmit={handleSubmit}>
        <Title>S'ENREGISTRER</Title>
        {errorFormMsg && <ErrorMsg>{errorFormMsg} </ErrorMsg>}
        <Label>Nom d'utilisateur : *</Label>
        <Input
          type="text"
          required
          placeholder="Votre nom d'utilisateur"
          ref={username}
        />
        <Label>E-mail : *</Label>
        <Input
          type="email"
          required
          placeholder="groupomania@gmail.com"
          ref={email}
        />
        <Label>Mot de passe : *</Label>
        <Input
          type="password"
          required
          placeholder="Votre Mot de Passe"
          ref={password}
        />

        <Label>Confirmer le mot de passe : *</Label>
        <Input
          type="password"
          required
          placeholder="Confirmez votre Mot de Passe"
          ref={confirmPassword}
        />
        <Infos>* ces champs sont obligatoire</Infos>
        <Button
          type="submit"
          disabled={!username || !email || !password || !confirmPassword}
        >
          Enregistrer
        </Button>
      </FormContainer>
    </RegisterContainer>
  );
}

export default Register;
