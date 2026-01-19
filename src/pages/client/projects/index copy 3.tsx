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
      <section className="project-section">
        <div className="project-container">
          {/* Category Filter */}
          <div className="filter-wrapper">
            <div className="filter-bar">
              {projectTypes.map((projectType) => (
                <button
                  key={projectType.key}
                  onClick={() => handleCategoryClick(projectType.key)}
                  className={`filter-btn ${
                    selectedCategory === projectType.key ? "active" : ""
                  }`}
                >
                  {projectType.title}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="loading-state">
              <div className="loader"></div>
            </div>
          )}

          {/* Projects Grid */}
          <AnimatePresence mode="wait">
            {!isLoading && (
              <motion.div
                className="projects-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
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
                      <motion.article
                        key={client.id}
                        className="project-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        onClick={() => handleClientClick(client.id)}
                      >
                        {featureImage && (
                          <>
                            <div className="project-image">
                              <img
                                src={fullImagePath}
                                alt={client.project.name}
                                loading="lazy"
                              />
                              <div className="image-overlay">
                                <span className="view-label">View Details</span>
                              </div>
                            </div>
                            <div className="project-info">
                              <h3 className="project-title">
                                {client.project.name}
                              </h3>
                              <p className="project-client">
                                {client.fullName}
                              </p>
                              <p className="project-location">
                                {client.address}
                              </p>
                            </div>
                          </>
                        )}
                      </motion.article>
                    );
                  })
                ) : (
                  <div className="empty-state">
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
                    <p>No projects found in this category</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <ScrollToTop />
      </section>

      <style jsx>{`
        .project-section {
          min-height: 100vh;
          background-color: #fafafa;
          padding: 48px 0 80px;
        }

        .project-container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Filter Bar */
        .filter-wrapper {
          margin-bottom: 48px;
          border-bottom: 1px solid #e5e5e5;
        }

        .filter-bar {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 2px;
          justify-content: center;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .filter-bar::-webkit-scrollbar {
          display: none;
        }

        .filter-btn {
          padding: 12px 24px;
          background: transparent;
          border: none;
          font-size: 18px;
          font-weight: 500;
          font-variant: all-small-caps;
          color: #000000;
          cursor: pointer;
          white-space: nowrap;
          position: relative;
          transition: color 0.2s ease;
        }

        .filter-btn:hover {
          color: #666666;
        }

        .filter-btn.active {
          color: #262262;
          font-weight: 600;
        }

        .filter-btn.active::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #000;
        }

        /* Loading */
        .loading-state {
          display: flex;
          justify-content: center;
          padding: 120px 0;
        }

        .loader {
          width: 40px;
          height: 40px;
          border: 2px solid #f0f0f0;
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .no-projects-icon {
          margin-bottom: 16px;
          color: #262262;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Projects Grid */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 32px;
        }

        @media (max-width: 768px) {
          .projects-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        /* Project Card */
        .project-card {
          background: #fff;
          cursor: pointer;
          transition: transform 0.2s ease;
          overflow: hidden;
        }

        .project-card:hover {
          transform: translateY(-4px);
        }

        .project-image {
          position: relative;
          width: 100%;
          padding-top: 66.67%;
          background-color: #f5f5f5;
          overflow: hidden;
        }

        .project-image img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .project-card:hover .project-image img {
          transform: scale(1.05);
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .project-card:hover .image-overlay {
          opacity: 1;
        }

        .view-label {
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .project-info {
          padding: 24px;
        }

        .project-title {
          font-size: 18px;
          font-weight: 600;
          color: #000;
          margin: 0 0 8px 0;
          line-height: 1.4;
        }

        .project-client {
          font-size: 14px;
          color: #666;
          margin: 0 0 4px 0;
        }

        .project-location {
          font-size: 13px;
          color: #999;
          margin: 0;
        }

        /* Empty State */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 120px 20px;
        }

        .empty-state p {
          font-size: 15px;
          color: #999;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .project-section {
            padding: 32px 0 64px;
          }

          .project-container {
            padding: 0 16px;
          }

          .filter-wrapper {
            margin-bottom: 32px;
          }

          .filter-btn {
            padding: 10px 20px;
            font-size: 13px;
          }

          .project-info {
            padding: 20px;
          }

          .project-title {
            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
};

export default Projects;
