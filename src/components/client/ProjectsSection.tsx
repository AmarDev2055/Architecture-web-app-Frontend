import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../utils";
import { motion } from "framer-motion";
import { encodeId } from "../../utils/idEncoder";
import { Link } from "react-router-dom";
import "../client/Project-Section.css";

interface Project {
  id: number;
  project_type_id: number;
  title: string;
  date: string;
  location: string;
  project_type_name: string;
  bgImage: string;
}

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    return `${month} ${day}${getOrdinalSuffix(day)}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Project Types
        const typesResponse = await axios.get(
          `${apiUrl}/architecture-web-app/projects/active-project-types/`,
        );

        const typeLookup: { [key: string]: string } = {};
        typesResponse.data.data.forEach((type: any) => {
          typeLookup[type.id.toString()] = type.title;
        });

        // 2. Fetch Latest Projects
        const projectsResponse = await axios.get(
          `${apiUrl}/architecture-web-app/projects/get-latest-projects`,
          { withCredentials: true },
        );

        const projectData = projectsResponse.data.data
          .filter((project: any) => project.status === true)
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 4)
          .map((project: any) => ({
            id: project.id,
            title: project.name || "Untitled Project",
            location: project.location || "Unknown Location",
            project_type_id: project.project_type_id,
            project_type_name:
              typeLookup[project.project_type_id?.toString()] || "Project",
            date: formatDate(project.createdAt),
            bgImage: project.media?.[0]?.filepath
              ? `${apiUrl}/architecture-web-app${project.media[0].filepath}`
              : "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
          }));

        setProjects(projectData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="grid-background"></div>
      <section className="projects-section-wrapper">
        <div>
          <motion.h2
            className="architectural-expertise__title"
            initial={{ opacity: 0, translateY: 50 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.6 }}
          >
            OUR RECENT PROJECTS
          </motion.h2>
        </div>

        {loading ? (
          <div className="loading-pro">
            <div className="spinner-pro"></div>
            <p style={{ color: "#666", fontSize: "18px", fontWeight: 300 }}>
              Loading projects...
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="no-projects-pro">
            No projects available at the moment.
          </div>
        ) : (
          <>
            <div className="projects-grid-pro">
              {projects.map((project) => {
                const encodedId = encodeId(project.id);
                return (
                  <Link
                    key={project.id}
                    to={`/projects/${encodedId}`}
                    className="project-card-pro"
                  >
                    <span className="project-date-top">{project.date}</span>
                    <img
                      src={project.bgImage}
                      alt={project.title}
                      className="project-image-pro"
                    />
                    <div className="project-content-pro">
                      <div className="project-date-pro">{project.date}</div>
                      <div className="project-type-name">
                        {project.project_type_name}
                      </div>
                      <h3 className="project-title-pro">{project.title}</h3>
                      <h4 className="project-location-pro">
                        {project.location}
                      </h4>
                      <div className="project-link-pro">
                        View Project
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="view-all-wrapper-pro">
              <Link to="/projects" className="view-all-btn-pro">
                View All Projects
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default ProjectsSection;
