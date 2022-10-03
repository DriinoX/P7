import React, { useRef, useContext } from "react";
import { loginCall } from "../../context/apiCalls";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../utils/images/logo.png";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";
import colors from "../../utils/style/colors";

// Composants
const LoginContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  color: ${colors.tertiary};
  text-align:center;
  width: 80%;
  margin: 0px auto 20px auto;
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
  margin: 25px auto 0 auto;
  background-color: ${colors.secondary};
  color: ${colors.tertiary};
  border: 0;
  border-radius: 25px;
  box-shadow: ${colors.tertiary} 2px 2px 5px;
  font-size: large;
  &:hover {
    font-weight: bolder;
    box-shadow: ${colors.tertiary} 1px 3px 10px;
  }
`;

const RegisterLink = styled(Link)`
  color: ${colors.primary};
  text-decoration: underline;
`;

function Login() {
  const email = useRef();
  const password = useRef();
  const { isFetching, dispatch } = useContext(AuthContext);
  const handleLogin = (event) => {
    event.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

  return (
    <LoginContainer>
      <LogoContainer>
        <img src={logo} alt="logo_groupomania" />
      </LogoContainer>
      <FormContainer onSubmit={handleLogin}>
        <Title>SE CONNECTER</Title>
        <Label>E-mail : </Label>
        <Input
          type="email"
          required
          placeholder="groupomania@gmail.com"
          ref={email}
        />
        <Label>Mot de passe : </Label>
        <Input
          type="password"
          required
          placeholder="Votre mot de passe"
          ref={password}
        />
        <Button disabled={isFetching}>
          {isFetching ? <CircularProgress /> : "Connection"}
        </Button>
        <Infos>
          <RegisterLink to="/register">Créer un compte.</RegisterLink>
        </Infos>
      </FormContainer>
    </LoginContainer>
  );
}

export default Login;
