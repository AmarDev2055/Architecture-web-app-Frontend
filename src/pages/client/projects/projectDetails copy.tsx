import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../../../utils";
import ProjectInnerHeader from "../../../components/client/ProjectInnerHeader";
import ImageViewer from "react-simple-image-viewer";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, X } from "lucide-react";

interface Video {
  id: number;
  project_id: number;
  video_url: string;
}

interface Media {
  id: number;
  project_id: number;
  image_type: string;
  filename: string;
  filepath: string;
}

interface Project {
  id: number;
  name: string;
  location: string;
  site_area: string;
  description: string;
  media: Media[];
  videos: Video[];
}

interface Client {
  id: number;
  fullName: string;
  project: Project;
}

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
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

  const decodeId = (encodedId: string): number | null => {
    try {
      const padded = encodedId.padEnd(
        encodedId.length + ((4 - (encodedId.length % 4)) % 4),
        "=",
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
          `${apiUrl}/architecture-web-app/projects/get-project/${projectId}`,
        );
        const clientData = response.data.data.client;
        setClient(clientData);

        if (clientData?.project?.media?.length > 0) {
          const feature =
            clientData.project.media.find(
              (m: Media) => m.image_type === "feature",
            ) || clientData.project.media[0];
          setSelectedImage(`${apiUrl}/architecture-web-app${feature.filepath}`);
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
    (img) => img.image_type === "feature",
  )?.filepath;

  const featureImageFull = featureImage
    ? `${apiUrl}/architecture-web-app${featureImage}`
    : undefined;
  if (loading) return <div className="loading-container">Loading...</div>;
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
              display: "flex",
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

          <div
            className="content-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.5fr",
              gap: "50px",
            }}
          >
            {/* LEFT: INFO SECTION */}
            <div className="info-column">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
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
                  {client.project.description}
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
                    <span style={{ color: "#666" }}>{client.fullName}</span>
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
                    <span style={{ color: "#666" }}>
                      {client.project.location}
                    </span>
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
                    <span style={{ color: "#666" }}>
                      {client.project.site_area}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: MEDIA SECTION */}
            <div className="media-column">
              {/* Main Preview */}
              <motion.div
                className="main-image-box"
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
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </motion.div>

              {/* Image Gallery */}
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
                  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                  gap: "12px",
                }}
              >
                {client.project.media.map((img, idx) => {
                  const path = `${apiUrl}/architecture-web-app${img.filepath}`;
                  return (
                    <motion.div
                      key={img.id}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        setSelectedImage(path);
                        setCurrentImageIndex(idx);
                      }}
                      style={{
                        height: "80px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        cursor: "pointer",
                        border:
                          selectedImage === path ? "3px solid #be1e2d" : "none",
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
                        onClick={() => setIsViewerOpen(true)}
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* Video Gallery */}
              {client.project.videos.length > 0 && (
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
                    {client.project.videos.map((vid) => {
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
                            alt="Video"
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
              style={{
                position: "absolute",
                top: "30px",
                right: "30px",
                background: "none",
                border: "none",
                cursor: "pointer",
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
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* IMAGE LIGHTBOX */}
      {isViewerOpen && (
        <ImageViewer
          src={client.project.media.map(
            (m) => `${apiUrl}/architecture-web-app${m.filepath}`,
          )}
          currentIndex={currentImageIndex}
          onClose={() => setIsViewerOpen(false)}
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
