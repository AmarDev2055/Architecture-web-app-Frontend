import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import InnerHeader from "../../../components/client/InnerHeader";
import axios from "axios";
import { apiUrl } from "../../../utils";
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
      setClients(response.data.data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const encodeId = (id: number) => btoa(id.toString());

  const handleClientClick = (clientId: number) => {
    navigate(`/projects/${encodeId(clientId)}`);
  };

  useEffect(() => {
    fetchProjectTypes();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchClients(selectedCategory);
    }
  }, [selectedCategory]);

  return (
    <>
      <InnerHeader title="PROJECTS" currentPage="PROJECTS" />

      {/* Hero Section */}
      {/* <section className="projects-hero">
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Our Architectural Journey
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Where vision meets craftsmanship
          </motion.p>
        </div>
      </section> */}

      <section className="projects-section">
        <div className="container">
          {/* Category Filters */}
          <div className="filters-container">
            <div className="filter-chips">
              {projectTypes.map((type) => (
                <button
                  key={type.key}
                  className={`chip ${
                    selectedCategory === type.key ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(type.key)}
                >
                  {type.title}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                className="loading-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="spinner" />
              </motion.div>
            ) : (
              <motion.div
                className="projects-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {clients.length > 0 ? (
                  clients.map((client, index) => {
                    const featureImage = client.project?.media?.find(
                      (m) => m.image_type === "feature"
                    );

                    const imageSrc = featureImage
                      ? `${apiUrl}/architecture-web-app${featureImage.filepath}`
                      : "/images/placeholder/architecture-placeholder.jpg";

                    return (
                      <motion.div
                        key={client.id}
                        className="project-card"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.07 }}
                        whileHover={{ y: -12, scale: 1.02 }}
                        onClick={() => handleClientClick(client.id)}
                      >
                        <div className="card-media">
                          <img
                            src={imageSrc}
                            alt={client.project.name}
                            loading="lazy"
                            className="media-img"
                          />
                          <div className="card-overlay">
                            <span className="view-btn">View Project</span>
                          </div>
                        </div>

                        <div className="card-info">
                          <h3 className="project-title">
                            {client.project.name}
                          </h3>
                          <div className="project-meta">
                            <span className="client">{client.fullName}</span>
                            <span className="separator">•</span>
                            <span className="location">{client.address}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div
                    className="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="empty-icon">🏛️</div>
                    <h3>No projects in this category yet</h3>
                    <p>Please try another category</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <ScrollToTop />

      <style jsx>{`
        .projects-hero {
          height: 55vh;
          min-height: 460px;
          background: linear-gradient(rgba(0, 0, 0, 0.68), rgba(0, 0, 0, 0.42)),
            url("/images/projects-hero-bg.jpg") center/cover no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          position: relative;
        }

        .hero-content h1 {
          font-size: clamp(3.8rem, 9vw, 7.2rem);
          font-weight: 800;
          margin: 0 0 1rem;
          letter-spacing: -1.5px;
          text-shadow: 0 6px 25px rgba(0, 0, 0, 0.7);
        }

        .hero-content p {
          font-size: 1.5rem;
          font-weight: 300;
          opacity: 0.92;
          letter-spacing: 1.5px;
        }

        .container {
          max-width: 1480px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .filters-container {
          padding: 3.5rem 0 2rem;
          text-align: center;
        }

        .filter-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
        }

        .chip {
          padding: 0.8rem 1.8rem;
          border-radius: 50px;
          background: #f5f5f8;
          border: 1px solid #e0e0e8;
          font-size: 0.98rem;
          font-weight: 500;
          color: #222;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .chip:hover {
          background: #ececf2;
          transform: translateY(-1px);
        }

        .chip.active {
          background: #1e1b4b;
          color: white;
          border-color: #1e1b4b;
          box-shadow: 0 8px 24px rgba(30, 27, 75, 0.22);
        }

        .projects-grid {
          column-count: 3;
          column-gap: 2rem;
        }

        .project-card {
          break-inside: avoid;
          margin-bottom: 2rem;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          cursor: pointer;
        }

        .project-card:hover {
          box-shadow: 0 28px 56px rgba(0, 0, 0, 0.14);
          transform: translateY(-8px);
        }

        .card-media {
          position: relative;
          overflow: hidden;
          aspect-ratio: 4 / 5;
        }

        .media-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        .project-card:hover .media-img {
          transform: scale(1.09);
        }

        .card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.75) 0%,
            transparent 50%
          );
          opacity: 0;
          transition: opacity 0.45s ease;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 2.2rem;
        }

        .project-card:hover .card-overlay {
          opacity: 1;
        }

        .view-btn {
          background: rgba(255, 255, 255, 0.95);
          color: #111;
          padding: 0.9rem 2.2rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: 0.8px;
          backdrop-filter: blur(6px);
          transition: all 0.25s ease;
        }

        .view-btn:hover {
          background: white;
          transform: scale(1.07);
        }

        .card-info {
          padding: 1.6rem 1.8rem;
        }

        .project-title {
          font-size: 1.38rem;
          font-weight: 700;
          margin: 0 0 0.7rem;
          color: #0f0f0f;
        }

        .project-meta {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 0.94rem;
          color: #555;
        }

        .client {
          color: #1e1b4b;
          font-weight: 500;
        }

        .separator {
          color: #ccc;
        }

        .location {
          color: #777;
        }

        .loading-container {
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .spinner {
          width: 70px;
          height: 70px;
          border: 6px solid #f0f0f5;
          border-top: 6px solid #1e1b4b;
          border-radius: 50%;
          animation: spin 1s cubic-bezier(0.6, 0.2, 0.2, 0.8) infinite;
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 10rem 2rem;
          color: #888;
        }

        .empty-icon {
          font-size: 6rem;
          margin-bottom: 1.5rem;
          opacity: 0.35;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1024px) {
          .projects-grid {
            column-count: 2;
          }
        }

        @media (max-width: 640px) {
          .projects-grid {
            column-count: 1;
          }

          .filter-chips {
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 0.8rem;
            scrollbar-width: none;
          }

          .filter-chips::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Projects;
