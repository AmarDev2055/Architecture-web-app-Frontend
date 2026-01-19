import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { apiUrl } from "../utils";

interface ParallaxImageCardProps {
  imagePath: string;
  title: string;
  address: string;
  onClick: () => void;
}

const ParallaxImageCard = ({
  imagePath,
  title,
  address,
  onClick,
}: ParallaxImageCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-15px", "15px"]);

  return (
    <div className="image-wrapper" ref={ref}>
      <motion.img
        src={`${apiUrl}/architecture-web-app${imagePath}`}
        alt={title}
        loading="lazy"
        style={{ y }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      <motion.div
        className="image-overlay"
        onClick={onClick}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h3>{title}</h3>
        <p>{address}</p>
      </motion.div>
    </div>
  );
};

export default ParallaxImageCard;
