import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import styled from "styled-components";
import colors from "../../utils/style/colors";
import defaultProfileImg from "../../utils/images/noAvatar.png";
import groupomaniaLogo from "../../utils/images/logo.png";
import LogoutIcon from "@mui/icons-material/Logout";
import { logoutCall } from "../../context/apiCalls";

// Composants
const TopBarContainer = styled.div`
  display: flex;
  opacity:0.9;
  width: 100%;
  height: 100px;
  top: 0;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  z-index: 999;
  background-color: white;
  border-bottom: 3px solid ${colors.tertiary};
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  max-height: 100%;
  max-width: 250px;
`;

const Logo = styled.img`
  width: 100%;
  height: 100%;
`;

const LogoutContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  max-width: 400px;
  margin-right: 20px;
`;

const Logout = styled(LogoutIcon)`
  color: ${colors.tertiary};
  scale: 0.8;
  &:hover {
    cursor: pointer;
    color: ${colors.primary};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  max-width: 300px;
  font-size: 20px;
  color: ${colors.primary};
`;

const ProfileImg = styled.img`
  height: 50px;
  width: 50px;
  border-radius: 50%;
  margin-right: 20px;
  margin-left: 20px;
  box-shadow: 2px 2px 10px ${colors.tertiary};
`;

export default function TopBar() {
  const { user, dispatch } = useContext(AuthContext);
  const handleLogout = (e) => {
    e.preventDefault();
    logoutCall(dispatch);
  };

  return (
    <TopBarContainer>
      <LogoContainer>
        <Logo src={groupomaniaLogo} alt="groupomania_logo" />
      </LogoContainer>
      {user && (
        <>
          <LogoutContainer>
            <UserInfo>
              {user.currentUser.username}
              <ProfileImg src={defaultProfileImg} alt="profile_image" />
            </UserInfo>
            <Logout onClick={handleLogout} />
          </LogoutContainer>
        </>
      )}
    </TopBarContainer>
  );
}
