import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Checkbox, Button, Row, Col, Select } from "antd";
import LoadingSpinner from "../../../../components/client/LoadingSpinner";
import useGetAPI from "../../../../hooks/useGetAPI";

interface UpdateModalProps {
  visible: boolean;
  onCancel: () => void;
  onUpdate: (values: any) => Promise<void>;
  initialValues: any;
}

interface ProjectType {
  id: number;
  title: string;
  status: boolean;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ visible, onCancel, onUpdate, initialValues }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const { data: projectTypes, loading: projectTypesLoading } = useGetAPI<
  ProjectType[]
>("architecture-web-app/projects/active-project-types", true, true);

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        fullName: initialValues.fullName,
        email: initialValues.email,
        mobile: initialValues.mobile,
        locationOfSite: initialValues.site_location,
        siteArea: initialValues.site_area,
        typeOfBuilding: initialValues.type_of_building,
        projectDuration: initialValues.project_duration,
        accessRoadWidth: initialValues.access_road_width,
        topography: initialValues.topography,
        siteOrientationText: initialValues.site_orientation_details,
        siteOrientation: initialValues.site_orientation,
        far: initialValues.FAR,
        gcr: initialValues.GCR,
        setback: initialValues.setback,
        noOfFloorRequired: initialValues.no_of_floor,
        basementOrParkingArea: initialValues.parking_area,
        roomRequirements: initialValues.room_requirements,
      });
    }
  }, [visible, initialValues, form]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const requestData = {
        fullName: values.fullName,
        email: values.email,
        mobile: values.mobile,
        site_location: values.locationOfSite,
        site_area: values.siteArea,
        type_of_building: values.typeOfBuilding,
        project_duration: values.projectDuration,
        access_road_width: values.accessRoadWidth,
        topography: values.topography,
        site_orientation_details: values.siteOrientationText,
        site_orientation: values.siteOrientation || [],
        FAR: values.far,
        GCR: values.gcr,
        setback: values.setback,
        no_of_floor: values.noOfFloorRequired ? parseInt(values.noOfFloorRequired, 10) : undefined,
        parking_area: values.basementOrParkingArea,
        room_requirements: values.roomRequirements,
      };
      await onUpdate(requestData);
      form.resetFields();
    } catch (error) {
      console.error("Validation Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Modal
      title="Update Client Form"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleUpdate} disabled={loading}>
          Update
        </Button>,
      ]}
      width={850}
      className="testimonial-modal"
      destroyOnClose
    >
      <Form form={form} layout="vertical" className="compact-form">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[{ required: true, message: "Please enter your full name" }]}
            >
              <Input className="fullName" placeholder="Enter your full name" disabled={loading} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="mobile"
              label="Mobile"
              rules={[{ required: true, message: "Please enter your mobile number" }]}
            >
              <Input className="fullName" placeholder="Enter your mobile number" disabled={loading} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
        <Col span={12}>
            {/* <Form.Item name="typeOfBuilding" label="Type of Building">
              <Input className="fullName" placeholder="Enter building type (e.g., residential)" disabled={loading} />
            </Form.Item> */}

            <Col span={12}>
                <Form.Item
                  name="typeOfBuilding"
                  label="Type of Building"
                  
                  rules={[
                    {
                      required: true,
                      message: "Please select Type of Building",
                    },
                  ]}
                  // style={{ height: '500%' }}
                >
                  <Select
                    placeholder="Enter building type (e.g., residential)"
                    className="fullName"
                    style={{ width: '210%' }}
                    loading={projectTypesLoading}
                    options={projectTypes?.map((type: ProjectType) => ({
                      value: type.title,
                      label: type.title,
                    }))}
                  />
                </Form.Item>
              </Col>
          </Col>
          <Col span={12}>
            <Form.Item name="locationOfSite" label="Location of Site">
              <Input className="fullName" placeholder="Enter site location" disabled={loading} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
        <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                // { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input className="fullName" placeholder="Enter your email" disabled={loading} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="siteArea" label="Site Area">
              <Input className="fullName" placeholder="Enter site area (e.g., sq ft)" disabled={loading} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="projectDuration" label="Project Duration">
              <Input className="fullName" placeholder="Enter project duration (e.g., months)" disabled={loading} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="accessRoadWidth" label="Access Road Width">
              <Input className="fullName" placeholder="Enter road width (e.g., ft)" disabled={loading} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="topography" label="Topography">
              <Input className="fullName" placeholder="Enter topography (e.g., flat, sloped)" disabled={loading} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="siteOrientationText" label="Site Orientation (Text)">
              <Input className="fullName" placeholder="Enter site orientation details" disabled={loading} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="siteOrientation" label="Site Orientation (Check all that apply)">
          <Checkbox.Group className="orientation-checkboxes" disabled={loading}>
            <Checkbox value="north">North</Checkbox>
            <Checkbox value="east">East</Checkbox>
            <Checkbox value="south">South</Checkbox>
            <Checkbox value="west">West</Checkbox>
          </Checkbox.Group>
        </Form.Item>
        <div className="form-fieldset">
          <div className="fieldset-legend">By Laws</div>
          <Form.Item name="far" label="FAR">
            <Input className="fullName" placeholder="Enter FAR" disabled={loading} />
          </Form.Item>
          <Form.Item name="gcr" label="GCR">
            <Input className="fullName" placeholder="Enter GCR" disabled={loading} />
          </Form.Item>
          <Form.Item name="setback" label="Setback">
            <Input className="fullName" placeholder="Enter setback" disabled={loading} />
          </Form.Item>
        </div>
        <div className="form-fieldset">
          <div className="fieldset-legend">Requirements</div>
          <Form.Item name="noOfFloorRequired" label="No. of Floor Required">
            <Input type="number" className="fullName" placeholder="Enter number of floors" disabled={loading} />
          </Form.Item>
          <Form.Item name="basementOrParkingArea" label="Basement or Parking Area">
            <Input className="fullName" placeholder="Enter basement/parking details" disabled={loading} />
          </Form.Item>
        </div>
        <Form.Item name="roomRequirements" label="Room Requirements">
          <Input.TextArea placeholder="Enter room requirements" rows={5} disabled={loading} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateModal;