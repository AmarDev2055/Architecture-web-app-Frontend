import { useEffect, useRef } from "react";
import { Button, Col, Form, Input, Row, Typography, message } from "antd";
import { useLocation } from "react-router-dom";
import usePostAPI from "../../../hooks/usePostAPI";
import ScrollToTop from "../../../components/client/ScrollToTop";
import { Card } from "antd";
import { motion } from "framer-motion";
import Picture2 from "../../../assets/images/teamMember/Picture2.png";
import Picture3 from "../../../assets/images/teamMember/Picture3.png";
import Picture4 from "../../../assets/images/teamMember/Picture4.png";
import Picture5 from "../../../assets/images/teamMember/Picture5.png";
import Picture6 from "../../../assets/images/teamMember/Picture6.png";
import Picture7 from "../../../assets/images/teamMember/Picture7.png";
import Picture8 from "../../../assets/images/teamMember/Picture8.jpg";
import Picture9 from "../../../assets/images/teamMember/Picture9.png";
import Picture10 from "../../../assets/images/teamMember/Picture10.png";
import Picture11 from "../../../assets/images/teamMember/Picture11.png";
import Picture12 from "../../../assets/images/teamMember/Picture12.png";

// import CeoImage from "../../../assets/images/Founder.jpg";
interface TeamMember {
  id: number;
  name: string;
  position: string;
  additionalInfo: string;
  image: string;
}
const AboutUsPage = () => {
  const { TextArea } = Input;
  const { Title, Paragraph } = Typography;
  const { loading, postData } = usePostAPI("architecture-web-app/contact-us");
  const [form] = Form.useForm();
  const contactRef = useRef(null);
  const location = useLocation();
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "AR. Rajan Karki",
      position: "Managing Director Architect",
      additionalInfo: "",
      image: Picture2, // Replace with actual image path
    },
    {
      id: 2,
      name: "AR. Nikita Gautam",
      position: "Co-Founder | Technical Head Architect",
      additionalInfo: "",
      image: Picture3, // Replace with actual image path
    },
    {
      id: 3,
      name: "MR. Yadu Karki",
      position: "Reserach and Finance Head",
      additionalInfo: "",
      image: Picture4, // Replace with actual image path
    },
    {
      id: 4,
      name: "MR. Hari Karki",
      position: "Construction | Material Manager",
      additionalInfo: "",
      image: Picture5, // Replace with actual image path
    },
    {
      id: 5,
      name: "AR. Siva Hari Thapa",
      position: "Branch Manager | Architect",
      additionalInfo: "",
      image: Picture6, // Replace with actual image path
    },
    {
      id: 6,
      name: "AR. Srijana Chaudhary",
      position: "Architect | Interior Designer",
      additionalInfo: "",
      image: Picture7, // Replace with actual image path
    },

    {
      id: 7,
      name: "AR. Bindu Regmi",
      position: "Architect | Vaastu Consultant",
      additionalInfo: "",
      image: Picture8, // Replace with actual image path
    },

    {
      id: 8,
      name: "AR. Shrutika Bhandari",
      position: "Architect",
      additionalInfo: "",
      image: Picture9, // Replace with actual image path
    },
    {
      id: 9,
      name: "ER. Saideep Ghimire",
      position: "Site | Civil Engineer",
      additionalInfo: "",
      image: Picture10, // Replace with actual image path
    },
    {
      id: 10,
      name: "ER. Pratik Rimal",
      position: "Civil Engineer",
      additionalInfo: "",
      image: Picture11, // Replace with actual image path
    },
    {
      id: 10,
      name: "Er. Durgesh Yadav",
      position: "Civil Engineer | Construction Expert",
      additionalInfo: "",
      image: Picture12, // Replace with actual image path
    },
  ];
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
                          src={member.image}
                          alt={member.name}
                          className="team-image"
                          onError={(
                            e: React.SyntheticEvent<HTMLImageElement>
                          ) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial, sans-serif' font-size='16' fill='%23999' text-anchor='middle' dy='.3em'%3ETeam Member%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                      <div className="team-content">
                        <Title level={4} className="team-name">
                          {member.name}
                        </Title>
                        <div className="team-position">{member.position}</div>
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
                  any medium +977-9851356590/ +977- 9851340040 anytime! <br />
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8407931243287!2d85.27923357547357!3d27.691315126198393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19eda9890b29%3A0x414c20f681475f25!2sNepal%20Designers%20and%20Builders!5e0!3m2!1sne!2snp!4v1733824629346!5m2!1sne!2snp"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Our Location"
                />
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
