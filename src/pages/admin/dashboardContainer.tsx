import {
  HomeOutlined,
  MessageOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  FolderAddOutlined,
  TeamOutlined,
  PlusCircleOutlined,
  KeyOutlined,
  ProjectOutlined,
  FormOutlined,
  CreditCardOutlined,
  AuditOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Menu } from "antd";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/images/ndbn-logo-white.png";
import { handleSignOut } from "../../utils";
import EditProfile from "../admin/Auth/ChangePassword";

const items = [
  {
    key: "banner",
    icon: <HomeOutlined />,
    label: "Banner Settings",
  },
  {
    key: "testimonials",
    icon: <MessageOutlined />,
    label: "Testimonial Settings",
  },
  {
    key: "Projects",
    icon: <ProjectOutlined />,
    label: "Project Settings",
    children: [
      {
        key: "projects-categories",
        icon: <FolderAddOutlined />,
        label: "Project Types",
      },
      {
        key: "projects-clients",
        icon: <TeamOutlined />,
        label: "View Clients",
      },
      {
        key: "projects-settings",
        icon: <PlusCircleOutlined />,
        label: "Projects",
      },
    ],
  },
  {
    key: "trusted-clients",
    icon: <UserOutlined />,
    label: "Trusted Clients Settings",
  },
  {
    key: "Forms",
    icon: <FormOutlined />,
    label: "Form Settings",
    children: [
      {
        key: "Client-Requirement-Form",
        icon: <AuditOutlined />,
        label: "Client Requirement Form",
      },
      {
        key: "Client-Contact-Form",
        icon: <TeamOutlined />,
        label: "Contact Us Form",
      },
    ],
  },
  {
    key: "blogs",
    icon: <CreditCardOutlined />,
    label: "Blogs Settings",
  },
];

const DashboardContainer = () => {
  const { Header, Content, Sider } = Layout;
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("banner");
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);

  useEffect(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    const parentSegment = pathSegments[pathSegments.length - 2];

    if (pathSegments.includes("projects-clients")) {
      setSelectedMenu("projects-clients");
    } else if (pathSegments.includes("projects-settings")) {
      setSelectedMenu("projects-settings");
    } else if (parentSegment === "projects") {
      setSelectedMenu(lastSegment);
    } else {
      setSelectedMenu(lastSegment || "banner");
    }
  }, [location]);

  const handleMenuChange = (e: { key: string; keyPath: string[] }) => {
    const selectedKey = e.key;
    setSelectedMenu(selectedKey);
    if (e.keyPath.includes("Projects")) {
      if (selectedKey === "projects-clients") {
        navigate(`/admin/${selectedKey}`);
      } else if (selectedKey === "projects-settings") {
        navigate(`/admin/${selectedKey}`);
      } else {
        navigate(`/admin/${selectedKey}`);
      }
    } else {
      navigate(`/admin/${selectedKey}`);
    }
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={() => setChangePasswordVisible(true)}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <KeyOutlined style={{ marginRight: "8px" }} />
          <span>Change Password</span>
        </div>
      </Menu.Item>
      <Menu.Item onClick={() => handleSignOut(navigate)}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <LogoutOutlined style={{ marginRight: "8px" }} />
          <span>Logout</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="dashboard">
      <Sider
        width={250}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        trigger={null}
      >
        <Link
          to="/"
          className={`dashboard-logo ${
            collapsed ? "dashboard-logo-collapsed" : ""
          }`}
        >
          <img src={Logo} alt="Logo" />
        </Link>
        <hr />
        <Menu
          theme="dark"
          selectedKeys={[selectedMenu]}
          mode="inline"
          items={items}
          onClick={handleMenuChange}
          className="dashboard-menu ant-layout-sider"
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: "#fff" }}>
          <div
            className="dashboard-nav"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
            }}
          >
            <div
              className="dashboard-collapse-icon"
              style={{
                marginRight: "auto",
                cursor: "pointer",
              }}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
            <span>Admin</span>
            <div>
              <Dropdown
                overlay={menu}
                trigger={["click"]}
                overlayStyle={{
                  right: "2%",
                  top: "10%",
                  width: "200px",
                }}
              >
                <a onClick={handleDropdownClick} className="icon-spacing">
                  <Avatar size={40} shape="circle" icon={<UserOutlined />} />
                </a>
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content className="dashboard-content">
          <Outlet />
        </Content>
      </Layout>
      <EditProfile
        visible={changePasswordVisible}
        onCancel={() => setChangePasswordVisible(false)}
      />
    </Layout>
  );
};

export default DashboardContainer;
