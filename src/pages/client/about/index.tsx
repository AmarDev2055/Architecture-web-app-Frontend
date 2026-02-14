import { useState, useEffect, useRef } from "react";
import { Button, Col, Form, Input, Row, Typography, message } from "antd";
import { useLocation } from "react-router-dom";
import usePostAPI from "../../../hooks/usePostAPI";
import ScrollToTop from "../../../components/client/ScrollToTop";
import { Card } from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import { apiUrl } from "../../../utils";

interface TeamMember {
  id: number;
  name: string;
  designation: string;
  order: number;
  email: string;
  contact_no: string;
  filepath: string | null;
  additionalInfo?: string;
}

const AboutUsPage = () => {
  const { TextArea } = Input;
  const { Title, Paragraph } = Typography;
  const { loading, postData } = usePostAPI("architecture-web-app/contact-us");
  const [form] = Form.useForm();
  const contactRef = useRef(null);
  const location = useLocation();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/architecture-web-app/team-members/featured`,
        );
        if (response.data && response.data.data) {
          const members: TeamMember[] = response.data.data;
          const sortedMembers = members.sort((a, b) => a.order - b.order);
          setTeamMembers(sortedMembers);
        }
      } catch (error) {
        console.error("Failed to fetch team members:", error);
      }
    };

    fetchTeamMembers();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const onFinish = async (values: any) => {
    try {
      const response = await postData(values);
      if (response) {
        // message.success("Form Submitted Successfully.");
        form.resetFields();
      }
    } catch (error) {
      console.error("Error submitting Contact Us:", error);
      message.error("Failed to send message. Please try again later.");
    }
  };

  return (
    <>
      <div className="inner-header">
        <div className="header-content">
          <h1 className="page-title">ABOUT US</h1>
          <div className="breadcrumb">
            <a href="/">HOME</a>
            <span className="separator">/</span>
            <span className="current">ABOUT US</span>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <div className="mission-card">
                <div className="section-title-wrapper">
                  <Title level={2} className="section-title">
                    Our Story
                  </Title>
                  <div className="title-decorator"></div>
                </div>
                <Paragraph className="mission-text">
                  At Nepal Designers and Builders Pvt Ltd, we are more than just
                  a construction and design firm; we are architects of dreams.
                  Our journey began with a simple yet profound vision: to blend
                  innovative design with exceptional construction quality. Based
                  in the heart of Nepal, our company has grown to become a
                  leading name in the architectural landscape of the region.
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="mission-card">
                <div className="section-title-wrapper">
                  <Title level={2} className="section-title">
                    Our Mission
                  </Title>
                  <div className="title-decorator"></div>
                </div>
                <Paragraph className="mission-text">
                  Our mission is to create spaces that not only meet the
                  aesthetic and functional needs of our clients but also stand
                  the test of time. We are driven by a commitment to excellence,
                  sustainability, and client satisfaction. Every project,
                  regardless of its size, receives the same level of meticulous
                  attention and dedication.
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="mission-card">
                <div className="section-title-wrapper">
                  <Title level={2} className="section-title">
                    Our Services
                  </Title>
                  <div className="title-decorator"></div>
                </div>
                <Paragraph className="mission-text">
                  We specialize in a broad spectrum of services, including:
                  Residential and Commercial Architecture, Interior Design,
                  Sustainable Building Practices, Custom Construction Solutions,
                  and Project Management.
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="mission-card">
                <div className="section-title-wrapper">
                  <Title level={2} className="section-title">
                    Our Approach
                  </Title>
                  <div className="title-decorator"></div>
                </div>
                <Paragraph className="mission-text">
                  At the core of our approach is a collaborative spirit. We work
                  closely with our clients, understanding their vision and
                  translating it into reality. Our team of experienced
                  architects, designers, and builders uses the latest technology
                  and materials to ensure that each project is aesthetically
                  pleasing, environmentally responsible, and structurally sound.
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="mission-card">
                <div className="section-title-wrapper">
                  <Title level={2} className="section-title">
                    Our Promise
                  </Title>
                  <div className="title-decorator"></div>
                </div>
                <Paragraph className="mission-text">
                  To our clients, we promise a partnership that goes beyond mere
                  construction. We are dedicated to providing a seamless
                  experience from the initial concept to the final brick. Our
                  goal is to create spaces that reflect your aspirations and
                  enhance your quality of life.
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="mission-card">
                <div className="section-title-wrapper">
                  <Title level={2} className="section-title">
                    Our Future
                  </Title>
                  <div className="title-decorator"></div>
                </div>
                <Paragraph className="mission-text">
                  As we look to the future, Nepal Designers and Builders Pvt Ltd
                  is excited to continue pushing the boundaries of design and
                  construction. We are committed to innovation and excellence,
                  ensuring that we remain at the forefront of the industry,
                  setting new standards in the architecture and construction
                  realm.
                </Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <div className="section-title-wrapper">
              <Title level={2} className="section-title">
                OUR TEAM
              </Title>
              <div className="title-decorator"></div>
            </div>
            <Paragraph className="section-subtitle">
              Meet the passionate minds behind Nepal Designers and Builders—our
              architects, engineers and project managers, construction experts
              who bring vision to life. Each member plays a vital role in
              delivering excellence, creativity, and precision to every project
              we undertake.
            </Paragraph>
          </div>

          <Row gutter={[24, 32]} className="team-grid">
            {teamMembers.map((member, index) => {
              const isLastRow =
                teamMembers.length % 4 !== 0 &&
                index >= teamMembers.length - (teamMembers.length % 4);

              return (
                <Col
                  xs={24}
                  sm={12}
                  lg={8}
                  xl={6}
                  key={member.id}
                  className={isLastRow ? "last-row-item" : ""}
                >
                  <Card className="team-card" hoverable>
                    <motion.div
                      initial={{ opacity: 0, translateY: 50 }}
                      whileInView={{ opacity: 1, translateY: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <div className="team-image-container">
                        <img
                          src={
                            member.filepath
                              ? `${apiUrl}/architecture-web-app${member.filepath}`
                              : ""
                          }
                          alt={member.name}
                          className="team-image"
                          onError={(
                            e: React.SyntheticEvent<HTMLImageElement>,
                          ) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial, sans-serif' font-size='16' fill='%23999' text-anchor='middle' dy='.3em'%3ETeam Member%3C/text%3E%3C/svg%3E";
                          }}
                        />
                        <div className="team-social-links">
                          <a
                            href={
                              member.contact_no
                                ? `tel:+977-${member.contact_no}`
                                : "#"
                            }
                            className={`social-link-item ${
                              !member.contact_no ? "disabled" : ""
                            }`}
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                            </svg>

                            <span>Phone</span>
                          </a>
                          <a
                            href={member.email ? `mailto:${member.email}` : "#"}
                            className={`social-link-item ${
                              !member.email ? "disabled" : ""
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                            </svg>

                            <span>Email</span>
                          </a>
                        </div>
                      </div>
                      <div className="team-content">
                        <Title level={4} className="team-name">
                          {member.name}
                        </Title>
                        <div className="team-position">
                          {member.designation}
                        </div>
                        {member.additionalInfo && (
                          <p className="education-secondary">
                            {member.additionalInfo}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  </Card>
                </Col>
              );
            })}
          </Row>

          <Paragraph className="about-team">
            {" "}
            We specialize in the <b>design and construction</b> of diverse
            projects—from <b>residential homes</b> and{" "}
            <b>commercial complexes</b> to <b>resorts, hotels</b>, <b>clubs</b>,
            and <b>entertainment venues</b>—ensuring seamless integration of
            architecture, interiors, and construction management. <br /> <br />{" "}
            Rooted in creativity, functionality, and sustainability, we bring
            together innovative design thinking with precise execution. Every
            project we handle reflects our commitment to excellence,
            collaboration, and client satisfaction. We don't just build
            structures—we craft environments that elevate living and working
            experiences. <br /> <br />
            Our integrated design-to-build approach ensures that every detail is
            thoughtfully planned and professionally delivered, making us a
            trusted partner for clients across Nepal and beyond. From vision to
            reality, we’re here to create spaces that inspire, perform, and
            last.
          </Paragraph>
        </div>
      </section>
      {/* Our Team Section */}

      {/* Contact Section */}
      <section className="contact-section" ref={contactRef} id="contact-us">
        <div className="container">
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={12}>
              <div className="contact-content" id="contact-section">
                <Title level={2}>
                  <span className="contact-content-1">Contact Us</span> & We Can
                  Work Together
                  {/* We’re Here for You */}
                </Title>

                <Paragraph className="contact-intro">
                  Got a question or need help with your project? Contact us from
                  any medium +01-5926740 / +977-9701364188 anytime! <br />
                  We’ll get back to you soon.
                  <br />
                  We’re here to make your dream project a reality!
                </Paragraph>
                <Form
                  form={form}
                  name="contact"
                  layout="vertical"
                  onFinish={onFinish}
                  className="contact-form"
                >
                  <Form.Item
                    name="name"
                    label="Full Name / Location"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your full name / location",
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Your Name / Location" />
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    label="Contact Number"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your contact number",
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Your Contact Number" />
                  </Form.Item>
                  <Form.Item
                    name="requirements"
                    label="Tell us about your project requirements:"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your project requirements",
                      },
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Tell us about your project requirements"
                      className="message-input"
                    />
                  </Form.Item>
                  <Form.Item
                    name="services"
                    label="What Kind of services do you want from design to construction?"
                    rules={[
                      {
                        required: true,
                        message:
                          "Please enter What Kind of services do you want from design to construction",
                      },
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="What Kind of services do you want from design to construction?"
                      className="message-input"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      size="small"
                      htmlType="submit"
                      loading={loading}
                      className="submit-button"
                    >
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!4v1771088206903!6m8!1m7!1s2RQ3p4O16EShNk4mMQ7Xrg!2m2!1d27.72892652160818!2d85.31475237308362!3f277.6053322491907!4f7.84354388556639!5f0.4000000000000002"
                  width="100%"
                  height="600px"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Our Location"
                ></iframe>
              </div>
            </Col>
          </Row>
        </div>
      </section>
      <ScrollToTop />
    </>
  );
};

export default AboutUsPage;
