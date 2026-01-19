import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
interface DeleteProjectModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  recordName: string;
}

const DeleteProjectModal = ({
  visible,
  onCancel,
  onConfirm,
  recordName,
}: DeleteProjectModalProps) => {
  return (
    <Modal
      title="Delete Project"
      visible={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ className: "delete-btn" }}
      cancelButtonProps={{ className: "cancel-btn" }}
      className="testimonial-modal delete-modal"
    >
      <div className="delete-content">
        <ExclamationCircleOutlined className="warning-icon" />
        <p className="delete-message">
          Are you sure you want to delete the project "<strong>{recordName}</strong>"?
        </p>
        <p className="delete-warning">This action cannot be undone.</p>
      </div>
    </Modal>
  );
};

export default DeleteProjectModal;