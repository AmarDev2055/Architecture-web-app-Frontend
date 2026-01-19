import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import InnerHeader from "../../../components/client/InnerHeader";
import axios from "axios";
import { apiUrl } from "../../../utils";
import ScrollToTop from "../../../components/client/ScrollToTop";
import "./projects.css";

interface ProjectTypes {
  key: string;
  title: string;
  status?: string;
}

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

const Projects = () => {
  const [projectTypes, setProjectTypes] = useState<ProjectTypes[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProjectTypes = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/architecture-web-app/projects/project-types/`
      );

      const fetchedData = response.data.data
        .filter((item: any) => item.status === true)
        .map((item: any) => ({
          key: item.id.toString(),
          title: item.title,
        }));

      setProjectTypes(fetchedData);

      if (fetchedData.length > 0) {
        setSelectedCategory(fetchedData[0].key);
      }
    } catch (error) {
      console.error("Error fetching project types:", error);
    }
  };

  const fetchClients = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}/architecture-web-app/projects/get-clients/${id}`
      );
      setClients(response.data.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const encodeId = (id: number) => btoa(id.toString());

  const handleClientClick = (clientId: number) => {
    const encodedId = encodeId(clientId);
    navigate(`/projects/${encodedId}`);
  };

  const handleCategoryClick = (key: string) => {
    setSelectedCategory(key);
  };

  useEffect(() => {
    fetchProjectTypes();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setClients([]);
      fetchClients(selectedCategory);
    }
  }, [selectedCategory]);

  return (
    <>
      <InnerHeader title="PROJECTS" currentPage="PROJECTS" />
      <section className="project-area-enhanced" id="project">
        <div className="container-enhanced">
          {/* Hero Section */}
          {/* <motion.div
            className="hero-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="hero-subtitle">Explore Our Work</h2>
            <p className="hero-description">
              Discover exceptional architectural projects tailored to perfection
            </p>
          </motion.div> */}

          {/* Enhanced Category Bar */}
          <motion.div
            className="project-types-container"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="project-types-bar-enhanced">
              {projectTypes.map((projectType, index) => (
                <motion.button
                  key={projectType.key}
                  onClick={() => handleCategoryClick(projectType.key)}
                  className={`category-btn-enhanced ${
                    selectedCategory === projectType.key ? "active" : ""
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="btn-text">{projectType.title}</span>
                  {selectedCategory === projectType.key && (
                    <motion.div
                      className="active-indicator"
                      layoutId="activeCategory"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <motion.div
              className="loading-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
              <p className="loading-text">Loading projects...</p>
            </motion.div>
          )}

          {/* Enhanced Client Grid */}
          <AnimatePresence mode="wait">
            {!isLoading && (
              <motion.div
                className="client-grid-enhanced"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {clients.length > 0 ? (
                  clients.map((client, index) => {
                    const featureImage = client.project?.media?.find(
                      (media) => media.image_type === "feature"
                    );

                    const fullImagePath = featureImage
                      ? `${apiUrl}/architecture-web-app${featureImage.filepath}`
                      : "";

                    return (
                      <motion.div
                        key={client.id}
                        className="client-card-enhanced"
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.95 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.1,
                          ease: "easeOut",
                        }}
                        whileHover={{ y: -8 }}
                        onClick={() => handleClientClick(client.id)}
                      >
                        {featureImage && (
                          <div className="card-image-wrapper">
                            <motion.img
                              src={fullImagePath}
                              alt={client.fullName}
                              className="card-image"
                              loading="lazy"
                            />
                            <motion.div
                              className="card-overlay"
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="overlay-content">
                                <motion.div
                                  initial={{ y: 20, opacity: 0 }}
                                  whileHover={{ y: 0, opacity: 1 }}
                                  transition={{ delay: 0.1 }}
                                >
                                  <h3 className="client-name">
                                    {client.fullName}
                                  </h3>
                                  <h4 className="project-name">
                                    {client.project.name}
                                  </h4>
                                  <p className="project-location">
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      style={{
                                        display: "inline",
                                        marginRight: "6px",
                                      }}
                                    >
                                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                      <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    {client.address}
                                  </p>
                                  <div className="view-project-btn">
                                    <span>View Project</span>
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    >
                                      <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                  </div>
                                </motion.div>
                              </div>
                            </motion.div>
                            <div className="card-gradient"></div>
                          </div>
                        )}
                        <div className="card-info">
                          <h3 className="card-title">{client.project.name}</h3>
                          <p className="card-subtitle">{client.fullName}</p>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div
                    className="no-projects-container"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="no-projects-icon">
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </svg>
                    </div>
                    <h3 className="no-projects-title">No Projects Available</h3>
                    <p className="no-projects-text">
                      There are currently no projects in this category. Check
                      back soon!
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <ScrollToTop />
      </section>

      <style jsx>{`
        .project-area-enhanced {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 80px 0;
          position: relative;
          overflow: hidden;
        }

        .project-area-enhanced::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 400px;
          background: radial-gradient(
            ellipse at top,
            rgba(99, 102, 241, 0.1) 0%,
            transparent 70%
          );
          pointer-events: none;
        }

        .container-enhanced {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
          z-index: 1;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 60px;
        }

        .hero-subtitle {
          font-size: 3rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 16px;
          letter-spacing: -1px;
        }

        .hero-description {
          font-size: 1.25rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }

        .project-types-container {
          margin-bottom: 60px;
          position: sticky;
          top: 80px;
          z-index: 10;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
        }

        .project-types-bar-enhanced {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 8px;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .project-types-bar-enhanced::-webkit-scrollbar {
          height: 6px;
        }

        .project-types-bar-enhanced::-webkit-scrollbar-track {
          background: transparent;
        }

        .project-types-bar-enhanced::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .category-btn-enhanced {
          position: relative;
          padding: 14px 28px;
          background: white;
          border: 2px solid transparent;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          overflow: hidden;
        }

        .category-btn-enhanced:hover {
          background: #f8fafc;
          color: #667eea;
          border-color: #e0e7ff;
        }

        .category-btn-enhanced.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
        }

        .btn-text {
          position: relative;
          z-index: 1;
        }

        .active-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 3px 3px 0 0;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          gap: 20px;
        }

        .loading-spinner {
          position: relative;
          width: 60px;
          height: 60px;
        }

        .spinner {
          width: 100%;
          height: 100%;
          border: 4px solid #e0e7ff;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .loading-text {
          font-size: 1.1rem;
          color: #64748b;
          font-weight: 500;
        }

        .client-grid-enhanced {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 32px;
          padding: 20px 0;
        }

        @media (max-width: 768px) {
          .client-grid-enhanced {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        .client-card-enhanced {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .client-card-enhanced:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .card-image-wrapper {
          position: relative;
          width: 100%;
          padding-top: 75%;
          overflow: hidden;
          background: #f1f5f9;
        }

        .card-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .client-card-enhanced:hover .card-image {
          transform: scale(1.08);
        }

        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(102, 126, 234, 0.95) 0%,
            rgba(118, 75, 162, 0.95) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
        }

        .overlay-content {
          text-align: center;
          color: white;
        }

        .client-name {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 8px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .project-name {
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 16px;
          opacity: 0.95;
        }

        .project-location {
          font-size: 0.95rem;
          opacity: 0.9;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .view-project-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: white;
          color: #667eea;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .view-project-btn:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .card-gradient {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.6) 0%,
            transparent 100%
          );
          pointer-events: none;
        }

        .card-info {
          padding: 24px;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .card-subtitle {
          font-size: 0.95rem;
          color: #64748b;
          font-weight: 500;
        }

        .no-projects-container {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 20px;
          text-align: center;
        }

        .no-projects-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
        }

        .no-projects-icon svg {
          stroke: white;
        }

        .no-projects-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 12px;
        }

        .no-projects-text {
          font-size: 1.1rem;
          color: #64748b;
          max-width: 500px;
        }

        @media (max-width: 768px) {
          .hero-subtitle {
            font-size: 2rem;
          }

          .hero-description {
            font-size: 1rem;
          }

          .project-types-container {
            top: 0;
            position: relative;
          }
        }
      `}</style>
    </>
  );
};

export default Projects;
