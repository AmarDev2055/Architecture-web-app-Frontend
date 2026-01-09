import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Upload, Rate, Button, Row, Col } from "antd";
import { UploadOutlined, UserOutlined, StarOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/es/upload/interface";
import LoadingSpinner from "../../../components/client/LoadingSpinner";

interface CreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (values: FormData) => Promise<void>;
}

const CreateModal: React.FC<CreateModalProps> = ({
  visible,
  onCancel,
  onCreate,
}) => {
  const [form] = Form.useForm();
  // const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageList, setImageList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (visible) {
      setImageError(null);
      setImageList([]);
    } else {
      setImageError(null);
    }
  }, [visible]);

  const handleImageChange = ({ fileList }: { fileList: UploadFile[] }) => {
    if (fileList.length > 0) {
      const file = fileList[fileList.length - 1];
      if (file.size && file.size / 1024 / 1024 > 2) {
        setImageError("Image must be smaller than 2MB!");
        setImageList([]);
        return;
      } else {
        setImageError(null);
      }
    } else {
      setImageError(null);
    }
    setImageList(fileList.slice(-1));
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("fullname", values.fullname);
      formData.append("designation", values.designation);
      formData.append("rating", values.rating?.toString() || "0");
      formData.append("message", values.message);

      if (imageList.length > 0) {
        formData.append("image", imageList[0].originFileObj as Blob);
      }

      await onCreate(formData);
      form.resetFields();
      setImageList([]);
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
      title="Create New Testimonial"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleCreate}
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
              <Rate allowHalf disabled={loading} character={<StarOutlined />} />
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
              validateStatus={imageError ? "error" : undefined}
              help={imageError}
            >
              <Upload
                beforeUpload={() => false}
                fileList={imageList}
                onChange={handleImageChange}
                multiple={false}
                listType="picture"
                disabled={loading}
                accept="image/jpeg,image/png"
                maxCount={1}
                className="testimonial-upload"
              >
                {imageList.length === 0 && (
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

export default CreateModal;
