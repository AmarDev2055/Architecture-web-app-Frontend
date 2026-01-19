import { Modal, Form, Input, Radio } from "antd";
import { useEffect } from "react";

interface UpdateModalProps {
  visible: boolean;
  onCancel: () => void;
  onUpdate: (values: { title: string; status: string }) => void;
  initialValues: { category: string; status: string };
}

const UpdateModal = ({
  visible,
  onCancel,
  onUpdate,
  initialValues,
}: UpdateModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        title: initialValues.category,
        status:
          initialValues.status === "Active" || initialValues.status === "1"
            ? "1"
            : "0",
      });
    }
  }, [visible, initialValues, form]);

  return (
    <Modal
      title="Update Project Category"
      visible={visible}
      onOk={() => {
        form.validateFields().then((values) => {
          onUpdate(values);
          form.resetFields();
        });
      }}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      okText="Update"
      cancelText="Cancel"
      className="testimonial-modal"
    >
      <Form
        form={form}
        layout="vertical"
        className="compact-form"
      >
        <Form.Item
          name="title"
          label="Category Title"
          rules={[{ required: true, message: "Please enter the category title" }]}
        >
          <Input placeholder="Enter category title" className="categoryTitle" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select a status" }]}
        >
          <Radio.Group>
            <Radio value="1">Active</Radio>
            <Radio value="0">Inactive</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateModal;