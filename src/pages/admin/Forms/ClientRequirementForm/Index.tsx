import { useState, useEffect } from "react";
import { Table, message, Button, Space, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import useGetAPI from "../../../../hooks/useGetAPI";
import axios from "axios";
import { apiUrl } from "../../../../utils";
import LoadingSpinner from "../../../../components/client/LoadingSpinner";
import UpdateModal from "./UpdateModal";
import DeleteModal from "./DeleteModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Make sure this is imported

// Extend jsPDF type for TypeScript (autoTable)
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ClientFormData {
  id: string;
  key: string;
  fullName: string;
  email: string;
  mobile: string;
  site_location: string;
  site_area: string;
  type_of_building: string;
  project_duration: string;
  access_road_width: string;
  topography: string;
  site_orientation_details: string;
  site_orientation: string[];
  FAR: string;
  GCR: string;
  setback: string;
  no_of_floor: number;
  parking_area: string;
  room_requirements: string;
  status: string;
  createdAt: string;
}

const ClientFormSetting = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data, loading, error } = useGetAPI<ClientFormData[]>(
    `architecture-web-app/forms?refresh=${refreshKey}`,
  );

  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<ClientFormData | null>(
    null,
  );
  const [recordName, setRecordName] = useState<string>("");
  const [pageLoading, setPageLoading] = useState<boolean>(false);

  useEffect(() => {
    if (error) {
      message.error("Failed to fetch client forms: " + error);
    }
  }, [error]);

  // ── PDF Download Handler ───────────────────────────────────────────────
  const handleDownloadPDF = () => {
    if (!data || data.length === 0) {
      message.warning("No data available to download");
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape", // Landscape because there are many columns
      unit: "mm",
      format: "a3", // Changed to A3 for better fit with many columns
    });

    // Title & Metadata
    doc.setFontSize(20);
    doc.setTextColor(38, 34, 98); // #262262
    doc.text("Client Requirement Forms", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(80);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()} • Total Records: ${
        data.length
      }`,
      14,
      32,
    );

    // Main Table
    autoTable(doc, {
      startY: 42,
      head: [
        [
          "SN",
          "Full Name",
          "Mobile",
          "Type of Building",
          "Location of Site",
          "Email",
          "Site Area",
          "Project Duration",
          "Access Road Width",
          "Topography",
          "Site Orientation",
          "By Laws",
          "FAR",
          "GCR",
          "Setback",
          "Requirements",
          "No. of Floors",
          "Basement/Parking",
          "Room Requirements",
        ],
      ],
      body: data.map((item, index) => [
        index + 1,
        item.fullName || "-",
        item.mobile || "-",
        item.type_of_building || "-",
        item.site_location || "-",
        item.email || "-",
        item.site_area || "-",
        item.project_duration || "-",
        item.access_road_width || "-",
        item.topography || "-",
        // Combining both orientation fields
        [
          item.site_orientation_details || "",
          Array.isArray(item.site_orientation)
            ? item.site_orientation.join(", ")
            : "",
        ]
          .filter(Boolean)
          .join(" | ") || "-",
        item.FAR || "-",
        item.GCR || "-",
        item.setback || "-",
        item.no_of_floor ?? "-",
        item.parking_area || "-",
        item.room_requirements || "-",
      ]),
      styles: {
        fontSize: 8.5,
        cellPadding: 3,
        overflow: "linebreak",
        lineWidth: 0.1,
        lineColor: [200, 200, 200],
      },
      headStyles: {
        fillColor: [38, 34, 98],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [248, 248, 255],
      },
      columnStyles: {
        0: { cellWidth: 10 }, // SN
        1: { cellWidth: 30 }, // Full Name
        2: { cellWidth: 22 }, // Mobile
        3: { cellWidth: 28 }, // Type of Building
        4: { cellWidth: 32 }, // Location of Site
        5: { cellWidth: 38 }, // Email
        6: { cellWidth: 22 }, // Site Area
        7: { cellWidth: 24 }, // Project Duration
        8: { cellWidth: 24 }, // Access Road Width
        9: { cellWidth: 24 }, // Topography
        10: { cellWidth: 32 }, // Site Orientation
        11: { cellWidth: 22 }, // By Laws
        12: { cellWidth: 16 }, // FAR
        13: { cellWidth: 16 }, // GCR
        14: { cellWidth: 20 }, // Setback
        15: { cellWidth: 32 }, // Requirements
        16: { cellWidth: 18 }, // No. of Floors
        17: { cellWidth: 26 }, // Basement/Parking
        18: { cellWidth: 36 }, // Room Requirements
      },
      margin: { top: 42, left: 12, right: 12, bottom: 25 },
      didDrawPage: () => {
        // Page number footer
        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text(
          `Page ${
            doc.getCurrentPageInfo().pageNumber
          } of ${doc.getNumberOfPages()}`,
          doc.internal.pageSize.width - 30,
          doc.internal.pageSize.height - 10,
        );
      },
    });

    doc.save(
      `Client_Requirement_Forms_${new Date().toISOString().slice(0, 10)}.pdf`,
    );
  };

  const handleUpdate = async (values: any) => {
    setPageLoading(true);
    try {
      await axios.put(
        `${apiUrl}/architecture-web-app/forms/${editingRecord?.id}`,
        values,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );
      message.success("Client form updated successfully!");
      setEditModalVisible(false);
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      message.error("Failed to update client form");
    } finally {
      setPageLoading(false);
    }
  };

  const handleDeleteClick = (record: ClientFormData) => {
    setEditingRecord(record);
    setRecordName(record.fullName);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    setPageLoading(true);
    try {
      await axios.delete(
        `${apiUrl}/architecture-web-app/forms/${editingRecord?.id}`,
        {
          withCredentials: true,
        },
      );
      message.success(`${editingRecord?.fullName} has been deleted`);
      setDeleteModalVisible(false);
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      message.error("Error deleting client form");
    } finally {
      setPageLoading(false);
    }
  };

  const handleUpdateClick = (record: ClientFormData) => {
    setEditingRecord(record);
    setEditModalVisible(true);
  };

  const columns = [
    {
      title: "SN",
      key: "sn",
      render: (_: any, __: ClientFormData, index: number) => index + 1,
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
      title: "Site Location",
      dataIndex: "site_location",
      key: "site_location",
    },
    {
      title: "Building Type",
      dataIndex: "type_of_building",
      key: "type_of_building",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: ClientFormData) => (
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
      {pageLoading || loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div className="dashboard-Headings">Client Requirement Form</div>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownloadPDF}
              disabled={!data || data.length === 0 || loading}
            >
              Download as PDF
            </Button>
          </div>

          <Table<ClientFormData>
            columns={columns}
            dataSource={
              data?.map((item) => ({ ...item, key: item.id.toString() })) || []
            }
            pagination={{ pageSize: 10 }}
            scroll={{ x: "max-content" }}
            rowKey="id"
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
            recordName={recordName}
          />
        </div>
      )}
    </div>
  );
};

export default ClientFormSetting;
