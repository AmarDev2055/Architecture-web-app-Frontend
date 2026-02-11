import { useState, useEffect } from "react";
import axios from "axios";
import { Space, Table, Button, message, Tooltip, Switch } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import CreateModal from "./createModal";
import UpdateModal from "./updateModal";
import DeleteModal from "./deleteModal";
import { apiUrl } from "../../../utils";
import LoadingSpinner from "../../../components/client/LoadingSpinner";

interface DataType {
    key: string;
    name: string;
    designation: string;
    contact_no: string;
    email: string | null;
    is_featured: boolean;
    order: number;
    filename: string | null;
    filepath: string | null;
}

const TeamsSetting = () => {
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
                `${apiUrl}/architecture-web-app/team-members`,
                { withCredentials: true }
            );
            const fetchedData = response.data.data.map((teamMember: any) => ({
                key: teamMember.id?.toString(),
                name: teamMember.name,
                designation: teamMember.designation,
                contact_no: teamMember.contact_no,
                email: teamMember.email,
                is_featured: teamMember.is_featured,
                order: teamMember.order,
                filepath: teamMember.filepath || null,
                filename: teamMember.filename || null,
            }));
            setData(fetchedData);
        } catch (error: unknown) {
            console.error("Error:", (error as Error).message);
            message.error("Failed to fetch team members");
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
                `${apiUrl}/architecture-web-app/team-members`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 201) {
                message.success("Team member created successfully!");
                setModalVisible(false);
                fetchData();
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                message.error(
                    error.response?.data.message || "Failed to create team member"
                );
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
            // Assuming the API follows the same pattern where ID is appended
            const response = await axios.put(
                `${apiUrl}/architecture-web-app/team-members/${editingRecord?.key}`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response.status === 200) {
                message.success("Team member updated successfully!");
                setEditModalVisible(false);
                fetchData();
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                message.error(
                    error.response?.data.message || "Failed to update team member"
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
        setRecordName(record.name);
        setDeleteModalVisible(true);
    };

    const handleDeleteConfirm = async () => {
        setPageLoading(true);
        try {
            const response = await axios.delete(
                `${apiUrl}/architecture-web-app/team-members/${editingRecord?.key}`,
                { withCredentials: true }
            );
            if (response.status === 200) {
                setData(data.filter((item) => item.key !== editingRecord?.key));
                message.success(`${editingRecord?.name} has been deleted`);
                setDeleteModalVisible(false);
            }
        } catch (error) {
            message.error("Error deleting record");
        } finally {
            setPageLoading(false);
        }
    };

    const handleUpdateClick = (record: DataType) => {
        setEditingRecord(record);
        setEditModalVisible(true);
    };

    const handleFeaturedToggle = async (checked: boolean, record: DataType) => {
        setPageLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", record.name);
            formData.append("designation", record.designation);
            formData.append("contact_no", record.contact_no);
            formData.append("email", record.email ?? "");
            formData.append("is_featured", checked ? "true" : "false");
            formData.append("order", record.order.toString());
            if (record.filepath) {
                formData.append("image", record.filepath);
            }

            const response = await axios.put(
                `${apiUrl}/architecture-web-app/team-members/${record.key}`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                message.success("Status updated successfully");
                fetchData();
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                message.error(
                    error.response?.data.message || "Failed to update status"
                );
            } else {
                message.error("An unexpected error occurred");
            }
        } finally {
            setPageLoading(false);
        }
    }

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
            title: "Designation",
            dataIndex: "designation",
            key: "designation",
        },
        {
            title: "Contact No",
            dataIndex: "contact_no",
            key: "contact_no",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            ellipsis: false,
            render: (email: string | null) => (
                <span
                    style={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        lineHeight: 1.4,
                    }}
                >
                    {email || "N/A"}
                </span>
            ),
        },
        {
            title: "Is Featured",
            dataIndex: "is_featured",
            key: "is_featured",
            render: (is_featured: boolean, record: DataType) => (
                <Switch
                    checked={is_featured}
                    onChange={(checked) => handleFeaturedToggle(checked, record)}
                />
            ),
        },
        {
            title: "Order",
            dataIndex: "order",
            key: "order",
        },
        {
            title: "Image",
            dataIndex: "filepath",
            key: "filepath",
            render: (filepath: string | null) =>
                filepath ? (
                    <img
                        src={`${apiUrl}/architecture-web-app${filepath}`}
                        alt="Team Member"
                        style={{ width: 30, height: 30, borderRadius: "50%" }}
                    />
                ) : (
                    <span>No Image</span>
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
                    <div className="dashboard-Headings">Team Settings</div>
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
                        dataSource={data}
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            pageSizeOptions: ["10", "20", "50", "100"],
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
                        recordName={editingRecord?.name || ""}
                    />
                </div>
            )}
        </div>
    );
};

export default TeamsSetting;
