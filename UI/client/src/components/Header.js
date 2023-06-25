import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Icon, Menu, Image, Input } from "semantic-ui-react";
import Avatar from "react-avatar";
import "../components/styles/common.css";

import { AuthContext } from "../context/auth";
function Header() {
  const { user, logout } = useContext(AuthContext);
  const pathName = window.location.pathname;
  const path = pathName === "/" ? "home" : pathName.substr(1);

  const [activeItem, setActiveItem] = useState(path);
  const handleItemClick = (e, { name }) => setActiveItem(name);

  return user ? (
    <Menu icon tabular className="header-container">
      <Container text>
        <Menu.Menu position="left">
          <Menu.Item
            name="fitbook"
            active={activeItem === ""}
            onClick={handleItemClick}
            as={Link}
            to="/game"
          >
            <div>
              <h2>Authenticator</h2>
            </div>
          </Menu.Item>

          {/* <Menu.Item>
        <Input icon='search' placeholder='Search...' /> 
        </Menu.Item> */}
        </Menu.Menu>
        <Menu.Menu position="right">
          {/* <Menu.Item
            name="home"
            active={activeItem === "home"}
            onClick={handleItemClick}
            as={Link}
            to="/game"
          >
            <Icon name="home" size="large" />
          </Menu.Item> */}
          {/* <Menu.Item
            name="ranking"
            active={activeItem === "ranking"}
            onClick={handleItemClick}
            as={Link}
            to="/ranking"
          >
            <Icon name="gamepad" size="large" />
          </Menu.Item> */}

          {/* <Menu.Item
            name="invite"
            active={activeItem === "invite"}
            onClick={handleItemClick}
            as={Link}
            to="/invite"
          >
            <Icon name="share alternate" size="large" />
          </Menu.Item> */}

          {/* <Menu.Item
            name="heart"
            active={activeItem === "heart"}
            onClick={handleItemClick}
            // as={Link}
            // to='/game'
          >
            <Icon name="heart outline" size="large" />
          </Menu.Item> */}

          <Menu.Item
            name="profile"
            active={activeItem === "profile"}
            onClick={logout}
            as={Link}
            to="/"
          >
            {/* <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' size="mini" circular/> */}
            <Avatar name={user.username} size="35" round={true} color="black" />
          </Menu.Item>
        </Menu.Menu>
      </Container>
    </Menu>
  ) : null;
}

export default Header;
