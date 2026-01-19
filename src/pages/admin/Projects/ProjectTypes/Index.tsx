import { useState, useEffect } from "react";
import axios from "axios";
import { Space, Table, Button, message, Tooltip, Card } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import CreateModal from "./createModal";
import UpdateModal from "./updateModal";
import DeleteModal from "./deleteModal";
import { apiUrl } from "../../../../utils";
import LoadingSpinner from "../../../../components/client/LoadingSpinner";
import { Link } from "react-router-dom";

interface DataType {
  key: string;
  id: number;
  category: string;
  status: string;
}

const ProjectCategorySetting = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [, setRecordName] = useState<string>("");
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // Fetch data from API
  const fetchData = async () => {
    setPageLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}/architecture-web-app/projects/project-types/`,
        {
          withCredentials: true, // Added for authentication
        }
      );
      const fetchedData = response.data.data.map((category: any) => ({
        key: category.id.toString(),
        id: category.id,
        category: category.title,
        status: category.status ? "Active" : "Inactive", // Convert boolean to string
      }));
      setData(fetchedData);
    } catch (error: unknown) {
      console.error("Error:", (error as Error).message);
      message.error("Failed to fetch project categories");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (values: { title: string; status: string }) => {
    setPageLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/architecture-web-app/projects/project-types/`,
        values, // Send as is, do not convert status
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        message.success("Project category created successfully!");
        setModalVisible(false);
        fetchData();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        message.error(
          error.response?.data.message || "Failed to create project category"
        );
      } else {
        message.error("An unexpected error occurred");
      }
    } finally {
      setPageLoading(false);
    }
  };

  const handleUpdate = async (values: { title: string; status: string }) => {
    setPageLoading(true);
    try {
      const response = await axios.put(
        `${apiUrl}/architecture-web-app/projects/project-types/${editingRecord?.key}`,
        values, // Send as is, do not convert status
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        message.success("Project category updated successfully!");
        setEditModalVisible(false);
        fetchData();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        message.error(
          error.response?.data.message || "Failed to update project category"
        );
      } else {
        message.error("An unexpected error occurred");
      }
    } finally {
      setPageLoading(false);
    }
  };

  const handleDeleteClick = (record: DataType) => {
    setEditingRecord(record);
    setRecordName(record.category);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    setPageLoading(true);
    try {
      const response = await axios.delete(
        `${apiUrl}/architecture-web-app/projects/project-types/${editingRecord?.key}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setData(data.filter((item) => item.key !== editingRecord?.key));
        message.success(`${editingRecord?.category} has been deleted`);
        setDeleteModalVisible(false);
      }
    } catch (error) {
      message.error("Error deleting project category");
    } finally {
      setPageLoading(false);
    }
  };

  const handleUpdateClick = (record: DataType) => {
    setEditingRecord({
      ...record,
      status: record.status === "Active" ? "1" : "0",
    });
    setEditModalVisible(true);
  };

  const columns = [
    {
      title: "SN",
      key: "sn",
      render: (_: any, __: DataType, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => status || "N/A", // Ensure status is displayed
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: DataType) => (
        <Space size="middle">
          <Tooltip title="View Clients">
            <Link to={`/admin/projects-clients/${record.id}`}>
              <Button
                icon={<EyeOutlined />}
                style={{ color: "blue", borderColor: "white" }}
              />
            </Link>
          </Tooltip>
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
        <>
          <Card bordered={false} style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)' }}>
            <div
              className="button-container"
              style={{
                marginBottom: "16px",
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
                className="create-btn"
              >
                Create
              </Button>
            </div>

            <Table<DataType>
              columns={columns}
              dataSource={[...data].sort((a, b) => a.id - b.id)}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                pageSizeOptions: ["10", "20", "50", "100"],
                showSizeChanger: false,
                // position: ['bottomLeft'],
              }}
              onChange={(pagination) => {
                setPagination({
                  current: pagination.current || 1,
                  pageSize: pagination.pageSize || 10,
                });
              }}
              scroll={{ x: "max-content" }}
              rowKey="id"
            />
          </Card>

          <CreateModal
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            onCreate={handleCreate}
          />

          {editingRecord && (
            <UpdateModal
              visible={editModalVisible}
              onCancel={() => setEditModalVisible(false)}
              onUpdate={handleUpdate}
              initialValues={{
                category: editingRecord.category,
                status: editingRecord.status,
              }}
            />
          )}

          <DeleteModal
            visible={deleteModalVisible}
            onCancel={() => setDeleteModalVisible(false)}
            onConfirm={handleDeleteConfirm}
            recordName={editingRecord?.category || ""}
          />
        </>
      )}
    </div>
  );
};

export default ProjectCategorySetting;
