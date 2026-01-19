interface InnerHeaderProps {
  title: string;
  projectName?: string;
  currentPage: string;
  className?: string; // Optional className prop for additional styling
  backgroundImage?: string;
  address?: string;
}

export const ProjectInnerHeader: React.FC<InnerHeaderProps> = ({
  projectName,
  className = "",
  backgroundImage,
  address,
}) => {
  return (
    <div
      className={`project-inner-header ${className}`}
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="header-content">
        <h1 className="page-title">{projectName}</h1>
        <div className="breadcrumb">
          {/* <Link to="/">HOME</Link> */}
          <span className="separator">/</span>
          <span className="current">{address}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectInnerHeader;
