import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuItemProps } from "semantic-ui-react";
import decode from "jwt-decode";

export interface DecodedToken {
  sub: string;
  exp: number;
  iat: number;
  username : string
}

function MenuItem() {
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = React.useState<string>(path);

  const handleItemClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    data: MenuItemProps
  ): void => setActiveItem(data.name || "");
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const [user, setUser] = React.useState({
    username : ""
  })
  React.useEffect(() => {
    if (token) {
      const decodedToken = decode(token) as DecodedToken;
      setUser(decodedToken)
      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }
  }, []);

  return token ? (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item name={user.username || "Home"} active as={Link} to="/" />

      <Menu.Menu position="right">
        <Menu.Item name="logout" onClick={logout} />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />
      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
        <Menu.Item
          name="register"
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </Menu>
  );
}

export default MenuItem;
