import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

export const useScrollToTop = () => {
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollThreshold = (pageHeight - windowHeight) / 2;

      setShowBackTop(scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return { showBackTop, scrollToTop };
};

const ScrollToTop: React.FC = () => {
  const { showBackTop, scrollToTop } = useScrollToTop();

  if (!showBackTop) return null;

  return (
    <div className="custom-backtop" onClick={scrollToTop}>
      <FontAwesomeIcon icon={faArrowUp} />
    </div>
  );
};

export default ScrollToTop;