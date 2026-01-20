import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Upload, Button, Row, Col, Switch, InputNumber } from "antd";
import { UploadOutlined, UserOutlined, PhoneOutlined, OrderedListOutlined } from "@ant-design/icons";
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
            formData.append("name", values.name); // Changed key to 'name' as requested
            formData.append("designation", values.designation);
            formData.append("contact_no", values.contact_no);
            formData.append("is_featured", values.is_featured ? "true" : "false");
            formData.append("order", values.order.toString());

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
            title="Create New Team Member"
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
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Enter name"
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
                    <Col span={12}>
                        <Form.Item
                            label="Contact No"
                            name="contact_no"
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <Input
                                prefix={<PhoneOutlined />}
                                placeholder="Enter contact number"
                                disabled={loading}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Order"
                            name="order"
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <InputNumber
                                prefix={<OrderedListOutlined />}
                                placeholder="Enter order"
                                disabled={loading}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Is Featured"
                            name="is_featured"
                            valuePropName="checked"
                        >
                            <Switch disabled={loading} />
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
