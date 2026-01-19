import { Link } from "react-router-dom";

interface InnerHeaderProps {
  title: string;
  currentPage: string;
  className?: string; // Optional className prop for additional styling
}

export const InnerHeader: React.FC<InnerHeaderProps> = ({
  title,
  currentPage,
  className = "",
}) => {
  return (
    <div className={`inner-header ${className}`}>
      <div className="header-content">
        <h1 className="page-title">{title}</h1>
        <div className="breadcrumb">
          <Link to="/">HOME</Link>
          <span className="separator">/</span>
          <span className="current">{currentPage}</span>
        </div>
      </div>
    </div>
  );
};

export default InnerHeader;
