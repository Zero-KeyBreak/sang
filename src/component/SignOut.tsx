import { Component, ReactNode } from "react";
import { DownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Menu } from "antd";
import "../css/SignOut.css";

interface Props {}
interface State {
  isLoggedIn: boolean;
}

class SignOut extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const jsonUser = localStorage.getItem("isLoggedIn");
    const user = jsonUser ? JSON.parse(jsonUser) : null;

    this.state = {
      isLoggedIn: !!user,
    };
  }

  handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    this.setState({ isLoggedIn: false });
    window.location.reload();
    alert("Đăng Xuất Thành Công");
  };

  render(): ReactNode {
    const menu = (
      <Menu>
        <Menu.Item key="logout" onClick={this.handleLogout} icon={<LogoutOutlined />}>
          Đăng Xuất
        </Menu.Item>
      </Menu>
    );

    return (
      <div className="header-container">
        <p className="title1">Bee-Bee</p>
        <Dropdown overlay={menu} trigger={["click"]}>
          <div className="sign-out">
            <Avatar size={40} icon={<UserOutlined />} />
            <p className="username">Admin</p>
            <DownOutlined className="dropdown-icon" />
          </div>
        </Dropdown>
      </div>
    );
  }
}

export default SignOut;
