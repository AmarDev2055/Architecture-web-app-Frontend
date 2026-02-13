import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../../../utils";
import { decodeIdToNumber } from "../../../utils/idEncoder";
import ProjectInnerHeader from "../../../components/client/ProjectInnerHeader";
import ImageViewer from "react-simple-image-viewer";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, X } from "lucide-react";

interface Media {
  id: number;
  project_id: number;
  image_type: string;
  filename: string;
  filepath: string;
  fileurl: string | null;
}

interface Video {
  id: number;
  project_id: number;
  video_url: string;
}

interface Project {
  id: number;
  name: string;
  project_type_id: number;
  location: string;
  site_area: string;
  description: string;
  media: Media[];
  videos: Video[];
  status: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
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

interface ProjectDetailsProps {
  isClient: boolean;
}

const ProjectDetails = ({ isClient }: ProjectDetailsProps) => {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // State for Video Lightbox
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Helper to extract YouTube ID and build Thumbnail/Embed URLs
  const getYoutubeData = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return {
      id: videoId,
      embed: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
      thumb: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };
  };

  // Decode the ID from URL to get the actual project ID
  const projectId = decodeIdToNumber(id);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProjectDetails = async () => {
      setLoading(true);

      if (!projectId) {
        console.error("Invalid project ID");
        setLoading(false);
        return;
      }

      try {
        let response;

        if (isClient) {
          // For client projects (from /projectByClient route)
          console.log("Fetching client project with ID:", projectId);
          response = await axios.get(
            `${apiUrl}/architecture-web-app/projects/get-project/${projectId}`,
          );

          const responseData = response.data;
          console.log("Client project response:", responseData);

          if (responseData?.data?.client) {
            const clientData = responseData.data.client as Client;
            setClient(clientData);
            setProject(clientData.project);

            // Set the selected image if media exists
            if (clientData.project?.media?.length > 0) {
              const feature =
                clientData.project.media.find(
                  (m: Media) => m.image_type === "feature",
                ) || clientData.project.media[0];
              setSelectedImage(
                `${apiUrl}/architecture-web-app${feature.filepath}`,
              );
            }
          }
        } else {
          // For regular projects (from /projects route)
          console.log("Fetching regular project with ID:", projectId);
          response = await axios.get(
            `${apiUrl}/architecture-web-app/projects/get-project-by-id/${projectId}`,
          );

          const responseData = response.data;
          console.log("Regular project response:", responseData);

          // Based on your console output, the project data is directly in response.data.data
          if (responseData?.data) {
            // The project data is directly in responseData.data (not nested in client)
            const projectData = responseData.data as Project;
            console.log("Project data:", projectData);

            setProject(projectData);

            // Set the selected image if media exists
            if (projectData.media && projectData.media.length > 0) {
              const feature =
                projectData.media.find(
                  (m: Media) => m.image_type === "feature",
                ) || projectData.media[0];
              const imagePath = `${apiUrl}/architecture-web-app${feature.filepath}`;
              console.log("Setting selected image:", imagePath);
              setSelectedImage(imagePath);
            } else {
              console.log("No media found in project data");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId, isClient]);

  // Get the feature image for the header
  const getFeatureImage = (): string | undefined => {
    const media = project?.media || client?.project?.media || [];
    const featureImage = media.find((img) => img.image_type === "feature");
    return featureImage
      ? `${apiUrl}/architecture-web-app${featureImage.filepath}`
      : undefined;
  };

  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setCurrentImageIndex(0);
    setIsViewerOpen(false);
  };

  // const handleBackToProjects = () => {
  //   navigate("/projects");
  // };

  // Get the media array safely
  const getMediaArray = (): Media[] => {
    if (project?.media && project.media.length > 0) {
      return project.media;
    }
    if (client?.project?.media && client.project.media.length > 0) {
      return client.project.media;
    }
    return [];
  };

  // Get project name safely
  const getProjectName = (): string => {
    if (project?.name) return project.name;
    if (client?.project?.name) return client.project.name;
    return "Untitled Project";
  };

  // Get project location safely
  const getProjectLocation = (): string => {
    if (project?.location) return project.location;
    if (client?.project?.location) return client.project.location;
    return "Location not specified";
  };

  // Get project description safely
  const getProjectDescription = (): string => {
    if (project?.description) return project.description;
    if (client?.project?.description) return client.project.description;
    return "No description available";
  };

  // Get project site area safely
  const getProjectSiteArea = (): string => {
    if (project?.site_area) return project.site_area;
    if (client?.project?.site_area) return client.project.site_area;
    return "Not specified";
  };

  // Get client name safely
  const getClientName = (): string => {
    if (client?.fullName) return client.fullName;
    if (project?.name) return project.name;
    return getProjectName();
  };

  const mediaArray = getMediaArray();
  const featureImage = getFeatureImage();
  const projectName = getProjectName();
  const projectLocation = getProjectLocation();
  const projectDescription = getProjectDescription();
  const projectSiteArea = getProjectSiteArea();
  const clientName = getClientName();

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

  if (!project && !client) {
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

  // Get the project data from either state
  const displayProject = project || client?.project;
  // const displayClient = client;

  if (!displayProject) {
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
        backgroundImage={featureImage}
        projectName={projectName}
        address={projectLocation}
      />

      <div
        className="project-details-container"
        style={{ padding: "60px 20px", backgroundColor: "#f9f9f9" }}
      >
        <div
          className="main-content"
          style={{ maxWidth: "1300px", margin: "0 auto" }}
        >
          <Link
            to="/projects"
            className="back-link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "30px",
              color: "#be1e2d",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            <ArrowLeft size={20} /> Back to Projects
          </Link>

          <div className="content-grid">
            {/* LEFT: INFO SECTION */}
            <div className="info-column">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h3
                  style={{
                    fontSize: "24px",
                    color: "#262262",
                    marginBottom: "20px",
                  }}
                >
                  Project Description
                </h3>
                <p
                  style={{
                    color: "#555",
                    lineHeight: "1.8",
                    fontSize: "16px",
                    marginBottom: "40px",
                  }}
                >
                  {projectDescription}
                </p>

                <div
                  className="specs-table"
                  style={{
                    background: "#fff",
                    padding: "30px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "15px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <span style={{ fontWeight: "700", color: "#262262" }}>
                      CLIENT
                    </span>
                    <span style={{ color: "#666" }}>{clientName}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "15px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <span style={{ fontWeight: "700", color: "#262262" }}>
                      LOCATION
                    </span>
                    <span style={{ color: "#666" }}>{projectLocation}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "15px 0",
                    }}
                  >
                    <span style={{ fontWeight: "700", color: "#262262" }}>
                      SITE AREA
                    </span>
                    <span style={{ color: "#666" }}>{projectSiteArea}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: MEDIA SECTION */}
            <div className="media-column">
              {/* Main Preview */}
              {selectedImage ? (
                <motion.div
                  className="main-image-box"
                  initial={{ opacity: 0, y: -100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  style={{
                    width: "100%",
                    height: "450px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    marginBottom: "20px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  }}
                >
                  <img
                    src={selectedImage}
                    alt="Feature"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </motion.div>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "450px",
                    borderRadius: "16px",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f0f0f0",
                    color: "#666",
                  }}
                >
                  <p>No image available</p>
                </div>
              )}

              {/* Image Gallery */}
              {mediaArray.length > 1 && (
                <>
                  <h4
                    style={{
                      margin: "30px 0 15px",
                      color: "#262262",
                      fontSize: "18px",
                    }}
                  >
                    Project Gallery
                  </h4>
                  <div
                    className="thumb-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(100px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    {mediaArray.map((img, idx) => {
                      const path = `${apiUrl}/architecture-web-app${img.filepath}`;
                      return (
                        <motion.div
                          key={img.id}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => {
                            setSelectedImage(path);
                            setCurrentImageIndex(idx);
                            openImageViewer(idx);
                          }}
                          style={{
                            height: "80px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            cursor: "pointer",
                            border:
                              selectedImage === path
                                ? "3px solid #be1e2d"
                                : "none",
                          }}
                        >
                          <img
                            src={path}
                            alt="Gallery"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Video Gallery */}
              {displayProject.videos && displayProject.videos.length > 0 && (
                <>
                  <h4
                    style={{
                      margin: "40px 0 15px",
                      color: "#262262",
                      fontSize: "18px",
                    }}
                  >
                    Video Walkthrough
                  </h4>
                  <div
                    className="video-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "20px",
                    }}
                  >
                    {displayProject.videos.map((vid) => {
                      const yt = getYoutubeData(vid.video_url);
                      return (
                        <motion.div
                          key={vid.id}
                          className="video-card"
                          whileHover={{ y: -5 }}
                          onClick={() => setActiveVideo(yt.embed)}
                          style={{
                            position: "relative",
                            borderRadius: "12px",
                            overflow: "hidden",
                            cursor: "pointer",
                            background: "#000",
                            aspectRatio: "16/9",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              zIndex: 2,
                              background: "rgba(0,0,0,0.3)",
                            }}
                          >
                            <div
                              style={{
                                width: "50px",
                                height: "50px",
                                background: "#be1e2d",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                              }}
                            >
                              <Play fill="white" size={20} />
                            </div>
                          </div>
                          <img
                            src={yt.thumb}
                            alt="Video thumbnail"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              opacity: 0.7,
                            }}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* VIDEO LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.95)",
              zIndex: 99999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <button
              onClick={() => setActiveVideo(null)}
              style={{
                position: "absolute",
                top: "30px",
                right: "30px",
                background: "none",
                border: "none",
                cursor: "pointer",
                zIndex: 100000,
              }}
            >
              <X color="white" size={40} />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "1100px",
                aspectRatio: "16/9",
                background: "#000",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <iframe
                src={activeVideo}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
                title="YouTube video player"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* IMAGE LIGHTBOX */}
      {isViewerOpen && mediaArray.length > 0 && (
        <ImageViewer
          src={mediaArray.map(
            (m) => `${apiUrl}/architecture-web-app${m.filepath}`,
          )}
          currentIndex={currentImageIndex}
          onClose={closeImageViewer}
          disableScroll={false}
          closeOnClickOutside={true}
          backgroundStyle={{
            backgroundColor: "rgba(0,0,0,0.95)",
            zIndex: 99999,
          }}
        />
      )}
    </>
  );
};

export default ProjectDetails;
