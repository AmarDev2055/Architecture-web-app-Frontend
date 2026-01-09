import React, { useState } from "react";
import { Modal, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import LoadingSpinner from "../../../components/client/LoadingSpinner";

interface DeleteModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
  recordName: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  recordName,
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
    } catch (error) {
      console.error("Error during deletion:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Modal
      title="Confirm Deletion"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button 
          key="cancel" 
          onClick={onCancel} 
          disabled={loading}
          className="cancel-btn"
        >
          Cancel
        </Button>,
        <Button
          key="confirm"
          type="primary"
          danger
          onClick={handleConfirm}
          disabled={loading}
          className="delete-btn"
        >
          Delete
        </Button>,
      ]}
      width={500}
      className="testimonial-modal delete-modal"
      destroyOnClose
    >
      <div className="delete-content">
        <ExclamationCircleOutlined className="warning-icon" />
        <p className="delete-message">
          Are you sure you want to delete "<strong>{recordName}</strong>"?
        </p>
        <p className="delete-warning">
          This action cannot be undone.
        </p>
      </div>
    </Modal>
  );
};

export default DeleteModal;