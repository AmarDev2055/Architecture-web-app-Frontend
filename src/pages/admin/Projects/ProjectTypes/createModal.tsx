import { Modal, Form, Input, Radio } from "antd";

interface CreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (values: { title: string; status: string }) => void;
}

const CreateModal = ({ visible, onCancel, onCreate }: CreateModalProps) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onCreate(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Create Project Category"
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      okText="Create"
      cancelText="Cancel"
      className="testimonial-modal"
    >
      <Form form={form} className="compact-form" layout="vertical" initialValues={{ status: "1" }}>
        <Form.Item
          name="title"
          label="Category Title"
          rules={[{ required: true, message: "Please enter the category title" }]}
        >
          <Input placeholder="Enter category title" className="fullName" />
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

export default CreateModal;