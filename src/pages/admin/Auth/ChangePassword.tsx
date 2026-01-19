import { Modal, Form, Input, message } from "antd";
import { useState } from "react";
import axios from "axios";
import { apiUrl } from "../../../utils/index";

interface EditProfileProps {
  visible: boolean;
  onCancel: () => void;
}

const ChangePassword = ({ visible, onCancel }: EditProfileProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: {
    currentPassword: string;
    newPassword?: string;
    confirmNewPassword?: string;
    newEmail?: string;
  }) => {
    setLoading(true);
    try {
      // Retrieve userId from localStorage
      const userId = sessionStorage.getItem('Id');
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      const response = await axios.put(
        `${apiUrl}/architecture-web-app/auth/edit/${userId}`,
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword || "",
          confirmNewPassword: values.confirmNewPassword || "",
          newEmail: values.newEmail || "",
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        message.success("Profile updated successfully!");
        form.resetFields();
        onCancel();
      } else {
        message.error("Failed to update profile");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data?.message || "Failed to update profile");
      } else {
        message.error(error instanceof Error ? error.message : "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Change Credentials"
      open={visible}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onFinish(values);
          })
          .catch(() => {
            message.error("Please fill all required fields correctly");
          });
      }}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okText="Submit"
      cancelText="Cancel"
      className="testimonial-modal"
      width={500}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        className="compact-form"
      >
        <Form.Item
          name="newEmail"
          label="Email"
          rules={[
            { type: "email", message: "Please enter a valid email" },
            { required: true, message: "Please enter your new Email" },
          ]}
        >
          <Input className="fullName" placeholder="Enter new email" />
        </Form.Item>
        <Form.Item
          name="currentPassword"
          label="Current Password"
          rules={[{ required: true, message: "Please enter your current password" }]}
        >
          <Input.Password className="fullName" placeholder="Enter current password" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { min: 8, message: "Password must be at least 8 characters long" },
            { required: true, message: "Please enter new password" }  
          ]}
        >
          <Input.Password className="fullName" placeholder="Enter new password" />
        </Form.Item>
        <Form.Item
          name="confirmNewPassword"
          label="Confirm New Password"
          dependencies={["newPassword"]}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!getFieldValue("newPassword") && !value) {
                  return Promise.resolve();
                }
                if (getFieldValue("newPassword") && !value) {
                  return Promise.reject(new Error("Please confirm your new password"));
                }
                if (getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("The two passwords do not match"));
              },
            }),
            { required: true, message: "Please enter confirm new password" }
          ]}
        >
          <Input.Password className="fullName" placeholder="Confirm new password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePassword;