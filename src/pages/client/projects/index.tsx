import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import InnerHeader from "../../../components/client/InnerHeader";
import axios from "axios";
import { apiUrl } from "../../../utils";
import { encodeId } from "../../../utils/idEncoder";
import ScrollToTop from "../../../components/client/ScrollToTop";
import "./projects_new.css";

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
        `${apiUrl}/architecture-web-app/projects/active-project-types/`,
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
        `${apiUrl}/architecture-web-app/projects/get-clients/${id}`,
      );
      setClients(response.data.data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientClick = (clientId: number) => {
    const encodedId = encodeId(clientId);
    navigate(`/projectByClient/${encodedId}`);
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
                      (media) => media.image_type === "feature",
                    );

                    const fullImagePath = featureImage
                      ? `${apiUrl}/architecture-web-app${featureImage.filepath}`
                      : "";

                    if (!featureImage) return null;

                    return (
                      <motion.article
                        key={client.id}
                        className="project-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        onClick={() => handleClientClick(client.id)}
                      >
                        <div className="project-image">
                          <img
                            src={fullImagePath}
                            alt={client.project.name}
                            loading="lazy"
                          />
                          <div className="image-overlay">
                            <span className="view-label">View</span>
                          </div>
                        </div>
                        <div className="project-info">
                          <h3 className="project-title">
                            {client.project.name}
                          </h3>
                          <p className="project-location">
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              style={{ marginRight: "2px" }}
                            >
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                              <circle cx="12" cy="9" r="2.5" />
                            </svg>
                            {client.address || client.project.location}
                          </p>
                          <p className="project-client">{client.fullName}</p>
                        </div>
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
    </>
  );
};

export default Projects;
