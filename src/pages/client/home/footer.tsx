// Footer.js
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "../../../assets/images/ndbn-logo-white.png";
import AppStore from "../../../assets/svg/app-store.svg";
import PlayStore from "../../../assets/svg/google-play.svg";
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
const Footer = () => {
  return (
    <div className="pg-footer">
      <footer className="footer">
        <svg
          className="footer-wave-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
        ></svg>
        <div className="footer-content">
          <div className="footer-content-column">
            <div className="footer-logo">
              <a className="footer-logo-link" href="/" onClick={scrollToTop}>
                <span className="hidden-link-text">LOGO</span>
                <img
                  src={Logo}
                  alt="Your Company Logo"
                  className="footer-logo-image"
                />
              </a>
            </div>

            <div className="footer-menu">
              {/* <h4>“नेपालभर नक्सादेखि निर्माणसम्म”</h4> */}
              <h4 className="footer-breif">
                We don't only build structure, we build trust and shape your
                future, join us we definitely add value to your goal.
              </h4>
            </div>
          </div>
          <div className="footer-content-column">
            <div className="footer-menu">
              <h2 className="footer-menu-name"> Location</h2>
              <ul id="menu-company" className="footer-menu-list">
                <li className="menu-item menu-item-type-post_type menu-item-object-page">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      style={{ color: "#b64141" }}
                    />
                    <a
                      href="https://maps.app.goo.gl/LN6fCUCPy35TP9T7A"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Samakhhusi - 26, Kathmandu Nepal{" "}
                    </a>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      style={{ color: "#b64141" }}
                    />
                    <a
                      href="https://maps.app.goo.gl/jpNi19cYnmC7ADdWA"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Jhapa, Birtamod
                    </a>
                  </div>
                </li>
              </ul>
            </div>
            <div className="footer-menu">
              <h2 className="footer-menu-name"> Legal</h2>
              <ul id="menu-legal" className="footer-menu-list">
                <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-privacy-policy menu-item-170434">
                  <a href="#">Privacy Notice</a>
                </li>
                <li className="menu-item menu-item-type-post_type menu-item-object-page">
                  <a href="#">Terms of Use</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-content-column">
            <div className="footer-menu">
              <h2 className="footer-menu-name"> Quick Links</h2>
              <ul id="menu-quick-links" className="footer-menu-list">
                <li className="menu-item menu-item-type-post_type menu-item-object-page">
                  <a href="/about">About Us</a>
                </li>
                <li className="menu-item menu-item-type-post_type menu-item-object-page">
                  <a href="/projects">Our Projects</a>
                </li>
                <li className="menu-item menu-item-type-taxonomy menu-item-object-category">
                  <a href="/services">Our Services</a>
                </li>
                <li className="menu-item menu-item-type-post_type menu-item-object-page">
                  <a href="/blogs">By Laws & Info</a>
                </li>
                <div className="app-store-buttons">
                  <a
                    href="https://apps.apple.com/np/app/nepal-designers-builders-ndb/id6743044434"
                    className="app-store-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={AppStore}
                      alt="Download on App Store"
                      className="app-store-image"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.theyetilabs.enirman.ndb&pli=1"
                    className="app-store-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={PlayStore}
                      alt="Get it on Google Play"
                      className="app-store-image"
                    />
                  </a>
                </div>
              </ul>
            </div>
          </div>

          <div className="footer-content-column">
            <div className="footer-call-to-action">
              <h2 className="footer-call-to-action-title"> Let's Chat</h2>
              <p className="footer-call-to-action-description">
                Have a support question?
              </p>
              <a
                className="footer-call-to-action-button button"
                href="/about#contact-section"
                target="_self"
              >
                Get in Touch
              </a>
            </div>
            <div className="footer-call-to-action">
              <h2 className="footer-call-to-action-title">Contact Us</h2>
              <p className="footer-call-to-action-link-wrapper">
                <a
                  className="footer-call-to-action-link"
                  href="tel:+977-9701364188"
                  target="_self"
                >
                  <FontAwesomeIcon
                    icon={faPhone}
                    style={{ color: "#b64141" }}
                  />{" "}
                  +977-9701364188
                </a>
                <a
                  className="footer-call-to-action-link"
                  href="mailto:contact@ndnb.com.np"
                  target="_self"
                >
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    style={{ color: "#b64141" }}
                  />{" "}
                  contact@ndnb.com.np
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="footer-copyright">
          <div className="footer-copyright-wrapper">
            <p className="footer-copyright-text">
              <a className="footer-copyright-link" href="#" target="_self">
                ©{new Date().getFullYear()}. | Nepal Designers & Builders. | All
                rights reserved.
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
