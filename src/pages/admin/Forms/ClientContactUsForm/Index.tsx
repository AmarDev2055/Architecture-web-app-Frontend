import { useState, useEffect } from "react";
import { Table, message, Button, Space, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons"; //PlusOutlined
import useGetAPI from "../../../../hooks/useGetAPI";
// import usePostAPI from "../../../hooks/usePostAPI"; // Assuming you have this from previous interactions
import axios from "axios";
import { apiUrl } from "../../../../utils";
import LoadingSpinner from "../../../../components/client/LoadingSpinner";
import DeleteModal from "./DeleteModal";

interface ClientFormData {
  id: number;
  name: string;
  phone: string;
  requirements: string;
  services: string;
  createdAt: string;
}

const ClientFormSetting = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data, loading, error } = useGetAPI<ClientFormData[]>(
    `architecture-web-app/contact-us?refresh=${refreshKey}`
  );
  // const { postData } = usePostAPI("/architecture-web-app/forms");
  // const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<ClientFormData | null>(
    null
  );
  const [recordName, setRecordName] = useState<string>("");
  const [pageLoading, setPageLoading] = useState<boolean>(false);

  useEffect(() => {
    if (error) {
      message.error("Failed to fetch client forms: " + error);
    }
  }, [error]);

  const handleDeleteClick = (record: ClientFormData) => {
    setEditingRecord(record);
    setRecordName(record.name);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    setPageLoading(true);
    try {
      await axios.delete(
        `${apiUrl}/architecture-web-app/contact-us/${editingRecord?.id}`,
        {
          withCredentials: true,
        }
      );
      message.success(`${editingRecord?.name} has been deleted`);
      setDeleteModalVisible(false);
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      message.error("Error deleting client form");
    } finally {
      setPageLoading(false);
    }
  };

  const columns = [
    {
      title: "SN",
      key: "sn",
      render: (_: any, __: ClientFormData, index: number) => index + 1,
    },
    {
      title: "Full Name/Location",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Contact Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Project Requirements",
      dataIndex: "requirements",
      key: "requirements",
    },
    {
      title: "Services From Design to Constructions",
      dataIndex: "services",
      key: "services",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: ClientFormData) => (
        <Space size="middle">
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteClick(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {pageLoading || loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div className="dashboard-Headings">Client Contact Us Form</div>
          <Table<ClientFormData>
            columns={columns}
            dataSource={
              data?.map((item) => ({ ...item, key: item.id.toString() })) || []
            }
            pagination={{ pageSize: 10 }}
            scroll={{ x: "max-content" }}
            rowKey="id"
          />
          <DeleteModal
            visible={deleteModalVisible}
            onCancel={() => setDeleteModalVisible(false)}
            onConfirm={handleDeleteConfirm}
            recordName={recordName}
          />
        </div>
      )}
    </div>
  );
};

export default ClientFormSetting;
