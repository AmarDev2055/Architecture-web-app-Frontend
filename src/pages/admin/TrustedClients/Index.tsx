import { useState, useEffect } from "react";
import axios from "axios";
import { Space, Table, Button, message, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import CreateClientModal from "./createModal";
import UpdateClientModal from "./updateModal";
import DeleteClientModal from "./deleteModal";
import { apiUrl } from "../../../utils";
import LoadingSpinner from "../../../components/client/LoadingSpinner";

interface DataType {
  key: string;
  name: string;
  link: string;
  filepath: string | null;
  filename: string | null;
  feature: boolean;
}

const ClientSetting = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null);
  const [, setRecordName] = useState<string>("");
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // Fetch data from API
  const fetchData = async () => {
    setPageLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/architecture-web-app/our-clients`, {
        withCredentials: true,
      });
      const fetchedData = response.data.data.map((client: any) => ({
        key: client.id.toString(),
        name: client.name,
        link: client.link,
        filepath: client.filepath || null,
        filename: client.filename || null,
        feature: client.feature,
      }));
      setData(fetchedData);
    } catch (error: unknown) {
      console.error("Error:", (error as Error).message);
      message.error("Failed to fetch clients");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (formData: FormData) => {
    setPageLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/architecture-web-app/our-clients`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        message.success("Client created successfully!");
        setCreateModalVisible(false);
        fetchData();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data.message || "Failed to create client");
      } else {
        message.error("An unexpected error occurred");
      }
    } finally {
      setPageLoading(false);
    }
  };

  const handleUpdate = async (formData: FormData) => {
    setPageLoading(true);
    try {
      const response = await axios.put(
        `${apiUrl}/architecture-web-app/our-clients/${editingRecord?.key}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        message.success("Client updated successfully!");
        setEditModalVisible(false);
        fetchData();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data.message || "Failed to update client");
      } else {
        message.error("An unexpected error occurred");
      }
    } finally {
      setPageLoading(false);
    }
  };

  const handleDeleteClick = (record: DataType) => {
    setEditingRecord(record);
    setRecordName(record.name);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    setPageLoading(true);
    try {
      const response = await axios.delete(
        `${apiUrl}/architecture-web-app/our-clients/${editingRecord?.key}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setData(data.filter((item) => item.key !== editingRecord?.key));
        message.success(`${editingRecord?.name} has been deleted`);
        setDeleteModalVisible(false);
      }
    } catch (error) {
      message.error("Error deleting client");
    } finally {
      setPageLoading(false);
    }
  };

  const handleUpdateClick = (record: DataType) => {
    setEditingRecord(record);
    setEditModalVisible(true);
  };

  const columns = [
    {
      title: "SN",
      dataIndex: "sn",
      render: (_: any, __: DataType, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      render: (link: string) => (
        <a href={link} target="_blank" rel="noopener noreferrer" className="client-link">
          {link}
        </a>
      ),
    },
    {
      title: "Logo",
      dataIndex: "filepath",
      key: "filepath",
      render: (filepath: string | null) =>
        filepath ? (
          <img
            src={`${apiUrl}/architecture-web-app${filepath}`}
            alt="Client Logo"
            style={{ width: 50, height: 50, objectFit: "contain" }}
          />
        ) : (
          <span>No Logo</span>
        ),
    },
    // {
    //   title: "Filename",
    //   dataIndex: "filename",
    //   key: "filename",
    //   render: (filename: string | null) => filename || "N/A",
    // },
    {
      title: "Status",
      dataIndex: "feature",
      key: "feature",
      render: (feature: boolean) => feature ? "Active" : "Inactive",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: DataType) => (
        <Space size="middle">
          <Tooltip title="Update">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleUpdateClick(record)}
              style={{ color: "green", borderColor: "white" }}
            />
          </Tooltip>
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
      {pageLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div className="dashboard-Headings">Client Informations</div>
          <div
            style={{
              marginBottom: "16px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalVisible(true)}
              className="create-btn"
            >
              Create
            </Button>
          </div>

          <Table<DataType>
            columns={columns}
            dataSource={data}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              pageSizeOptions: ['10', '20', '50', '100'],
              showSizeChanger: false,
            }}
            onChange={(pagination) => {
              setPagination({
                current: pagination.current || 1,
                pageSize: pagination.pageSize || 10,
              });
            }}
            scroll={{ x: "max-content" }}
            rowKey="key"
          />

          <CreateClientModal
            visible={createModalVisible}
            onCancel={() => setCreateModalVisible(false)}
            onCreate={handleCreate}
          />

          {editingRecord && (
            <UpdateClientModal
              visible={editModalVisible}
              onCancel={() => setEditModalVisible(false)}
              onUpdate={handleUpdate}
              initialValues={editingRecord}
            />
          )}

          <DeleteClientModal
            visible={deleteModalVisible}
            onCancel={() => setDeleteModalVisible(false)}
            onConfirm={handleDeleteConfirm}
            recordName={editingRecord?.name || ""}
          />
        </div>
      )}
    </div>
  );
};

export default ClientSetting;