import { Form, Input, Button, Checkbox } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";
import usePostAPI from "../../../hooks/usePostAPI";
import logo from "../../../assets/images/LogoNew.png";
import bgSvg from "../../../assets/svg/bg2.png";
import wavePng from "../../../assets/images/wave1.png";

interface LoginResponse {
  id: number;
  fullName: string;
  email: string;
  filepath: string | null;
  token: string;
  message: string;
}

interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { loading, postData } = usePostAPI<LoginResponse>(
    "architecture-web-app/auth/login",
  );

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const cookieToken = Cookies.get("authToken");

    if (token && cookieToken) {
      const redirectPath =
        localStorage.getItem("redirectPath") || "/admin/banner";
      localStorage.removeItem("redirectPath");
      navigate(redirectPath);
    }
  }, [navigate]);

  const onFinish = async (values: LoginFormValues) => {
    try {
      const response = await postData({
        email: values.email,
        password: values.password,
      });

      if (response && response.token) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("Id", response.id.toString());
        Cookies.set("authToken", response.token);

        Cookies.set("authToken", response.token, {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          secure: true,
          sameSite: "None",
          path: "/",
        });
        const redirectPath =
          localStorage.getItem("redirectPath") || "/admin/banner";
        localStorage.removeItem("redirectPath");
        navigate(redirectPath);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="left-section">
        {/* Logo */}
        <div className="logo">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo" className="logo-img" />
          </Link>
        </div>
        {/* Background SVG */}
        <div className="bg-illustration">
          <img src={bgSvg} alt="Background Illustration" className="bg-svg" />
        </div>

        {/* Wave overlay */}
        <div className="wave-overlay">
          <img src={wavePng} alt="Wave" className="wave-image" />
        </div>
      </div>

      <div className="right-section">
        <div className="form-container">
          <div className="welcome-header">
            <div className="user-avatar">
              <div className="avatar-circle">
                <div className="avatar-icon"></div>
              </div>
            </div>
            <h2>WELCOME</h2>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            className="login-form"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <div className="input-wrapper">
                <div className="input-icon user-icon"></div>
                <Input
                  placeholder="Email"
                  className="form-input"
                  disabled={loading}
                />
              </div>
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <div className="input-wrapper">
                <div className="input-icon lock-icon"></div>
                <Input.Password
                  placeholder="Password"
                  className="form-input"
                  disabled={loading}
                />
              </div>
            </Form.Item>

            <div className="form-options">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              {/* <Button type="link" className="forgot-password">
                Forgot Password?
              </Button> */}
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-btn"
                loading={loading}
                block
              >
                LOGIN
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
