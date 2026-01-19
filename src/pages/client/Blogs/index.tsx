import { useEffect } from "react";
import { Col, Row, Card, message } from "antd";
import useGetAPI from "../../../hooks/useGetAPI";
import ScrollToTop from "../../../components/client/ScrollToTop";
import LoadingSpinner from "../../../components/client/LoadingSpinner";
import PlaceholderImage from "../../../assets/images/pdf-1.png"; // Fallback placeholder image
import { apiUrl } from "../../../utils";

interface BlogData {
  id: number;
  title: string;
  filename: string;
  filepath: string;
  feature: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  imagepath: string; // Optional image URL from API
  description?: string; // Optional description from API
}

const BlogsPage = () => {
  const { loading, error, data } = useGetAPI<BlogData[]>(
    "architecture-web-app/by-laws/feature",
    true,
    true
  );

  useEffect(() => {
    if (error) {
      console.error("Error fetching blogs:", error);
      message.error("Failed to load blogs. Please try again later.");
    }
  }, [error]);

  // Function to construct full URL for the PDF
  const getPdfUrl = (filepath: string) => {
    return `${apiUrl}/architecture-web-app${filepath}`;
  };

  // Function to get image URL or fallback to placeholder
  const getImageUrl = (imagepath?: string) => {
    return imagepath
      ? `${apiUrl}/architecture-web-app${imagepath}`
      : PlaceholderImage;
  };

  return (
    <>
      <div className="inner-header">
        <div className="header-content">
          <h1 className="page-title">By Laws & Info</h1>
          <div className="breadcrumb">
            <a href="/">HOME</a>
            <span className="separator">/</span>
            <span className="current">BY LAWS & INFO</span>
          </div>
        </div>
      </div>

      <section className="blogs-section">
        <div className="container">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Row gutter={[16, 16]} justify="start">
              {data && data.length > 0 ? (
                data.map((blog) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={blog.id}>
                    <a
                      href={getPdfUrl(blog.filepath)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="blog-link"
                      onClick={(e) => {
                        fetch(getPdfUrl(blog.filepath)).catch(() => {
                          e.preventDefault();
                          message.error(
                            "Unable to open PDF. File may not be available."
                          );
                        });
                      }}
                    >
                      <Card
                        hoverable
                        className="blog-card"
                        cover={
                          <img
                            alt={blog.title}
                            src={getImageUrl(blog.imagepath)}
                            className="blog-image"
                          />
                        }
                      >
                        <Card.Meta
                          title={blog.title}
                          description={
                            <>
                              <p className="blog-description">
                                {blog.description ||
                                  "No description available for this blog."}
                              </p>
                              <p className="blog-published">
                                Published:{" "}
                                {new Date(blog.createdAt).toLocaleDateString(
                                  "en-CA"
                                )}
                              </p>
                            </>
                          }
                        />
                      </Card>
                    </a>
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <p className="no-blogs">No blogs available at the moment.</p>
                </Col>
              )}
            </Row>
          )}
        </div>
      </section>

      <ScrollToTop />
    </>
  );
};

export default BlogsPage;
