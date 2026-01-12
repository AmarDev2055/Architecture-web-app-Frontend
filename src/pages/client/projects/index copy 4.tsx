import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import InnerHeader from "../../../components/client/InnerHeader";
import ScrollToTop from "../../../components/client/ScrollToTop";
import { apiUrl } from "../../../utils";

import "./projects.css";

interface ProjectType {
  key: string;
  title: string;
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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const Projects = () => {
  const navigate = useNavigate();

  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<string>("");
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch project types (categories)
  useEffect(() => {
    const fetchProjectTypes = async () => {
      try {
        const { data } = await axios.get(
          `${apiUrl}/architecture-web-app/projects/project-types/`
        );

        const activeTypes = data.data
          .filter((item: any) => item.status === true)
          .map((item: any) => ({
            key: String(item.id),
            title: item.title,
          }));

        setProjectTypes(activeTypes);

        // Auto-select first category
        if (activeTypes.length > 0) {
          setSelectedTypeId(activeTypes[0].key);
        }
      } catch (err) {
        console.error("Failed to load project categories:", err);
        setError("Failed to load project categories");
      }
    };

    fetchProjectTypes();
  }, []);

  // Fetch projects/clients when category changes
  useEffect(() => {
    if (!selectedTypeId) return;

    const fetchClients = async () => {
      setIsLoading(true);
      setError(null);
      setClients([]);

      try {
        const { data } = await axios.get(
          `${apiUrl}/architecture-web-app/projects/get-clients/${selectedTypeId}`
        );
        setClients(data.data || []);
      } catch (err) {
        console.error("Failed to load projects:", err);
        setError("Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [selectedTypeId]);

  const encodeId = (id: number) => btoa(String(id));

  const handleProjectClick = (clientId: number) => {
    navigate(`/projects/${encodeId(clientId)}`);
  };

  const selectedTypeTitle = useMemo(
    () => projectTypes.find((t) => t.key === selectedTypeId)?.title || "",
    [projectTypes, selectedTypeId]
  );

  return (
    <>
      <InnerHeader title="Projects" currentPage="Projects" />

      <section className="projects-page">
        <div className="container">
          {/* Header + Filter */}
          <div className="section-header">
            <h1 className="page-title">Our Projects</h1>

            {projectTypes.length > 0 && (
              <div className="category-filter" role="tablist">
                {projectTypes.map((type) => (
                  <button
                    key={type.key}
                    type="button"
                    role="tab"
                    aria-selected={selectedTypeId === type.key}
                    className={`filter-chip ${
                      selectedTypeId === type.key ? "active" : ""
                    }`}
                    onClick={() => setSelectedTypeId(type.key)}
                  >
                    {type.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Loading / Error / Content */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                className="loading-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="spinner" />
                <p>Loading projects...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                className="error-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="error-message">{error}</p>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                className="projects-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {clients.length > 0 ? (
                  clients.map((client, index) => {
                    const featureMedia = client.project?.media?.find(
                      (m) => m.image_type === "feature"
                    );

                    const imageSrc = featureMedia
                      ? `${apiUrl}/architecture-web-app${featureMedia.filepath}`
                      : "/images/placeholder-project.jpg";

                    return (
                      <motion.article
                        key={client.id}
                        className="project-card"
                        variants={cardVariants}
                        transition={{ delay: index * 0.06 }}
                        onClick={() => handleProjectClick(client.id)}
                      >
                        <div className="card-image-container">
                          <img
                            src={imageSrc}
                            alt={client.project.name}
                            loading="lazy"
                            className="project-image"
                          />
                          <div className="image-overlay">
                            <span className="view-details">View Project</span>
                          </div>
                        </div>

                        <div className="card-content">
                          <h3 className="project-name">
                            {client.project.name}
                          </h3>
                          <p className="client-name">{client.fullName}</p>
                          <p className="project-location">
                            {client.project.location || client.address}
                          </p>
                        </div>
                      </motion.article>
                    );
                  })
                ) : (
                  <motion.div
                    className="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="empty-icon">✗</div>
                    <h3>No projects found</h3>
                    <p>
                      We don't have any projects in the "
                      <strong>{selectedTypeTitle}</strong>" category yet.
                    </p>
                  </motion.div>
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
