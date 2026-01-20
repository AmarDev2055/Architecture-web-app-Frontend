import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import InnerHeader from "../../../components/client/InnerHeader";
import axios from "axios";
import { apiUrl } from "../../../utils";
import ScrollToTop from "../../../components/client/ScrollToTop";
import ParallaxImageCard from "../../../components/ParallaxImageCard";
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
  const navigate = useNavigate();

  /* ================= FETCH PROJECT TYPES ================= */
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

  /* ================= FETCH CLIENTS ================= */
  const fetchClients = async (id: string) => {
    try {
      const response = await axios.get(
        `${apiUrl}/architecture-web-app/projects/get-clients/${id}`
      );
      setClients(response.data.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients([]);
    }
  };

  /* ================= HELPERS ================= */
  const encodeId = (id: number) => btoa(id.toString());

  const handleClientClick = (clientId: number) => {
    navigate(`/projects/${encodeId(clientId)}`);
  };

  /* ================= EFFECTS ================= */
  useEffect(() => {
    fetchProjectTypes();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setClients([]);
      fetchClients(selectedCategory);
    }
  }, [selectedCategory]);

  /* ================= RENDER ================= */
  return (
    <>
      <InnerHeader title="PROJECTS" currentPage="PROJECTS" />

      <section className="project-area" id="project">
        <div className="container">
          {/* ===== CATEGORY BAR ===== */}
          <motion.div
            className="project-types-bar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {projectTypes.map((projectType) => (
              <button
                key={projectType.key}
                onClick={() => setSelectedCategory(projectType.key)}
                className={`category-btn ${
                  selectedCategory === projectType.key ? "active" : ""
                }`}
              >
                {projectType.title}
              </button>
            ))}
          </motion.div>

          {/* ===== PROJECT GRID ===== */}
          <div className="client-list">
            <AnimatePresence>
              {clients.length > 0 ? (
                clients.map((client) => {
                  const featureImage = client.project?.media?.find(
                    (media) => media.image_type === "feature"
                  );

                  if (!featureImage) return null;

                  return (
                    <motion.div
                      key={client.id}
                      className="client-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <ParallaxImageCard
                        imagePath={featureImage.filepath}
                        title={client.project.name}
                        address={client.address}
                        onClick={() => handleClientClick(client.id)}
                      />
                    </motion.div>
                  );
                })
              ) : (
                <motion.p
                  className="no-projects-message"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  No projects available in this category.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <ScrollToTop />
      </section>
    </>
  );
};

export default Projects;
