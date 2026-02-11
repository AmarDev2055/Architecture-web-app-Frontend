import { Modal, Form, Input, Button, Upload, message, Row, Col, Select, Radio } from "antd";
import { UploadOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../../../../utils";

interface ProjectType {
  id: number;
  title: string;
  status: boolean;
}

interface CreateProjectModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (values: any) => void;
  projectTypeId?: number;
}

const CreateProjectModal = ({
  visible,
  onCancel,
  onCreate,
  projectTypeId,
}: CreateProjectModalProps) => {
  const [form] = Form.useForm();
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]); // State for gallery file list

  // Fetch project types from API
  const fetchProjectTypes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/architecture-web-app/projects/project-types`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setProjectTypes(response.data.data);
      } else {
        message.error("Failed to fetch project types");
      }
    } catch (error) {
      message.error("Error fetching project types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchProjectTypes();
      form.resetFields();
      setFileList([]); // Reset file list when modal opens
    }
  }, [visible, form]);

  const handleImageUpload = ({ fileList }: any) => {
    // Set the first file as the image (since maxCount=1)
    const file = fileList.length > 0 ? fileList[0] : null;
    form.setFieldsValue({ image: file });
    return false; // Prevent automatic upload
  };

  const handleGalleryUpload = ({ fileList }: any) => {
    // Update fileList for preview
    const updatedFileList = fileList.map((file: any) => ({
      uid: file.uid,
      name: file.name,
      status: file.status || "done",
      url: file.url || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : null),
      originFileObj: file.originFileObj || file,
    }));

    setFileList(updatedFileList);
    form.setFieldsValue({ gallery: updatedFileList });
    return false; // Prevent automatic upload
  };

  const onFinish = async (values: any) => {
    onCreate(values);
  };

  return (
    <Modal
      title="Create New Project"
      open={visible}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onFinish(values);
            form.resetFields();
            setFileList([]);
          })
          .catch(() => {
            message.error("Please fill all required fields correctly");
          });
      }}
      onCancel={() => {
        onCancel();
        form.resetFields();
        setFileList([]);
      }}
      okText="Create"
      cancelText="Cancel"
      className="testimonial-modal"
      width={850}
    >
      <Form
        form={form}
        layout="vertical"
        className="compact-form"
        initialValues={{ project_type_id: projectTypeId, status: true }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="name"
              label="Project Name"
              rules={[{ required: true, message: "Please enter the project name" }]}
            >
              <Input placeholder="Enter project name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="project_type_id"
              label="Project Type"
              rules={[{ required: true, message: "Please select a project type" }]}
            >
              <Select
                placeholder="Select project type"
                loading={loading}
                options={projectTypes.map((type) => ({
                  value: type.id,
                  label: type.title,
                }))}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: "Please enter the location" }]}
            >
              <Input placeholder="Enter location" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="site_area"
              label="Site Area"
            >
              <Input placeholder="Enter site area" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="client_name"
              label="Client Name"
              rules={[{ required: true, message: "Please enter the client name" }]}
            >
              <Input placeholder="Enter client name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="client_email"
              label="Client Email"
              rules={[
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Enter client email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="client_mobile"
              label="Client Mobile"
            >
              <Input placeholder="Enter client mobile" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="client_address"
              label="Client Address"
            >
              <Input placeholder="Enter client address" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please enter the description" }]}
            >
              <Input.TextArea placeholder="Enter description" rows={3} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select a status" }]}
            >
              <Radio.Group>
                <Radio value={true}>Active</Radio>
                <Radio value={false}>Inactive</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="image"
              label="Image (Single)"
              rules={[{ required: true, message: "Please upload an image" }]}
            >
              <Upload
                beforeUpload={() => false}
                onChange={handleImageUpload}
                maxCount={1}
                accept="image/*"
                listType="picture"
                className="testimonial-upload"
              >
                <Button icon={<UploadOutlined />}>Upload Photo</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="gallery"
              label="Gallery (Multiple Images)"
              rules={[{ required: true, message: "Please upload at least one gallery image" }]}
            >
              <Upload
                beforeUpload={() => false}
                onChange={handleGalleryUpload}
                fileList={fileList}
                multiple
                accept="image/*"
                listType="picture"
                className="testimonial-upload"
              >
                <Button icon={<UploadOutlined />}>Upload Photo</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.List name="videos">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={16} align="middle">
                      <Col span={22}>
                        <Form.Item
                          {...restField}
                          name={[name]}
                          label="Video URL" // Optional: hide label for subsequent items if desired
                          rules={[
                            { required: false, message: "Please enter a video URL" }, // Not required as per user request
                            // { type: 'url', message: 'Please enter a valid URL' } // Optional: add URL validation
                          ]}
                        >
                          <Input placeholder="Enter YouTube Video URL" />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <DeleteOutlined onClick={() => remove(name)} style={{ color: 'red', cursor: 'pointer' }} />
                      </Col>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Video URL
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateProjectModal;