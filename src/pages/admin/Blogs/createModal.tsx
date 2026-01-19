import React, { useState } from "react";
import { Modal, Form, Input, Upload, Button, Row, Col, Radio } from "antd";
import { UploadOutlined } from "@ant-design/icons";
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
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageList, setImageList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
    if (fileList.length > 0) {
      const file = fileList[fileList.length - 1];
      if (file.size && file.size / 1024 / 1024 > 10) {
        setFileError("PDF must be smaller than 10MB!");
        setFileList([]);
        return;
      } else {
        setFileError(null);
      }
    } else {
      setFileError(null);
    }
    setFileList(fileList.slice(-1));
  };

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
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("feature", values.feature === "1" ? "true" : "false");

      if (fileList.length > 0) {
        formData.append("file", fileList[0].originFileObj as Blob);
      }
      if (imageList.length > 0) {
        formData.append("image", imageList[0].originFileObj as Blob);
      }

      await onCreate(formData);
      form.resetFields();
      setFileList([]);
      setImageList([]);
    } catch (error) {
      console.error("Validation Failed:", error);
      // message.error("Failed to create blog. Please check the form.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Modal
      title="Create New Blog"
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
      width={600}
      className="testimonial-modal"
      destroyOnClose
    >
      <Form form={form} layout="vertical" className="compact-form">
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Title"
              name="title"
              rules={[
                { required: true, message: "Please enter the blog title" },
              ]}
            >
              <Input placeholder="Enter blog title" disabled={loading} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please enter a description" },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Enter blog description"
                disabled={loading}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="PDF File (Max 10MB)"
              name="file"
              rules={[{ required: true, message: "Please upload a PDF file" }]}
              className="upload-wrapper"
              validateStatus={fileError ? "error" : undefined}
              help={fileError}
            >
              <Upload
                beforeUpload={() => false}
                fileList={fileList}
                onChange={handleFileChange}
                multiple={false}
                listType="text"
                disabled={loading}
                accept="application/pdf"
                maxCount={1}
                className="testimonial-upload"
              >
                {fileList.length === 0 && (
                  <div>
                    <UploadOutlined className="upload-icon" />
                    <div className="upload-text">Upload PDF</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
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
          <Col span={12}>
            <Form.Item
              label="Status"
              name="feature"
              rules={[
                { required: true, message: "Please select featured status" },
              ]}
            >
              <Radio.Group disabled={loading}>
                <Radio value="1">Active</Radio>
                <Radio value="0">Inactive</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateModal;
