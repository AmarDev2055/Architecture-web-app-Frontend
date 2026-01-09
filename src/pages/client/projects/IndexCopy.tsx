import { Link } from "react-router-dom";
import InnerHeader from "../../../components/client/InnerHeader";

interface CategoryCard {
  key: string;
  title: string;
}

const categories: CategoryCard[] = [
  {
    key: "residentialProjects",
    title: "Residential Projects",
  },
  {
    key: "commercialProjects",
    title: "Commercial Projects",
  },
  {
    key: "restaurantCafeProjects",
    title: "Restaurant & Cafe Projects",
  },
  {
    key: "hotelResortProjects",
    title: "Hotel & Resort Projects",
  },
  {
    key: "entertainmentProjects",
    title: "Entertainment Projects",
  },
  {
    key: "renovationProjects",
    title: "Renovation Projects",
  },
  {
    key: "constructionProjects",
    title: "Construction Projects",
  },
];

const Projects = () => {
  return (
    <>
      <InnerHeader title="PROJECTS" currentPage="PROJECTS" />
      <section className="project-area section-gap-top" id="project">
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-lg-8">
              <div className="section-title text-center">
                <h2>Explore Project Categories</h2>
              </div>
            </div>
          </div>

          <div className="row">
            {categories.map((category) => (
              <div
                className="col-lg-3 col-md-6 mb-4"
                key={category.key}
                style={{ cursor: "default" }}
              >
                <Link to={`/projects/category/${category.key}`}>
                  <div className="card category-card shadow-sm border-0 h-100">
                    <div className="card-image-wrapper">
                      <div className="card-overlay">
                        <h5 className="card-title-overlay">{category.title}</h5>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Projects;
