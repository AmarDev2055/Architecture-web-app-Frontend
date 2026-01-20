import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Upload, Button, Row, Col, Switch, InputNumber } from "antd";
import { UploadOutlined, UserOutlined, PhoneOutlined, OrderedListOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/es/upload/interface";
import LoadingSpinner from "../../../components/client/LoadingSpinner";
import { apiUrl } from "../../../utils";

interface UpdateModalProps {
    visible: boolean;
    onCancel: () => void;
    onUpdate: (values: FormData) => Promise<void>;
    initialValues: {
        name: string;
        designation: string;
        contact_no: string;
        is_featured: boolean;
        order: number;
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
                name: initialValues.name,
                designation: initialValues.designation,
                contact_no: initialValues.contact_no,
                is_featured: initialValues.is_featured,
                order: initialValues.order,
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
            formData.append("name", values.name);
            formData.append("designation", values.designation);
            formData.append("contact_no", values.contact_no);
            formData.append("is_featured", values.is_featured ? "true" : "false");
            formData.append("order", values.order.toString());

            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append("image", fileList[0].originFileObj as Blob);
            }
            // Note: If no new file is uploaded, we don't append "image" so the backend keeps the old one.
            // Or if the backend expects the old path string if not changed, we can append it.
            // Looking at Testimonials/updateModal.tsx:
            // } else if (initialValues.filepath) {
            //   formData.append("image", initialValues.filepath);
            // }
            // I will follow the same pattern.
            else if (initialValues.filepath) {
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
            title="Update Team Member"
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
                            // rules={[{ required: true, message: "Please upload an image" }]} // Not required on update if existing
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
