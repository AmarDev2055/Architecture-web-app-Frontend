import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Upload, Rate, Button, Row, Col } from "antd";
import { UploadOutlined, UserOutlined, StarOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/es/upload/interface";
import LoadingSpinner from "../../../components/client/LoadingSpinner";
import { apiUrl } from "../../../utils";

interface UpdateModalProps {
  visible: boolean;
  onCancel: () => void;
  onUpdate: (values: FormData) => Promise<void>;
  initialValues: {
    fullname: string;
    designation: string;
    rating: number;
    message: string;
    filepath?: string | null;
    filename?: string | null;
  };
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  visible,
  onCancel,
  onUpdate,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        fullname: initialValues.fullname,
        designation: initialValues.designation,
        rating: initialValues.rating,
        message: initialValues.message,
      });

      if (initialValues.filepath) {
        setFileList([
          {
            uid: "-1",
            name: "current-image",
            status: "done",
            url: `${apiUrl}/architecture-web-app${initialValues.filepath}`,
          },
        ]);
      } else {
        setFileList([]);
      }
      setImageError(null);
    } else {
      setImageError(null);
    }
  }, [visible, initialValues, form]);

  const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
    if (fileList.length > 0) {
      const file = fileList[fileList.length - 1];
      if (file.size && file.size / 1024 / 1024 > 2) {
        setImageError('Image must be smaller than 2MB!');
        setFileList([]);
        return;
      } else {
        setImageError(null);
      }
    } else {
      setImageError(null);
    }
    setFileList(fileList.slice(-1));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("fullname", values.fullname);
      formData.append("designation", values.designation);
      formData.append("rating", values.rating?.toString() || "0");
      formData.append("message", values.message);

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj as Blob);
      } else if (initialValues.filepath) {
        formData.append("image", initialValues.filepath);
      }

      await onUpdate(formData);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error("Validation Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Modal
      title="Update Testimonial"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleUpdate}
          disabled={loading}
        >
          Submit
        </Button>,
      ]}
      width={850}
      className="testimonial-modal"
      destroyOnClose
    >
      <Form form={form} layout="vertical" className="compact-form">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Full Name"
              name="fullname"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input 
                prefix={<UserOutlined />}
                placeholder="Enter full name" 
                disabled={loading}
                className="fullName"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Designation"
              name="designation"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input 
                prefix={<UserOutlined />}
                placeholder="Enter designation" 
                disabled={loading}
                className="fullName"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Rating"
              name="rating"
              rules={[{ required: true, message: "Required" }]}
            >
              <Rate 
                allowHalf 
                disabled={loading}
                character={<StarOutlined />}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Message"
              name="message"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Enter testimonial message"
                disabled={loading}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Image (Max 2MB)"
              name="image"
              rules={[{ required: true, message: "Please upload an image" }]}
              className="upload-wrapper"
              validateStatus={imageError ? 'error' : undefined}
              help={imageError}
            >
              <Upload
                beforeUpload={() => false}
                fileList={fileList}
                onChange={handleFileChange}
                multiple={false}
                listType="picture"
                disabled={loading}
                accept="image/jpeg,image/png"
                maxCount={1}
                className="testimonial-upload"
              >
                {fileList.length === 0 && (
                  <div>
                    <UploadOutlined className="upload-icon" />
                    <div className="upload-text">Upload Image</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdateModal;
