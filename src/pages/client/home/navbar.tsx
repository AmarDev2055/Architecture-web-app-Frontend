import { Button, Drawer, Layout } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RouteList } from "../../../routes/routeList";
// import Logo from "../../../assets/images/Nepal-Designers-Builders-Logo.png";
import Logo from "../../../assets/images/LogoNew.png";
import {
  MenuOutlined,
  WhatsAppOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
// import { isAuthenticated } from "../../../API/auth";
import fb from "../../../assets/svg/facebook.svg";
import yt from "../../../assets/svg/youtube.svg";
import ld from "../../../assets/svg/linkedin.svg";
import ig from "../../../assets/svg/instagram.svg";
import tk from "../../../assets/svg/tiktok.svg";
import up from "../../../assets/svg/upwork.svg";
import x from "../../../assets/svg/x.svg";
import bm from "../../../assets/svg/Buildmost.png";
import { FaPhoneAlt } from "react-icons/fa";

const { Header } = Layout;
const NavbarComponent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(!visible);
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-content">
            <div className="contact-info">
              <a href="tel:+015926740">
                <FaPhoneAlt />
                +01-5926740
              </a>
              <a href="https://wa.me/9779701364188" target="_blank">
                <WhatsAppOutlined />
                +977-9701364188
              </a>
              <a href="mailto:ndb.officials.ndb@gmail.com">
                <MailOutlined /> ndb.officials.ndb@gmail.com
              </a>
              <span>
                <EnvironmentOutlined /> Samakhusi-26, Kathmandu
              </span>
            </div>
            <div className="social-links">
              <span>Find us In : </span>
              <a
                href="https://www.facebook.com/profile.php?id=100084983644282"
                className="facebook"
                target="_blank"
              >
                <img src={fb} alt="facebook"></img>
              </a>
              <a
                href="https://www.instagram.com/nepaldesignerss/"
                className="Instagram"
                target="_blank"
              >
                <img src={ig} alt="Instagram"></img>
              </a>
              <a
                href="https://www.linkedin.com/company/89506724/admin/dashboard/"
                className="linkedin"
                target="_blank"
              >
                <img src={ld} alt="Linkedin"></img>
              </a>
              <a
                href="https://www.youtube.com/@nepaldesignersandbuilders"
                className="Youtube"
                target="_blank"
              >
                <img src={yt} alt="Youtube"></img>
              </a>
              <a
                href="https://www.tiktok.com/@nepal_designers_builders"
                className="Tiktok"
                target="_blank"
              >
                <img src={tk} alt="Tiktok"></img>
              </a>
              <a
                href="https://www.upwork.com/freelancers/~01d3a235158e98bbbe"
                className="Upwork"
                target="_blank"
              >
                <img src={up} alt="Upwork"></img>
              </a>
              <a
                href="https://x.com/nepaldesigners"
                className="X"
                target="_blank"
              >
                <img src={x} alt="X"></img>
              </a>
              <a
                href="https://www.buildmost.com/design_provider/design_provider_interior_109900_109078.html?designType=DESIGNTYPE_HARD"
                className="X"
                target="_blank"
              >
                <img src={bm} alt="X"></img>
              </a>
            </div>
          </div>
        </div>
      </div>

      <Header className="header">
        <div className="container">
          <div className="header-wrapper">
            <div className="header-logo">
              <Link to="/" onClick={scrollToTop}>
                <img src={Logo} alt="Nepal Designers and Builders Logo" />
              </Link>
            </div>

            <ul className="header-list">
              {RouteList.map((route) => (
                <li key={route.label} className="menuButtonListDesk">
                  <Link to={route.path} onClick={scrollToTop}>
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="auth-section">
              <Link to="/about#contact-us">
                <Button className="navbar-contact-button" size="large" ghost>
                  Contact Us
                </Button>
              </Link>
              <Button className="menuButton" type="text" onClick={showDrawer}>
                <MenuOutlined />
              </Button>
            </div>
          </div>
        </div>

        <Drawer
          placement="right"
          onClose={showDrawer}
          visible={visible}
          style={{ zIndex: 99999 }}
        >
          <ul className="header-list-mobile">
            {RouteList.map((route) => (
              <li key={route.label}>
                <Link
                  to={route.path}
                  onClick={() => {
                    scrollToTop();
                    setVisible(false); // This closes the Drawer
                  }}
                >
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>

          <hr className="mobile-divider" />
          <div className="top-barr mobile-top-bar">
            <h1>Contact Us</h1>
            <div className="contact-information">
              <a className="con" href="tel:+9779851340040">
                <FaPhoneAlt /> +977-9851340040
              </a>
              <a className="con" href="tel:+9779851356590">
                <WhatsAppOutlined />
                9851356590
              </a>
              <a className="con" href="mailto:contact@ndnb.com.np">
                <MailOutlined /> contact@ndnb.com.np
              </a>
              <span className="con">
                <EnvironmentOutlined /> Kalanki, Kathmandu
              </span>
            </div>
            <div className="social-links">
              <a
                href="https://www.facebook.com/profile.php?id=100084983644282"
                target="_blank"
              >
                <img src={fb} alt="facebook" />
              </a>
              <a
                href="https://www.instagram.com/nepaldesignerss/"
                target="_blank"
              >
                <img src={ig} alt="Instagram" />
              </a>
              <a
                href="https://www.linkedin.com/company/89506724/admin/dashboard/"
                target="_blank"
              >
                <img src={ld} alt="Linkedin" />
              </a>
              <a
                href="https://www.youtube.com/@nepaldesignersandbuilders"
                target="_blank"
              >
                <img src={yt} alt="Youtube" />
              </a>
              <a
                href="https://www.tiktok.com/@nepal_designers_builders"
                target="_blank"
              >
                <img src={tk} alt="Tiktok" />
              </a>
              <a
                href="https://www.upwork.com/freelancers/~01d3a235158e98bbbe"
                target="_blank"
              >
                <img src={up} alt="Upwork" />
              </a>
              <a href="https://x.com/nepaldesigners" target="_blank">
                <img src={x} alt="X" />
              </a>
              <a
                href="https://www.buildmost.com/design_provider/design_provider_interior_109900_109078.html?designType=DESIGNTYPE_HARD"
                target="_blank"
              >
                <img src={bm} alt="Buildmost" />
              </a>
            </div>
          </div>
        </Drawer>
      </Header>
    </>
  );
};

export default NavbarComponent;
