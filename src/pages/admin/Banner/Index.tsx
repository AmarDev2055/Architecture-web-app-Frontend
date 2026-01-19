import { Button, Col, Form, Input, Row, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { UploadFile } from "antd/es/upload/interface";
import useGetAPI from "../../../hooks/useGetAPI";
import LoadingSpinner from "../../../components/client/LoadingSpinner";
import axios from "axios";
import { apiUrl } from "../../../utils/index";

interface BannerData {
  heading: string;
  subHeading: string;
  filepath: string;
  description: string;
}

interface FormBannerData {
  heading: string;
  subHeading: string;
  videoFile: UploadFile[];
  description: string;
}

const initialValues: FormBannerData = {
  heading: "",
  subHeading: "",
  videoFile: [],
  description: "",
};

type FieldType = typeof initialValues;

const BannerSettings = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { loading: isLoading, data: bannerData } = useGetAPI<BannerData>(
    "architecture-web-app/banner",
    true,
    true
  );

  useEffect(() => {
    if (bannerData) {
      const formData: FormBannerData = {
        heading: bannerData.heading || "",
        subHeading: bannerData.subHeading || "",
        description: bannerData.description || "",
        videoFile: bannerData.filepath
          ? [
              {
                uid: "-1",
                url: `${apiUrl}/architecture-web-app${bannerData.filepath}`,
                name: "banner-video",
                status: "done",
              } as UploadFile,
            ]
          : [],
      };
      form.setFieldsValue(formData);
      setFileList(formData.videoFile);
    }
  }, [bannerData, form]);

  const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList.slice(-1));
    form.setFieldsValue({ videoFile: fileList.slice(-1) });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("heading", values.heading);
      formData.append("subHeading", values.subHeading);
      formData.append("description", values.description);

      if (fileList.length > 0 && fileList[0].originFileObj) {
        const file = fileList[0].originFileObj;
        formData.append("video", file, file.name);
      }

      const response = await axios.post(
        `${apiUrl}/architecture-web-app/banner`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data?.message) {
        message.success(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="dashboard-card">
      {/* <Title level={3}>Banner Information</Title> */}
      <div className="dashboard-Headings">Banner Information</div>
      <Form
        form={form}
        layout="vertical"
        name="banner_settings"
        initialValues={initialValues}
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <Form.Item<FieldType>
              label="Heading"
              name="heading"
              rules={[{ required: true, message: "Heading is required!" }]}
            >
              <Input placeholder="Enter heading..." disabled={loading} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24}>
            <Form.Item<FieldType>
              label="Sub Heading"
              name="subHeading"
              // rules={[{ required: true, message: "Sub Heading is required!" }]}
            >
              <Input placeholder="Enter sub heading..." disabled={loading} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24}>
            <Form.Item<FieldType>
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is required!" }]}
            >
              <Input.TextArea
                placeholder="Enter description..."
                disabled={loading}
                rows={4}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label="Banner Video"
              name="videoFile"
              rules={[{ required: true, message: "Banner Video is required!" }]}
            >
              <Upload
                beforeUpload={() => false}
                fileList={fileList}
                onChange={handleFileChange}
                multiple={false}
                listType="picture"
                accept=".mp4,.avi,.mov,.webm"
                disabled={loading}
              >
                <Button icon={<UploadOutlined />} disabled={loading} block>
                  Click to upload video
                </Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24}>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              style={{ 
                height: '40px', 
                padding: '0 24px', 
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default BannerSettings;
