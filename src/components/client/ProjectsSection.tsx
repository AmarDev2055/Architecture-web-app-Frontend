import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../utils";
import { motion } from "framer-motion";

interface Project {
  id: number;
  title: string;
  date: string;
  location: string;
  bgImage: string;
}

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const encodeId = (id: number) => btoa(id.toString());

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
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/architecture-web-app/projects/get-latest-projects`,
          { withCredentials: true },
        );
        console.log("Fetching projects...", response.data);

        const data = response.data;

        const projectData = data.data
          .filter((project: any) => project.status === true)
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 6)
          .map((project: any) => {
            return {
              id: project.id,
              title: project.name || "Untitled Project",
              location: project.location || "Unknown Location",
              date: formatDate(project.createdAt),
              bgImage: project.media?.[0]?.filepath
                ? `${apiUrl}/architecture-web-app${project.media[0].filepath}`
                : "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
            };
          });

        setProjects(projectData);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      <style>{`
        .projects-section-wrapper {
          min-height: 100vh;
          padding: 0px 5vw;
          position: relative;
          // background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
        }

        .grid-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
          z-index: 1;
        }

        .section-header-pro {
          text-align: center;
          margin-bottom: 100px;
          position: relative;
          z-index: 2;
        }

        .section-header-pro::before {
          content: '';
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #fff, transparent);
          animation: glow-line 3s ease-in-out infinite;
        }

        @keyframes glow-line {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .section-subtitle-pro {
          font-size: 14px;
          letter-spacing: 4px;
          color: #888;
          text-transform: uppercase;
          margin-bottom: 20px;
          font-weight: 300;
        }

        // .section-title-pro {
        //   font-size: clamp(48px, 8vw, 120px);
        //   font-weight: 200;
        //   letter-spacing: -2px;
        //   line-height: 1;
        //   background: linear-gradient(135deg, #fff 0%, #888 100%);
        //   -webkit-background-clip: text;
        //   -webkit-text-fill-color: transparent;
        //   background-clip: text;
        //   margin-bottom: 30px;
        // }
          .architectural-expertise__title {
            margin: 4.9rem 0;
          }

        .section-description-pro {
          font-size: 18px;
          color: #999;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.8;
          font-weight: 300;
        }

        .projects-grid-pro {
          display: grid;
          grid-template-columns: repeat(3, 1fr);  /* Changed from auto-fit to fixed 3 columns */
          gap: 40px;
          margin-bottom: 80px;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 1024px) {  /* Added tablet breakpoint */
          .projects-grid-pro {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .projects-grid-pro {
            grid-template-columns: 1fr;
          }
        }

        .project-card-pro {
          position: relative;
          height: 550px;
          overflow: hidden;
          cursor: pointer;
          background: #111;
          transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
          text-decoration: none;
          display: block;
          opacity: 0;
          animation: fadeInUp 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }

        .project-card-pro:nth-child(1) { animation-delay: 0.1s; }
        .project-card-pro:nth-child(2) { animation-delay: 0.2s; }
        .project-card-pro:nth-child(3) { animation-delay: 0.3s; }
        .project-card-pro:nth-child(4) { animation-delay: 0.4s; }
        .project-card-pro:nth-child(5) { animation-delay: 0.5s; }
        .project-card-pro:nth-child(6) { animation-delay: 0.6s; }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .project-card-pro:hover {
          transform: translateY(-10px);
        }

        .project-card-pro::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.9) 100%);
          z-index: 2;
          transition: opacity 0.6s ease;
        }

        .project-card-pro:hover::before {
          opacity: 0.95;
        }

        .project-image-pro {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);
          filter: grayscale(30%);
        }

        .project-card-pro:hover .project-image-pro {
          transform: scale(1.1);
          filter: grayscale(0%);
        }

        .project-content-pro {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 40px;
          z-index: 3;
          transform: translateY(20px);
          transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .project-card-pro:hover .project-content-pro {
          transform: translateY(0);
        }

        .project-date-pro {
          font-size: 1.4rem;
          letter-spacing: 3px;
          color: #888;
          text-transform: uppercase;
          margin-bottom: 15px;
          font-weight: 400;
          display: none;
        }

       .project-title-pro {
        font-size: 32px;
        font-weight: 300;
        line-height: 1.25;
        font-variant: all-small-caps;
        margin: 0 0 1px 0; /* reduced */
        letter-spacing: -0.5px;
        color: #fff;
      }

    .project-location-pro {
      font-size: 16px;
      font-weight: 100;
      font-variant: all-small-caps;
      letter-spacing: -0.5px;
      margin: 0 5px 0 0; /* remove default h4 margin */
      color: #fff;
    }


        .project-link-pro {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          opacity: 0;
          transform: translateX(-20px);
          transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .project-card-pro:hover .project-link-pro {
          opacity: 1;
          transform: translateX(0);
        }

        .project-link-pro svg {
          transition: transform 0.3s ease;
        }

        .project-card-pro:hover .project-link-pro svg {
          transform: translateX(5px);
        }

        .project-number-pro {
          position: absolute;
          top: 30px;
          right: 30px;
          font-size: 80px;
          font-weight: 100;
          z-index: 3;
          line-height: 1;
        }

         .project-card-pro:hover .project-number-pro {
          color: #be1e2d;
        }

        .project-date-top {
          position: absolute;
          top: 30px;
          left: 30px;
          font-size: 14px;
          font-weight: 400;
          z-index: 4;
          line-height: 1;
          color: #fff;
          background: rgba(0, 0, 0, 0.7);
          padding: 10px 20px;
          letter-spacing: 2px;
          text-transform: uppercase;
          backdrop-filter: blur(10px);
        }

        .project-card-pro:hover .project-date-top {
          background: rgba(190, 30, 45, 0.9);
        }

     
        .view-all-wrapper-pro {
          text-align: center;
          margin-top: 80px;
          position: relative;
          z-index: 2;
        }

        .view-all-btn-pro {
          display: inline-flex;
          align-items: center;
          gap: 15px;
          padding: 20px 50px;
          background: #be1e2d;
          border: 1px solid #be1e2d;
          color: #ffffff;
          text-decoration: none;
          font-size: 14px;
          letter-spacing: 3px;
          text-transform: uppercase;
          transition: all 1s cubic-bezier(0.19, 1, 0.22, 1);
          position: relative;
          overflow: hidden;
          z-index: 1;
        }

        .view-all-btn-pro::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: #262262;
          transition: left 1s cubic-bezier(0.19, 1, 0.22, 1);
          z-index: -1;
        }

        .view-all-btn-pro:hover::before {
          left: 0;
        }

        .view-all-btn-pro:hover {
          color: #ffffff;
          border-color: #262262;
          background: #262262;
        }

        .loading-pro {
          text-align: center;
          padding: 100px 0;
          position: relative;
          z-index: 2;
        }

        .spinner-pro {
          width: 60px;
          height: 60px;
          border: 3px solid rgba(255,255,255,0.1);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 30px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .no-projects-pro {
          text-align: center;
          padding: 100px 0;
          font-size: 24px;
          color: #666;
          font-weight: 300;
          position: relative;
          z-index: 2;
        }
      `}</style>

      <div className="grid-background"></div>

      <section className="projects-section-wrapper">
        <div>
          {/* <div className="section-subtitle-pro">Portfolio</div> */}
          {/* <h2 className="section-title-pro">Recent Projects</h2> */}
          <motion.h2
            className="architectural-expertise__title"
            initial={{ opacity: 0, translateY: 50 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.6 }}
          >
            OUR RECENT PPROJECTS
          </motion.h2>
          {/* <p className="section-description-pro">
            Explore our latest architectural achievements where innovation meets
            timeless design
          </p> */}
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
              {projects.map((project, index) => (
                <a
                  key={project.id}
                  href={`/projects/${encodeId(project.id)}`}
                  className="project-card-pro"
                >
                  <span className="project-date-top">{project.date}</span>
                  <span className="project-number-pro">0{index + 1}</span>
                  <img
                    src={project.bgImage}
                    alt={project.title}
                    className="project-image-pro"
                  />
                  <div className="project-content-pro">
                    <div className="project-date-pro">{project.date}</div>
                    <h3 className="project-title-pro">{project.title}</h3>
                    <h4 className="project-location-pro">{project.location}</h4>
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
                </a>
              ))}
            </div>

            <div className="view-all-wrapper-pro">
              <a href="/projects" className="view-all-btn-pro">
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
              </a>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default ProjectsSection;
