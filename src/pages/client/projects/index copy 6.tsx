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
  // Assuming you might add year later; for now we use what's available
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
          title: item.title.toUpperCase(), // Uppercase for premium feel
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

      <section className="projects-section">
        <div className="container">
          {/* Elegant uppercase filter bar */}
          <div className="filters">
            {projectTypes.map((type) => (
              <button
                key={type.key}
                className={`filter-item ${
                  selectedCategory === type.key ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(type.key)}
              >
                {type.title}
              </button>
            ))}
          </div>

          {/* Minimal Masonry Grid */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                className="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="loader" />
              </motion.div>
            ) : (
              <motion.div
                className="projects-masonry"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {clients.length > 0 ? (
                  clients.map((client, index) => {
                    const featureImage = client.project?.media?.find(
                      (m) => m.image_type === "feature"
                    );

                    const imageSrc = featureImage
                      ? `${apiUrl}/architecture-web-app${featureImage.filepath}`
                      : "/images/placeholder.jpg";

                    return (
                      <motion.article
                        key={client.id}
                        className="project-item"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: index * 0.1 }}
                        whileHover={{
                          scale: 1.03,
                          transition: { duration: 0.4 },
                        }}
                        onClick={() => handleClientClick(client.id)}
                      >
                        <div className="image-wrapper">
                          <img
                            src={imageSrc}
                            alt={client.project.name}
                            loading="lazy"
                            className="project-img"
                          />
                          <div className="overlay">
                            <div className="overlay-content">
                              <h3 className="project-name">
                                {client.project.name}
                              </h3>
                              <p className="project-meta">
                                {client.address}{" "}
                                {/* Can add year if you fetch it */}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })
                ) : (
                  <div className="empty">
                    <p>No projects found in this category</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <ScrollToTop />

      <style jsx>{`
        .projects-section {
          padding: 120px 0 160px;
          background: #ffffff;
        }

        .container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 5vw;
        }

        .filters {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 100px;
          flex-wrap: wrap;
        }

        .filter-item {
          background: none;
          border: none;
          /* font-size: 1.1rem; */
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #999999;
          cursor: pointer;
          transition: color 0.4s ease;
          position: relative;
        }

        .filter-item:hover,
        .filter-item.active {
          color: #000000;
        }

        .filter-item.active::after {
          content: "";
          position: absolute;
          bottom: -8px;
          left: 50%;
          width: 0;
          height: 1px;
          background: #000;
          transition: all 0.5s ease;
          transform: translateX(-50%);
        }

        .filter-item.active::after {
          width: 60%;
        }

        .projects-masonry {
          column-count: 3;
          column-gap: 5vw;
        }

        .project-item {
          break-inside: avoid;
          margin-bottom: 5vw;
          cursor: pointer;
          overflow: hidden;
        }

        .image-wrapper {
          position: relative;
          overflow: hidden;
        }

        .project-img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        .project-item:hover .project-img {
          transform: scale(1.08);
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          opacity: 0;
          transition: opacity 0.6s ease;
          display: flex;
          align-items: flex-end;
          padding: 3rem 2.5rem;
        }

        .project-item:hover .overlay {
          opacity: 1;
        }

        .overlay-content {
          color: white;
        }

        .project-name {
          font-size: 1.8rem;
          font-weight: 600;
          margin: 0 0 0.6rem;
          letter-spacing: -0.02em;
        }

        .project-meta {
          font-size: 1rem;
          opacity: 0.9;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .loading {
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loader {
          width: 60px;
          height: 60px;
          border: 3px solid #eee;
          border-top: 3px solid #000;
          border-radius: 50%;
          animation: spin 1.1s linear infinite;
        }

        .empty {
          grid-column: 1 / -1;
          text-align: center;
          font-size: 1.3rem;
          color: #777;
          padding: 150px 0;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1100px) {
          .projects-masonry {
            column-count: 2;
          }
        }

        @media (max-width: 700px) {
          .projects-masonry {
            column-count: 1;
          }
          .filters {
            gap: 2rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default Projects;
