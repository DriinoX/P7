import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import colors from "../../utils/style/colors";
import errorLogo from "../../utils/images/logo_error_page.jpg";

// Composants
const ErrorImg = styled.img`
  display: flex;
  max-height: 500px;
  max-width: 50%;
  margin: 0 auto 50px;
`;

const Title = styled.h1`
  text-align: center;
  color: ${colors.tertiary};
  margin-bottom: 20px;
`;

const ReturnHome = styled.h2`
  text-align: center;
  color: ${colors.tertiary};
`;

const HomeLink = styled(Link)`
  color: ${colors.primary};
  margin-left: 10px;
  :hover {
    font-size: 25px;
    text-shadow: 4px 4px 15px ${colors.primary};
  }
`;

const ErrorPage = () => {
  return (
    <>
      <ErrorImg src={errorLogo} alt="error_image" />
      <Title>Page introuvable !</Title>
      <ReturnHome>
        Retourner vers la
        <HomeLink to="/">Page d'accueil</HomeLink>
      </ReturnHome>
    </>
  );
};

export default ErrorPage;
