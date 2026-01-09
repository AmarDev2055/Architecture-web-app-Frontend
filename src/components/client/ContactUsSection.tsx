import React, { useState, useCallback } from "react";
import { Form, Input, Button, Row, Col, message } from "antd";
import "../../assets/scss/components/_contactUsSection.scss";
import bgImage from "../../assets/images/outlined3.png";
import "linearicons/dist/web-font/style.css";
import InteriorDesign from '../../assets/images/Services/service-InteriorDesign.webp';
import HotelResort from '../../assets/images/Services/service-HotelResort.webp';
import gharCollection1 from '../../assets/images/Services/service-gharCollection1.webp';
import usePostAPI from "../../hooks/usePostAPI";
import { useNavigate } from "react-router-dom";

const ContactUsSection: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const { postData, loading, error } = usePostAPI("architecture-web-app/send-mail", false); // Disable default messages
  const navigate = useNavigate();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const container = e.currentTarget;
      const { left, top, width, height } = container.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      setMousePosition({ x, y });
    },
    []
  );

  const onFinish = async (values: any) => {
    console.log('Form Submission Values:', values);
    try {
      const requestData = {
        fullname: values.name,
        email: values.email,
        description: values.message
      };

      const response = await postData(requestData);
      if (response) {
        message.success("Message sent successfully!");
        form.resetFields();
      } else {
        message.error("Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error('Form submission error:', err);
      message.error("Failed to send message. Please try again.");
    }
  };

  const servicesData = [
    {
      title: "Interior Finishing",
      description: "Expert interior finishing services to enhance your living spaces with modern designs and high-quality materials.",
      icon: InteriorDesign,
      id: "interior-finishing"
    },
    {
      title: "Hotel, Resort, Party Palace, Restaurant & Cafe",
      description: "Comprehensive design and construction for hospitality and entertainment venues.",
      icon: HotelResort,
      id: "hospitality-design"
    },
    {
      title: "Complex Building Construction",
      description: "End-to-end solutions for constructing complex residential and commercial buildings.",
      icon: gharCollection1,
      id: "complex-construction"
    }
  ];

  const handleServiceClick = (serviceId: string) => {
    navigate(`/services#${serviceId}`);
  };

  return (
    <section className="architecture-section" onMouseMove={handleMouseMove} id='home-contact'>
      <div className="container">
        <Row className="content-row">
          <Col xs={28} md={12} lg={8} className="info-box">
            <div className="youtube-section__stats">
              {servicesData.map((service, index) => (
                <div 
                  key={index} 
                  className="youtube-section__stat-card"
                  onClick={() => handleServiceClick(service.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="youtube-section__stat-icon">
                    <img src={service.icon} alt={service.title} />
                  </div>
                  <div className="youtube-section__stat-content">
                    <div className="youtube-section__stat-header">
                      <h3 className="youtube-section__stat-title">{service.title}</h3>
                    </div>
                    <p className="youtube-section__stat-description">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Col>

          <Col xs={24} md={14} lg={10} className="form-col">
            <h1 className="fade-in-right">FIND OUT THE PRICE OF YOUR HOME</h1>
            <h4 className="fade-in-right">We will contact you within 24 hours</h4>
            <div className="form-container">
              <Form 
                form={form}
                layout="vertical" 
                onFinish={onFinish}
              >
                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[{ required: true, message: "Please enter your full name!" }]}
                >
                  <Input className="email" placeholder="Enter your full name" />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email!" },
                    { type: "email", message: "Please enter a valid email!" },
                  ]}
                >
                  <Input className="email" placeholder="Enter your email" />
                </Form.Item>
                <Form.Item
                  name="message"
                  label="Message"
                  rules={[
                    { required: true, message: "Please enter your message" },
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Your Message"
                    className="message-input"
                  />
                </Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  className="youtube-section__contact-button"
                  loading={loading}
                >
                  Submit
                </Button>
                {error && <div className="error-message">{error}</div>}
              </Form>
            </div>
          </Col>
        </Row>
      </div>

      <div
        className="architecture-section__background"
        style={{
          transform: `translate(-50%, -50%) translate(${mousePosition.x * 30}px, ${
            mousePosition.y * 30
          }px)`,
        }}
      >
        <img
          src={bgImage}
          alt="Background decoration"
          style={{
            transform: `scale(1.1) translate(${mousePosition.x * -20}px, ${
              mousePosition.y * -20
            }px)`,
          }}
        />
      </div>
    </section>
  );
};

export default ContactUsSection;