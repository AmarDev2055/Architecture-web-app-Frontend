import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Upload, Button, Row, Col, Radio } from "antd";
import { UploadOutlined, UserOutlined, LinkOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/es/upload/interface";
import LoadingSpinner from "../../../components/client/LoadingSpinner";
import { apiUrl } from "../../../utils";

interface UpdateClientModalProps {
  visible: boolean;
  onCancel: () => void;
  onUpdate: (values: FormData) => Promise<void>;
  initialValues: {
    name: string;
    link: string;
    filepath: string | null;
    filename: string | null;
    feature: boolean;
  };
}

const UpdateClientModal: React.FC<UpdateClientModalProps> = ({
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
        name: initialValues.name,
        link: initialValues.link,
        status: initialValues.feature ? "1" : "0",
      });

      if (initialValues.filepath) {
        setFileList([
          {
            uid: "-1",
            name: initialValues.filename || "current-logo",
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
        setImageError('Logo must be smaller than 2MB!');
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
      formData.append("name", values.name);
      formData.append("link", values.link);
      formData.append("feature", values.status === "1" ? "true" : "false");

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
      title="Update Client"
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
              label="Client Name"
              name="name"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter client name"
                disabled={loading}
                className="clientName"
              />
            </Form.Item>
          </Col>
           <Col span={12}>
            <Form.Item
              label="Link"
              name="link"
              rules={[
                { required: true, message: "Required" },
                { type: "url", message: "Please enter a valid URL" },
              ]}
            >
              <Input
                prefix={<LinkOutlined />}
                placeholder="Enter client website URL"
                disabled={loading}
                className="clientLink"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Logo Image (Max 2MB)"
              name="filepath"
              className="upload-wrapper"
              validateStatus={imageError ? 'error' : undefined}
              help={imageError}
            >
              <Upload
                beforeUpload={() => false}
                fileList={fileList}
                onChange={handleFileChange}
                multiple={false}
                listType="picture-card"
                disabled={loading}
                accept="image/jpeg,image/png"
                maxCount={1}
                className="testimonial-upload"
              >
                {fileList.length === 0 && (
                  <div>
                    <UploadOutlined className="upload-icon" />
                    <div className="upload-text">Upload Logo</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Please select status" }]}
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

export default UpdateClientModal;