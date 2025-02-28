import { Link, Navigate, Outlet } from "react-router-dom";
import { Layout, Menu, ConfigProvider } from "antd";
import { RestOutlined ,UserOutlined,ShoppingCartOutlined,CustomerServiceOutlined,SettingOutlined } from "@ant-design/icons";
import Out from "./component/SignOut";
import Logo from "./component/Logo";
import React, { Component, CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBurger, faPizzaSlice, faDrumstickBite,faCookie,faMoneyBillTrendUp  } from "@fortawesome/free-solid-svg-icons";

interface Props {}
interface State {
  collapsed: boolean;
  username: string;
  password: string;
  isLoggedIn: boolean;
}
export interface CurrentUser {
  username: string;
  password: string;
}

interface CustomMenuItem {
  key: string;
  label: string;
  icon?: any;
  href?: string;
  children?: CustomMenuItem[];
}

const { Header, Sider } = Layout;

const headerStyle: CSSProperties = {
  textAlign: "center",
  height: 64,
  lineHeight: "64px",
  background: "#0f0431",
};

const layoutStyle: CSSProperties = {
  overflow: "hidden",
  width: "100%",
  height: "100vh",
};

// Cấu hình màu cho Menu
const customTheme = {
  components: {
    Menu: {
      colorBgContainer: "#f6d7d7", // Đổi màu nền Menu
      colorItemText: "#333", // Đổi màu chữ Menu
      colorItemTextSelected: "#ff4d4f", // Đổi màu chữ khi được chọn
      colorItemBgSelected: "#e8bcbc", // Màu nền khi chọn
    },
  },
};

const items: CustomMenuItem[] = [
 
  {
    key: "item01",
    label: "Quản lý sản phẩm",
    icon: <ShoppingCartOutlined /> ,
    children: [
      {
        key: "item02",
        label: "Đồ Ăn Chính",
        href: "/page/DoAn",
        icon: <FontAwesomeIcon icon={faBurger} />,
      },
      {
        key: "item03",
        label: "Nước Uống",
        href: "/page/NuocUong",
        icon: <RestOutlined />,
      },
      {
        key: "item04",
        label: "Món Chán Miệng",
        href: "/page/MonChanMieng",
        icon: <FontAwesomeIcon icon={faCookie} />,
      },
    ],
  },
  {
    key: "item05",
    label: "Hệ Thống Quản Lý",
    icon: <SettingOutlined />,
    children: [
      {
        key: "item06",
        label: "Quản Lý Nhân Viên",
        href: "/page/NhanVien",
        icon:  <UserOutlined />,
      },
      {
        key: "item07",
        label: "Quản Lý Đơn Đặt",
        href: "/page/DonHang",
        icon: <FontAwesomeIcon icon={faMoneyBillTrendUp} />,
      },
    ],
  },
  {
    key: "item09",
    label: "Khách Hàng",
    href: "/page/KhachHang",
    icon:<CustomerServiceOutlined />,
  },
];

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const jsonUser: string | null = localStorage.getItem("isLoggedIn");
    const user: CurrentUser = jsonUser !== null && JSON.parse(jsonUser);

    this.state = {
      collapsed: false,
      username: "",
      password: "",
      isLoggedIn: user.username === "admin" && user.password === "123",
    };
  }

  onCollapse = (collapsed: boolean) => {
    this.setState({ collapsed });
  };

  renderMenuItems = (items: CustomMenuItem[]) => {
    return items.map((item) => {
      if (item.children) {
        return (
          <Menu.SubMenu key={item.key} title={item.label} icon={item.icon}>
            {this.renderMenuItems(item.children)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item key={item.key} icon={item.icon}>
          <Link to={item.href || "#"}>{item.label}</Link>
        </Menu.Item>
      );
    });
  };

  render() {
    return this.state.isLoggedIn ? (
      <ConfigProvider theme={customTheme}>
        <Layout style={layoutStyle}>
        <Sider width={236} style={{ background: "#f6d7d7" }}>
        <Logo /> {/* Hiển thị logo trên sidebar */}
        <Menu mode="inline" defaultSelectedKeys={["item01"]}>
        {this.renderMenuItems(items)}
        </Menu>
        </Sider>
          <Layout>
            <Header style={headerStyle}>
              <Out />
            </Header>
            <Outlet />
          </Layout>
        </Layout>
      </ConfigProvider>
    ) : (
      <Navigate to="/" />
    );
  }
}

export default App;
