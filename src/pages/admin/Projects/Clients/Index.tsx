import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Space, Table, Tooltip, message } from "antd";
import { apiUrl } from "../../../../utils";
import LoadingSpinner from "../../../../components/client/LoadingSpinner";
import { Link, useParams } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";

interface DataType {
  key: string;
  id: number;
  fullName: string;
  email: string;
  mobile: string;
  address: string;
  project_id: number; // Added to match the API response
}

const Clients = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<DataType[]>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(false);

  // Fetch clients from API
  const fetchData = async () => {
    console.log(id);
    let url;
    if (!id) {
      url = `${apiUrl}/architecture-web-app/projects/get-clients`;
    } else {
      url = `${apiUrl}/architecture-web-app/projects/get-clients/${id}`;
    }
    setPageLoading(true);
    try {
      const response = await axios.get(url);
      const fetchedData = response.data.data.map((client: any) => ({
        key: client.id.toString(),
        id: client.id,
        fullName: client.fullName,
        email: client.email,
        mobile: client.mobile,
        address: client.address,
        project_id: client.project_id, // Include project_id from the response
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
  }, [id]);

  const columns = [
    {
      title: "SN",
      key: "sn",
      render: (_: any, __: DataType, index: number) => index + 1, // Auto-increment starting from 1
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: DataType) => (
        <Space size="middle">
          <Tooltip title="View Projects">
            {/* <Link to={`/admin/projects-settings/${record.project_id}`}> */}
            <Link to={`/admin/projects-settings/${record.id}`}>
              <Button
                icon={<EyeOutlined />}
                style={{ color: "purple", borderColor: "white" }}
              />
            </Link>
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
          <div
            style={{
              marginBottom: "16px",
              display: "flex",
              justifyContent: "space-between",
            }}
          ></div>

          <Table<DataType>
            columns={columns}
            dataSource={[...data].sort((a, b) => a.id - b.id)}
            pagination={{ pageSize: 10 }}
            scroll={{ x: "max-content" }}
            rowKey="id" // Use API-provided id for unique row key
          />
        </div>
      )}
    </div>
  );
};

export default Clients;
