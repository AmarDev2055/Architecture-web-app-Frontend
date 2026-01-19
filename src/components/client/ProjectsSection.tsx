import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { apiUrl } from "../../utils";
import "../client/Project-Section.css";

interface Project {
  id: number;
  title: string;
  date: string;
  bgImage: string;
}

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const encodeId = (id: number) => btoa(id.toString());

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/architecture-web-app/projects/get-latest-projects`,
          { withCredentials: true }
        );

        const projectData = response.data.data
          .filter((project: any) => project.status === true)
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 6)
          .map((project: any) => {
            const formattedDate = new Date(project.createdAt)
              .toISOString()
              .slice(0, 10)
              .replace(/-/g, "/");

            return {
              id: project.id,
              title: project.name || "Untitled Project",
              date: formattedDate,
              bgImage: project.media?.[0]?.filepath
                ? `${apiUrl}/architecture-web-app${project.media[0].filepath}`
                : "https://via.placeholder.com/400x500?text=No+Image",
            };
          });

        setProjects(projectData);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects-masonry" className="projects-masonry-section">
      <motion.h2
        className="architectural-expertise__title"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        OUR RECENT PROJECTS
      </motion.h2>

      {projects.length === 0 ? (
        <p className="no-projects-message">No projects available.</p>
      ) : (
        <div className="masonry-container">
          <div className="masonry-grid">
            {projects.map((project) => (
              <a
                key={project.id}
                href={`/projects/${encodeId(project.id)}`}
                className="masonry-item"
              >
                <div
                  className="masonry-image"
                  style={{ backgroundImage: `url(${project.bgImage})` }}
                >
                  <div className="masonry-overlay">
                    <h3>{project.title}</h3>
                    <span>{project.date}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
      {projects.length > 0 && (
        <div className="view-all-wrapper">
          <a href="/projects" className="view-all-btn">
            View All Projects
          </a>
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;
