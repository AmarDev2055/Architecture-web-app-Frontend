import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../../../utils";
import ProjectInnerHeader from "../../../components/client/ProjectInnerHeader";
import ImageViewer from "react-simple-image-viewer";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface Media {
  id: number;
  project_id: number;
  image_type: string;
  filename: string;
  filepath: string;
  fileurl: string;
}

interface Project {
  id: number;
  name: string;
  project_type_id: number;
  location: string;
  site_area: string;
  description: string;
  media: Media[];
}

interface Client {
  id: number;
  project_id: number;
  fullName: string;
  email: string;
  mobile: string;
  address: string;
  project: Project;
}

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const decodeId = (encodedId: string): number | null => {
    try {
      // Add padding back if missing
      const padded = encodedId.padEnd(
        encodedId.length + ((4 - (encodedId.length % 4)) % 4),
        "="
      );
      return parseInt(atob(padded));
    } catch {
      return null;
    }
  };

  const projectId = decodeId(id || "");

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!projectId) return;

    const fetchClientDetails = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/architecture-web-app/projects/get-project/${projectId}`
        );
        const clientData = response.data.data.client;
        setClient(clientData);

        if (clientData?.project?.media?.length > 0) {
          setSelectedImage(
            `${apiUrl}/architecture-web-app${clientData.project.media[0].filepath}`
          );
        }
      } catch (error) {
        console.error("Error fetching client details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [projectId]);

  const featureImage = client?.project?.media.find(
    (img) => img.image_type === "feature"
  )?.filepath;

  const featureImageFull = featureImage
    ? `${apiUrl}/architecture-web-app${featureImage}`
    : undefined;

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setCurrentImageIndex(0);
    setIsViewerOpen(false);
  };

  if (loading) {
    return (
      <div className="project-details-container">
        <ProjectInnerHeader title="PROJECTS" currentPage="PROJECTS" />
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="project-details-container">
        <ProjectInnerHeader title="PROJECTS" currentPage="PROJECTS" />
        <div className="not-found">
          <h2>No project found</h2>
          <Link to="/projects" className="back-button">
            <ArrowLeft className="back-icon" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProjectInnerHeader
        title="PROJECTS"
        currentPage="PROJECTS"
        backgroundImage={featureImageFull}
        projectName={client.project.name}
        address={client.project.location}
      />
      <div className="project-details-container">
        <div className="main-content">
          {/* Back Button */}
          <Link to="/projects" className="back-button">
            <ArrowLeft className="back-icon" />
            Back to Projects
          </Link>

          {/* Main Content Grid */}
          <div className="content-grid">
            {/* Left Column - Project Details */}
            <div className="details-section">
              <div className="info-card">
                <div className="client-info">
                  <div className="client-item">
                    <div>
                      <motion.div
                        className="description-section"
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      >
                        <div className="description-section">
                          <h3>Project Description</h3>
                          <p className="description-text">
                            {client.project.description}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>

              <table className="project-details-table">
                <tbody>
                  <tr>
                    <td className="details-label">Project</td>
                    <td className="details-value">{client.fullName}</td>
                  </tr>
                  <tr>
                    <td className="details-label">Location</td>
                    <td className="details-value">{client.project.location}</td>
                  </tr>
                  <tr>
                    <td className="details-label">Built-Up Area</td>
                    <td className="details-value">
                      {client.project.site_area}
                    </td>
                  </tr>
                  {/* <tr>
                    <td className="details-label">Completed</td>
                    <td className="details-value">2021</td>
                  </tr> */}
                </tbody>
              </table>
            </div>

            {/* Right Column - Image Gallery */}
            <div className="image-section">
              <motion.div
                className="main-image-container"
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                {selectedImage && (
                  <div className="main-image-container">
                    <img
                      src={selectedImage}
                      alt="Selected project view"
                      className="main-image"
                    />
                  </div>
                )}
              </motion.div>

              {client.project.media.length > 1 && (
                <div className="gallery-container">
                  <h3 className="gallery-title">Project Gallery</h3>
                  <div className="thumbnail-grid">
                    {client.project.media.map((media, index) => {
                      const fullPath = `${apiUrl}/architecture-web-app${media.filepath}`;
                      return (
                        <button
                          key={media.id}
                          onClick={() => {
                            setSelectedImage(fullPath);
                            openImageViewer(index);
                          }}
                          className={`thumbnail-button ${
                            selectedImage === fullPath ? "active" : ""
                          }`}
                        >
                          <img
                            src={fullPath}
                            alt={`Project view ${media.id}`}
                            className="thumbnail-image"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {isViewerOpen && (
                <ImageViewer
                  src={client.project.media.map(
                    (m) => `${apiUrl}/architecture-web-app${m.filepath}`
                  )}
                  currentIndex={currentImageIndex}
                  disableScroll={false}
                  closeOnClickOutside={true}
                  onClose={closeImageViewer}
                  backgroundStyle={{
                    backgroundColor: "rgba(0,0,0,0.9)",
                  }}
                />
              )}
            </div>
          </div>
        </div>
        {/* <Layout>
          <ProjectContactSection />
        </Layout> */}
      </div>
    </>
  );
};

export default ProjectDetails;
