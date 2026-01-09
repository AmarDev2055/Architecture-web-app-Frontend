import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { Quote } from "lucide-react";
import { Typography } from "antd";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import useGetAPI from "../../hooks/useGetAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingSpinner from "./LoadingSpinner";
import { useState, useRef, useEffect } from "react";
import DefaultAvatar from "../../assets/svg/user-profile-circle.png";
import { apiUrl } from "../../utils";


const TestimonialSlider: React.FC = () => {
  const {
    data: testimonials,
    loading,
    error,
  } = useGetAPI<
    {
      id: number;
      rating: number;
      title: string;
      filename: string;
      filepath: string;
      imageUrl: string | null;
      message: string;
      fullname: string;
      designation: string;
    }[]
  >("architecture-web-app/testimonial");

  // Function to render star rating
  const renderStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <>
        {/* Render full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <FontAwesomeIcon
            key={`full-${i}`}
            icon={faStar}
            // style={{ color: "red" }}
          />
        ))}
        {halfStar === 1 && (
          <FontAwesomeIcon
            key="half"
            icon={faStarHalfAlt}
            // style={{ color: "red" }}
          />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <FontAwesomeIcon
            key={`empty-${i}`}
            icon={faStarEmpty}
            // style={{ color: "red" }}
          />
        ))}
      </>
    );
  };

  // Component for handling text truncation and tooltip
  const TruncatedText: React.FC<{ text: string; maxLength: number }> = ({ text, maxLength }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
      if (textRef.current) {
        const element = textRef.current;
        setIsTruncated(element.scrollHeight > element.clientHeight);
      }
    }, [text]);

    const shouldTruncate = text.length > maxLength;
    const displayText = shouldTruncate ? text.substring(0, maxLength) + "..." : text;

    return (
      <div 
        className="testimonial-text-container"
        onMouseEnter={() => (shouldTruncate || isTruncated) && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <p 
          ref={textRef}
          className={`testimonial-text ${(shouldTruncate || isTruncated) ? 'has-tooltip' : ''}`}
        >
          "{displayText}"
        </p>
        {showTooltip && (shouldTruncate || isTruncated) && (
          <div className="testimonial-tooltip">
            "{text}"
          </div>
        )}
      </div>
    );
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="error-container">
        <p className="error-message">Error loading testimonials: {error}</p>
      </div>
    );

  // Show message if no testimonials are available
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="testimonial-section">
        <div className="testimonial-container">
          <div className="testimonial-header">
            <Typography.Title level={2} className="testimonial-title">
              <span className="red-text">Testimonials</span>
            </Typography.Title>
            <Typography.Title level={3} className="testimonial-subtitle">
              Our Clients & Professional's Reviews
            </Typography.Title>
          </div>
          <div className="no-clients-message" style={{ textAlign: 'center', margin: '40px 0', fontSize: '1.2rem', color:'#4a5f73' }}>
            <p>No testimonials available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="testimonial-section">
      <div className="testimonial-container">
        <div className="testimonial-header">
          <Typography.Title level={2} className="testimonial-title">
            <span className="red-text">Testimonials</span>
          </Typography.Title>
          <Typography.Title level={3} className="testimonial-subtitle">
            Our Clients & Professional's Reviews
          </Typography.Title>
        </div>

        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={3}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            480: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 30 },
          }}
          className="testimonial-swiper"
        >
          {testimonials?.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="testimonial-card">
                <Quote className="testimonial-quote-icon" size={48} />
                <div className="testimonial-content">
                  <div className="testimonial-top-content">
                    <div className="testimonial-avatar">
                      <img
                        src={`${apiUrl}/architecture-web-app${testimonial.filepath}`
                        || DefaultAvatar}
                        alt={testimonial.fullname}
                      />
                    </div>
                    <div className="testimonial-rating">
                      {renderStarRating(testimonial.rating)}
                    </div>
                    <TruncatedText text={testimonial.message} maxLength={150} />
                  </div>
                  <div className="testimonial-author">
                    <h4>{testimonial.fullname}</h4>
                    <p className="testimonial-location">
                      {testimonial.designation}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TestimonialSlider;