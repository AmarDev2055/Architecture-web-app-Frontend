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
import { Avatar, Dropdown, Layout, Menu, Drawer, Modal } from "antd";
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
  const { Header, Content, Sider, Footer } = Layout;
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("banner");
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true); // Auto-collapse on mobile
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    setMobileDrawerVisible(false); // Close mobile drawer on menu selection
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

  const handleLogoutConfirm = () => {
    setLogoutModalVisible(false);
    handleSignOut(navigate);
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={() => setChangePasswordVisible(true)}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <KeyOutlined style={{ marginRight: "8px" }} />
          <span>Change Password</span>
        </div>
      </Menu.Item>
      <Menu.Item onClick={() => setLogoutModalVisible(true)}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <LogoutOutlined style={{ marginRight: "8px" }} />
          <span>Logout</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="dashboard">
      {/* Desktop Sider */}
      {!isMobile && (
        <Sider
          width={250}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          trigger={null}
          className="desktop-sider"
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
      )}

      {/* Mobile Drawer - Same background as desktop sidebar */}
      <Drawer
        placement="left"
        onClose={() => setMobileDrawerVisible(false)}
        open={mobileDrawerVisible}
        closable={false}
        className="mobile-drawer"
        width={250}
        styles={{ 
          body: { 
            padding: 0, 
            background: "#2b2b5a" // Same as desktop sidebar
          } 
        }}
      >
        <Link to="/" className="dashboard-logo">
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
      </Drawer>

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
              onClick={() => {
                if (isMobile) {
                  setMobileDrawerVisible(!mobileDrawerVisible);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
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
        <Footer style={{ textAlign: "center", background: "#f0f2f5", padding: "16px 50px" }}>
          © 2026 Nepal Designers and Builders. All rights reserved.
        </Footer>
      </Layout>
      <EditProfile
        visible={changePasswordVisible}
        onCancel={() => setChangePasswordVisible(false)}
      />
      <Modal
        title="Confirm Logout"
        open={logoutModalVisible}
        onOk={handleLogoutConfirm}
        onCancel={() => setLogoutModalVisible(false)}
        okText="Logout"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </Layout>
  );
};

export default DashboardContainer;
