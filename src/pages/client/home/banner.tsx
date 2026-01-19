import {
  Button,
  Typography,
  Form,
  Input,
  Drawer,
  Checkbox,
  Row,
  Col,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  User,
  MapPin,
  Ruler,
  Clock,
  Mountain,
  Compass,
  Layers,
  ParkingCircle,
  FileText,
  ArrowRight,
  Mail,
  Phone,
} from "lucide-react";
import usePostAPI from "../../../hooks/usePostAPI";
// import { apiUrl } from "../../../utils";
import useGetAPI from "../../../hooks/useGetAPI";
import bgVideo from "../../../assets/Videos/BannerVideo.mp4"; // Adjust path as needed

interface BannerData {
  id: number;
  imageUrl: string;
  filepath: string;
  heading: string;
  subHeading: string;
  description: string;
}

interface BannerComponentProps {
  bannerData: BannerData;
}

interface ProjectType {
  id: number;
  title: string;
  status: boolean;
}

const BannerComponent = ({ bannerData }: BannerComponentProps) => {
  const { Title, Text } = Typography;
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form] = Form.useForm();
  const { postData, loading, error } = usePostAPI("architecture-web-app/forms");

  // Fetch project types for the dropdown
  const { data: projectTypes, loading: projectTypesLoading } = useGetAPI<
    ProjectType[]
  >("architecture-web-app/projects/active-project-types", true, true);

  // Function to construct full URL for the video
  // const getVideoUrl = (filepath: string) => {
  //   return `${apiUrl}/architecture-web-app${filepath}`;
  // };

  const handleSubmit = async (values: any) => {
    try {
      // Map form values to API request format
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
        no_of_floor: values.noOfFloorRequired
          ? parseInt(values.noOfFloorRequired, 10)
          : undefined,
        parking_area: values.basementOrParkingArea,
        room_requirements: values.roomRequirements,
      };

      // Send POST request
      await postData(requestData);
      // message.success("Form submitted successfully!");
      setIsDrawerOpen(false);
      form.resetFields();
    } catch (err) {
      // message.error("Failed to submit form. Please try again.");
      console.error("Form submission error:", err);
    }
  };

  return (
    <div className="banner">
      <div className="video-wrapper">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="banner-video blur-video"
        >
          {/*{<source src={getVideoUrl(bannerData.filepath)} type="video/mp4" />} */}
          <source src={bgVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="container">
          <div className="banner-info">
            <Title style={{ margin: "0" }} level={3}>
              {bannerData.heading}
            </Title>
            <Text className="banner-info--text">
              <span>{bannerData.subHeading}</span>
            </Text>
            <Text className="banner-info--description">
              {bannerData.description}
            </Text>
            <Button size="large" onClick={() => navigate("/about")}>
              <span>
                Know More <ArrowRight />
              </span>
            </Button>
          </div>
        </div>

        <Button className="side-button" onClick={() => setIsDrawerOpen(true)}>
          Book Here
        </Button>

        <div className="banner-ribbon">
          <Text className="ribbon-text">
            <span className="service-item">ARCHITECTURE</span>
            <span className="service-item">INTERIOR DESIGN</span>
            <span className="service-item">CONSTRUCTION</span>
            <span className="service-item">RENOVATION</span>
            <span className="service-item">SITE SUPERVISION</span>
            <span className="service-item">ESTIMATION</span>
            <span className="service-item">VAASTU CONSULTANTS</span>
            <span className="service-item">NAKSA PASS</span>
          </Text>
        </div>

        <Drawer
          title={<div className="drawer-title">Client Requirement Form</div>}
          placement="right"
          onClose={() => setIsDrawerOpen(false)}
          open={isDrawerOpen}
          width={600}
          className="booking-drawer"
        >
          <div>
            Note:
            <span style={{ color: "#ff4d4f", fontSize: "1.125rem" }}> *</span>
            <span style={{ color: "#ff4d4f", fontSize: "0.925rem" }}>
              {" "}
              चिन्हित स्थानहरू अनिवार्य रूपमा भरिनु पर्दछ।
            </span>
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="consultation-form"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="fullName"
                  label="Full Name"
                  rules={[
                    { required: true, message: "Please enter your full name" },
                  ]}
                >
                  <Input
                    prefix={<User className="form-icon" />}
                    placeholder="Enter your full name"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="mobile"
                  label="Mobile"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your mobile number",
                    },
                  ]}
                >
                  <Input
                    prefix={<Phone className="form-icon" />}
                    placeholder="Enter your mobile number"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
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
                    // prefix={<HomeOutlined/>}
                    placeholder="Select building type"
                    loading={projectTypesLoading}
                    options={projectTypes?.map((type: ProjectType) => ({
                      value: type.title,
                      label: type.title,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="locationOfSite"
                  label="Location of Site"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Location of Site",
                    },
                  ]}
                >
                  <Input
                    prefix={<MapPin className="form-icon" />}
                    placeholder="Enter site location"
                  />
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
                  <Input
                    prefix={<Mail className="form-icon" />}
                    placeholder="Enter your email"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="siteArea" label="Site Area">
                  <Input
                    prefix={<Ruler className="form-icon" />}
                    placeholder="Enter site area (e.g., sq ft)"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="projectDuration" label="Project Duration">
                  <Input
                    prefix={<Clock className="form-icon" />}
                    placeholder="Enter project duration (e.g., months)"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="accessRoadWidth" label="Access Road Width">
                  <Input
                    prefix={<Ruler className="form-icon" />}
                    placeholder="Enter road width (e.g., ft)"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="topography" label="Topography">
                  <Input
                    prefix={<Mountain className="form-icon" />}
                    placeholder="Enter topography (e.g., flat, sloped)"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="siteOrientationText"
                  label="Site Orientation (Text)"
                >
                  <Input
                    prefix={<Compass className="form-icon" />}
                    placeholder="Enter site orientation details"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="siteOrientation"
              label="Site Orientation (Check all that apply)"
            >
              <Checkbox.Group className="orientation-checkboxes">
                <Checkbox value="north">North</Checkbox>
                <Checkbox value="east">East</Checkbox>
                <Checkbox value="south">South</Checkbox>
                <Checkbox value="west">West</Checkbox>
              </Checkbox.Group>
            </Form.Item>

            <div className="form-fieldset">
              <div className="fieldset-legend">By Laws</div>
              <Form.Item name="far" label="FAR">
                <Input
                  prefix={<FileText className="form-icon" />}
                  placeholder="Enter FAR"
                />
              </Form.Item>
              <Form.Item name="gcr" label="GCR">
                <Input
                  prefix={<FileText className="form-icon" />}
                  placeholder="Enter GCR"
                />
              </Form.Item>
              <Form.Item name="setback" label="Setback">
                <Input
                  prefix={<FileText className="form-icon" />}
                  placeholder="Enter setback"
                />
              </Form.Item>
            </div>

            <div className="form-fieldset">
              <div className="fieldset-legend">Requirements</div>
              <Form.Item name="noOfFloorRequired" label="No. of Floor Required">
                <Input
                  type="number"
                  prefix={<Layers className="form-icon" />}
                  placeholder="Enter number of floors"
                />
              </Form.Item>
              <Form.Item
                name="basementOrParkingArea"
                label="Basement or Parking Area"
              >
                <Input
                  prefix={<ParkingCircle className="form-icon" />}
                  placeholder="Enter basement/parking details"
                />
              </Form.Item>
            </div>

            <Form.Item name="roomRequirements" label="Room Requirements">
              <Input.TextArea placeholder="Enter room requirements" rows={5} />
            </Form.Item>

            <Form.Item className="submit-button">
              <Button type="primary" htmlType="submit" block loading={loading}>
                Submit
              </Button>
            </Form.Item>
            {error && <Text type="danger">Error: {error}</Text>}
          </Form>
        </Drawer>
      </div>
    </div>
  );
};

export default BannerComponent;
