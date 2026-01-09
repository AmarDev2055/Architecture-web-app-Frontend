import { useState, useEffect } from "react";
import axios from "axios";
import { Space, Table, Button, message, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import CreateModal from "./createModal";
import UpdateModal from "./updateModal";
import DeleteModal from "./deleteModal";
import { apiUrl } from "../../../utils";
import LoadingSpinner from "../../../components/client/LoadingSpinner";

interface DataType {
  key: string;
  id: number;
  title: string;
  imagepath: string;
  filepath: string;
  feature: boolean;
  description: string;
}

const BlogsSetting = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // Fetch data from API
  const fetchData = async () => {
    setPageLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}/architecture-web-app/by-laws`
      );
      const fetchedData = response.data.data.map((blog: any) => ({
        key: blog.id.toString(),
        id: blog.id,
        title: blog.title,
        description: blog.description,
        imagepath: blog.imagepath,
        filepath: blog.filepath,
        feature: blog.feature,
      }));
      setData(fetchedData);
    } catch (error: unknown) {
      console.error("Error:", (error as Error).message);
      message.error("Failed to fetch blogs");
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
        `${apiUrl}/architecture-web-app/by-laws`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        message.success("Blog created successfully!");
        setModalVisible(false);
        fetchData();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data.message || "Failed to create blog");
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
        `${apiUrl}/architecture-web-app/by-laws/${editingRecord?.key}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        message.success("Blog updated successfully!");
        setEditModalVisible(false);
        fetchData();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data.message || "Failed to update blog");
      } else {
        message.error("An unexpected error occurred");
      }
    } finally {
      setPageLoading(false);
    }
  };

  const handleDeleteClick = (record: DataType) => {
    setEditingRecord(record);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    setPageLoading(true);
    try {
      const response = await axios.delete(
        `${apiUrl}/architecture-web-app/by-laws/${editingRecord?.key}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setData(data.filter((item) => item.key !== editingRecord?.key));
        message.success(`Blog "${editingRecord?.title}" has been deleted`);
        setDeleteModalVisible(false);
      }
    } catch (error) {
      message.error("Error deleting blog");
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
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <div className="table-description-cell">{text}</div>
      ),
    },
    {
      title: "Image",
      dataIndex: "imagepath",
      key: "imagepath",
      render: (imagepath: string) => (
        imagepath ? (
          <img
            src={`${apiUrl}/architecture-web-app${imagepath}`}
            alt="Blog Image"
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
        ) : (
          <span>No Image</span>
        )
      ),
    },
    {
      title: "File",
      dataIndex: "filepath",
      key: "filepath",
      render: (filepath: string) => (
        <a
          href={`${apiUrl}/architecture-web-app${filepath}`}
          target="_blank"
          rel="noopener noreferrer"
          className="client-link"
        >
          View PDF
        </a>
      ),
    },
    {
      title: "Status",
      dataIndex: "feature",
      key: "feature",
      render: (feature: boolean) => (
        <span>{feature ? "Active" : "Inactive"}</span>
      ),
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
          <div className="dashboard-Headings">Blogs Informations</div>
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
              onClick={() => setModalVisible(true)}
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
              initialValues={editingRecord}
            />
          )}

          <DeleteModal
            visible={deleteModalVisible}
            onCancel={() => setDeleteModalVisible(false)}
            onConfirm={handleDeleteConfirm}
            recordName={editingRecord?.title || ""}
          />
        </div>
      )}
    </div>
  );
};

export default BlogsSetting;