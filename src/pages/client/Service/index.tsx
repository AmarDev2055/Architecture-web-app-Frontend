import { Button, Typography } from "antd";
import ScrollToTop from "../../../components/client/ScrollToTop";
import { InnerHeader } from "../../../components/client/InnerHeader";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

import NayaNaksa from "../../../assets/images/Services/service-nayanaksa.webp";
import NaksaPass from "../../../assets/images/Services/services-NaksaPass.webp";
import OldHouseNewLooks1 from "../../../assets/images/Services/services-oldhousenewlooks1.webp";
import OldHouseNewLooks2 from "../../../assets/images/Services/services-oldhousenewlooks2.webp";
import InteriorDesign from "../../../assets/images/Services/service-InteriorDesign.webp";
import HotelResort from "../../../assets/images/Services/service-HotelResort.webp";
import gharCollection1 from "../../../assets/images/Services/service-gharCollection1.webp";
import gharCollection2 from "../../../assets/images/Services/service-gharCollection.webp";
import siteMeasurement from "../../../assets/images/Services/SiteMeasurementNew.webp";
import estimation from "../../../assets/images/Services/service-estimation.webp";
import evaluation from "../../../assets/images/Services/service-evaluation.webp";
import { ArrowBigDown, ArrowBigLeft, ArrowBigUp } from "lucide-react";

const { Title, Paragraph } = Typography;

interface Service {
  title: string;
  description: string;
  image: string;
  image2?: string;
  features: string[];
  id: string;
}

interface CardProps {
  title: string;
  description: string;
  image: string;
  image2?: string;
  features: string[];
}

const Services: React.FC = () => {
  const location = useLocation();
  const services: Service[] = [
    {
      title: "नयाँ नक्सा डिजाइन",
      description:
        "We design new building plans tailored to your needs, fully compliant with Nepal's building codes and municipal regulations. Our focus is on creating safe, sustainable, and aesthetically pleasing architectural designs.",
      image: NayaNaksa,
      features: [
        "Understanding the client's requirements, budget, and perspective",
        "Document collection",
        "Analysis according to the structure, beam, area, and location of the building",
        "Discuss with the consumer and make improvements",
        "Preparation of 3D drawing",
        "Proposal of structural parts such as civil, beam, foundation, etc. of the building",
        "Final drawing handover",
      ],
      id: "map-design",
    },
    {
      title: "नक्सा पास",
      description:
        "We provide end-to-end support for obtaining official map approval from local municipalities or ward offices in Nepal. Our service ensures that your building design complies with the Nepal National Building Code, Building Act 2055, and local bylaws. From preparing legal documents to coordinating with authorities, we make the approval process smooth, accurate, and fully lawful.",
      image: NaksaPass,
      features: [
        "Documents required for verification by the head of the mapping section",
        "Registration in Municipality – ebps Online Application",
        "GLD, Overlapping Check",
        "Structural Drawing",
        "Pay Taxes",
        "Architectual Drawing",
        "Verification by Mapping Section Head",
        "Ward Desk (Issue 15-Day Notice)",
        "Ward Engineer (Plinth Level Verification)",
        "Apply for super structure",
        "Municipal (Plinth Level Drawing – Start of Construction Work)",
        "Super structure (Permission for Super Structure)",
        "SUPER structure verify (Super Structure Inspection)",
        "Completion Certificate",
      ],
      id: "map-pass",
    },
    
    {
      title: "पुरानो घरलाई  नयाँ लूक्स ",
      description:
        "We specialize in transforming old or outdated buildings into modern, functional, and visually appealing spaces. Our renovation services focus on structural safety, aesthetic upgrades, and space optimization — all while preserving the building's core integrity. Whether it's a traditional home or a commercial structure, we bring new life to your old property.",
      image: OldHouseNewLooks1,
      image2: OldHouseNewLooks2,
      features: [
        "Structural Integrity",
        "Modern Techniques",
        "Timely Completion",
      ],
      id: "old-new",
    },
    {
      title: "Interior Finishing",
      description:
        "We deliver creative and functional interior finishing solutions tailored to your space, style, and purpose. From material selection to final detailing, our team ensures a high-quality, elegant finish that reflects your vision and meets architectural standards.",
      image: InteriorDesign,
      features: [
        "Custom Designs",
        "High-Quality Materials",
        "Modern Aesthetics",
      ],
      id: "interior-finishing",
    },
    {
      title: "Hotel, Resort, Party Palace, Restaurant & Cafe",
      description:
        "We design hospitality and event spaces with a strong focus on comfort, functionality, and brand identity. Our designs are compliant with Nepali building standards and optimized for guest experience, aesthetics, and operational efficiency.",
      image: HotelResort,
      features: ["Luxury Designs", "Functional Layouts", "Outdoor Spaces"],
      id: "hospitality-design",
    },
    {
      title: "Complex Building Construction",
      description:
        "We handle the construction of large-scale and multi-story structures, including apartments, commercial complexes, and institutions. Our process ensures technical precision, structural safety, and timely project execution under Nepali laws and standards.",
      image: gharCollection1,
      image2: gharCollection2,
      features: [
        "Structural Integrity",
        "Modern Techniques",
        "Timely Completion",
      ],
      id: "complex-construction",
    },
    {
      title: "Site Measurement, Supervision & Land Survey",
      description:
        "Accurate site measurement and supervision are key to any successful project. We provide detailed land surveys and continuous site supervision to ensure construction aligns with approved plans, minimizing errors and delays.",
      image: siteMeasurement,
      features: [
        "Detailed Surveys",
        "Expert Supervision",
        "Precision Planning",
      ],
      id: "",
    },
    {
      title: "Estimating & Costing",
      description:
        "We offer detailed cost estimation services based on current market rates, material selection, and project scale. Our estimates help clients plan financially and avoid unexpected expenses throughout the construction process.",
      image: estimation,
      features: ["Accurate Estimates", "Cost Management", "Budget Planning"],
      id: "",
    },
    {
      title: "Property Valuation",
      description:
        "Our licensed professionals provide certified property valuation services for land, houses, and buildings. Whether for loan, insurance, or sale purposes, we offer reliable and legally valid property value reports.",
      image: evaluation,
      features: ["Market Analysis", "Expert Valuation", "Detailed Reports"],
      id: "",
    },
  ];

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const serviceDetailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.hash) {
      const serviceId = location.hash.slice(1);
      const service = services.find((s) => s.id === serviceId);
      if (service) {
        setSelectedService(service);
        setTimeout(() => {
          if (serviceDetailRef.current) {
            serviceDetailRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      }
    }
  }, [location.hash]);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setTimeout(() => {
      if (serviceDetailRef.current) {
        serviceDetailRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  // const Card: React.FC<CardProps> = ({
  //   title,
  //   description,
  //   image,
  //   image2,
  //   features,
  // }) => (
  //   <div className="service-card-page">
  //     <div className="image-side-page">
  //       <div className="image-wrapper-page">
  //         {image2 ? (
  //           <div className="dual-image-container">
  //             <img src={image} alt={`${title} - Image 1`} />
  //             <img src={image2} alt={`${title} - Image 2`} />
  //           </div>
  //         ) : (
  //           <img src={image} alt={title} />
  //         )}
  //       </div>
  //     </div>
  //     <div className="content-side-page">
  //       <div className="content-wrapper-page">
  //         <div className="section-title-wrapper-page">
  //           <Title level={2} className="service-title-page">
  //             {title}
  //           </Title>
  //           <div className="title-decorator-page"></div>
  //         </div>
  //         <Paragraph className="service-description-page">
  //           {description}
  //         </Paragraph>
  //         <div className="divider-page"></div>
  //         <ul className="features-list-page">
  //           {features.map((feature, idx) => (
  //             <li key={idx}>
  //               <span>{feature}</span>
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //     </div>
  //   </div>
  // );
  const Card: React.FC<CardProps> = ({
    title,
    description,
    image,
    image2,
    features,
  }) => {
    const [showAllFeatures, setShowAllFeatures] = useState(false);
    const maxFeatures = 4; // Show up to 6 features by default
  
    return (
      <div className="service-card-page">
        <div className="image-side-page">
          <div className="image-wrapper-page">
            {image2 ? (
              <div className="dual-image-container">
                <img src={image} alt={`${title} - Image 1`} />
                <img src={image2} alt={`${title} - Image 2`} />
              </div>
            ) : (
              <img src={image} alt={title} />
            )}
          </div>
        </div>
        <div className="content-side-page">
          <div className="content-wrapper-page">
            <div className="section-title-wrapper-page">
              <Title level={2} className="service-title-page">
                {title}
              </Title>
              <div className="title-decorator-page"></div>
            </div>
            <Paragraph className="service-description-page">
              {description}
            </Paragraph>
            <div className="divider-page"></div>
            <ul className="features-list-page">
              {features
                .slice(0, showAllFeatures ? features.length : maxFeatures)
                .map((feature, idx) => (
                  <li key={idx}>
                    <span>{feature}</span>
                  </li>
                ))}
            </ul>
            {features.length > maxFeatures && (
              <Button
                type="primary"
                onClick={() => setShowAllFeatures(!showAllFeatures)}
              >
                {showAllFeatures ? (
                  <>
                    Show Less <ArrowBigUp />
                  </>
                ) : (
                  <>
                    Show More <ArrowBigDown />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <InnerHeader title="Services" currentPage="SERVICES" />
      <section className="services-section-page">
        <div className="container">
          <div className="service-grid">
            {services.map((service) => (
              <div
                key={service.id}
                className="service-item"
                onClick={() => handleServiceClick(service)}
              >
                <h3>{service.title}</h3>
                <div className="image-container">
                  {service.image2 ? (
                    <div className="dual-image-container">
                      <img
                        src={service.image}
                        alt={`${service.title} - Image 1`}
                      />
                      <img
                        src={service.image2}
                        alt={`${service.title} - Image 2`}
                      />
                    </div>
                  ) : (
                    <img src={service.image} alt={service.title} />
                  )}
                </div>
              </div>
            ))}
          </div>
          {selectedService && (
            <div className="service-detail" ref={serviceDetailRef}>
              <Button
                className="back-btn-page"
                onClick={() => {
                  setSelectedService(null);
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }, 100);
                }}
              >
                <ArrowBigLeft /> Back
              </Button>
              <Card
                title={selectedService.title}
                description={selectedService.description}
                image={selectedService.image}
                image2={selectedService.image2}
                features={selectedService.features}
              />
            </div>
          )}
        </div>
        <ScrollToTop />
      </section>
    </>
  );
};

export default Services;
// import { CheckCircleOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
// import { Button, Typography, Modal } from "antd";
// import ScrollToTop from "../../../components/client/ScrollToTop";
// import { InnerHeader } from "../../../components/client/InnerHeader";
// import flowchartDesign from "../../../assets/images/DesignProcess-FlowchartImg.png";
// import flowchartMunicipal from "../../../assets/images/Municipal-FlowChart.png";
// import step1DesignApproach from "../../../assets/images/DesignProcess-Step1.png";
// import step2DesignApproach from "../../../assets/images/DesignProcess-Step2.png";
// import step3DesignApproach from "../../../assets/images/DesignProcess-Step3.png";
// import { useState, useEffect } from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { useLocation } from "react-router-dom";

// const { Title, Paragraph } = Typography;

// // TypeScript interfaces
// interface Service {
//   title: string;
//   description: string;
//   image: string;
//   stepImages: string[];
//   stepTitles: string[];
//   stepDescriptions: string[];
//   features: string[];
//   id: string;
// }

// interface ModalSlide {
//   type: 'main' | 'step';
//   image: string;
//   title: string;
//   description: string;
//   stepNumber?: number;
// }

// interface ArrowProps {
//   className?: string;
//   style?: React.CSSProperties;
//   onClick?: () => void;
// }

// // Custom arrow components for the slider
// const CustomPrevArrow: React.FC<ArrowProps> = (props) => {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={`${className} custom-arrow custom-prev-arrow`}
//       style={{ ...style }}
//       onClick={onClick}
//     >
//       <LeftOutlined />
//     </div>
//   );
// };

// const CustomNextArrow: React.FC<ArrowProps> = (props) => {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={`${className} custom-arrow custom-next-arrow`}
//       style={{ ...style }}
//       onClick={onClick}
//     >
//       <RightOutlined />
//     </div>
//   );
// };

// const Services: React.FC = () => {
//   const location = useLocation();

//   useEffect(() => {
//     // Check if there's a hash in the URL
//     if (location.hash) {
//       const element = document.getElementById(location.hash.slice(1));
//       if (element) {
//         element.scrollIntoView({ behavior: 'smooth' });
//       }
//     }
//   }, [location]);

//   const services: Service[] = [
//     {
//       title: "डिजाइन प्रक्रिया (Design Process)",
//       description:
//         "Our design philosophy combines aesthetic excellence with functional practicality. We create spaces that not only look stunning but also enhance the quality of life for their occupants. Through careful consideration of light, space, and materials, we develop architectural solutions that stand the test of time.",
//       image: flowchartDesign,
//       stepImages: [
//         step1DesignApproach,
//         step2DesignApproach,
//         step3DesignApproach,
//         step3DesignApproach,
//         step3DesignApproach,

//       ],
//       stepTitles: [
//         "ग्राहकको आवश्यकता, बजेट र दृष्टिकोणको बुझाइ",
//         "कागजात संकलन",
//         "भवनको संरचना, ढाँचा, आकार, र स्थानको वास्तु अनुसार विवरणको ARCHITECTURAL DRAWING"
//       ],
//       stepDescriptions: [
//         // "ग्राहकको आवश्यकता, बजेट र दृष्टिकोणको बुझाइ",
//         // "कागजात संकलन",
//         // "भवनको संरचना, ढाँचा, आकार, र स्थानको वास्तु अनुसार विवरणको ARCHITECTURAL DRAWING"
//       ],
//       features: [
//         "Custom Design Solutions",
//         "Sustainable Architecture",
//         "Interior Planning",
//       ],
//       id: 'design-process'
//     },
//     {
//       title: "नगरपालिकाको प्रक्रिया (Municipal Process)",
//       description:
//         "Our design philosophy combines aesthetic excellence with functional practicality. We create spaces that not only look stunning but also enhance the quality of life for their occupants. Through careful consideration of light, space, and materials, we develop architectural solutions that stand the test of time.",
//       image: flowchartMunicipal,
//       stepImages: [
//         step1DesignApproach,
//         step2DesignApproach,
//         step3DesignApproach,
//       ],
//       stepTitles: [
//         "Application Submission",
//         "Review & Approval Process",
//         "Final Permit Issuance"
//       ],
//       stepDescriptions: [
//         // "Submit building plans and required documents to municipal office",
//         // "Technical review by municipal engineers and compliance verification",
//         // "Final approval and building permit certificate issuance"
//       ],
//       features: [
//         "Custom Design Solutions",
//         "Sustainable Architecture",
//         "Interior Planning",
//       ],
//       id: 'municipal-process'
//     },
//     {
//       title: "निर्माण प्रक्रिया (Construction Process)",
//       description:
//         "We leverage cutting-edge technology and innovative thinking to solve complex architectural challenges. Our team stays ahead of industry trends, incorporating smart home features, sustainable materials, and energy-efficient systems into every project while maintaining the timeless principles of good design.",
//       image: flowchartDesign,
//       stepImages: [
//         step1DesignApproach,
//         step1DesignApproach,
//         step1DesignApproach,
//       ],
//       stepTitles: [
//         "Foundation & Structure",
//         "Building Framework",
//         "Finishing & Handover"
//       ],
//       stepDescriptions: [
//         // "Site preparation, excavation, and foundation construction",
//         // "Structural framework, walls, and roofing installation",
//         // "Interior finishing, quality checks, and project handover"
//       ],
//       features: [
//         "Smart Home Integration",
//         "Energy Efficiency",
//         "Modern Materials",
//       ],
//       id: 'construction-process'
//     },
//     {
//       title: "वास्तु शास्त्र (Vaastu Shastra)",
//       description:
//         "From concept to completion, our project management expertise ensures smooth execution of every detail. We coordinate with contractors, manage timelines, and oversee budgets while maintaining transparent communication with our clients throughout the entire building process.",
//       image: flowchartDesign,
//       stepImages: [
//         step1DesignApproach,
//         step1DesignApproach,
//         step1DesignApproach,
//       ],
//       stepTitles: [
//         "Site Analysis",
//         "Vaastu Compliance Design",
//         "Final Verification"
//       ],
//       stepDescriptions: [
//         // "Detailed site evaluation according to Vaastu principles",
//         // "Design modification to align with Vaastu guidelines",
//         // "Final verification and certification of Vaastu compliance"
//       ],
//       features: ["Timeline Management", "Budget Control", "Quality Assurance"],
//       id: 'vaastu-shastra'
//     },
//   ];

//   // Slider settings for modal
//   const modalSliderSettings = {
//    dots: true,
//     infinite: false,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: true,
//     prevArrow: <CustomPrevArrow />,
//     nextArrow: <CustomNextArrow />,
//     adaptiveHeight: true,
//   };

//   return (
//     <>
//       <InnerHeader title="Services" currentPage="SERVICES" />
//       <section className="services-section-page">
//         <div className="container">
//           {services.map((service: Service, index: number) => {
//             // State hooks moved inside the component but outside the JSX return
//             const ServiceCard: React.FC = () => {
//               const [activeImage, setActiveImage] = useState<string>(service.image);
//               const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
//               const [modalInitialSlide, setModalInitialSlide] = useState<number>(0);

//               const showModal = (idx: number | null = null): void => {
//                 if (idx !== null) {
//                   setModalInitialSlide(idx + 1); // +1 because first slide is the main flowchart
//                 } else {
//                   setModalInitialSlide(0); // Show main flowchart
//                 }
//                 setIsModalVisible(true);
//               };

//               const handleModalCancel = (): void => {
//                 setIsModalVisible(false);
//               };

//               const handleStepClick = (stepImage: string, idx: number): void => {
//                 setActiveImage(stepImage);
//                 showModal(idx);
//               };

//               // Prepare modal slides with main flowchart first, then steps
//               const modalSlides: ModalSlide[] = [
//                 {
//                   type: 'main',
//                   image: service.image,
//                   title: service.title,
//                   description: 'Main Process Flowchart'
//                 },
//                 ...service.stepImages.map((stepImage: string, idx: number) => ({
//                   type: 'step' as const,
//                   image: stepImage,
//                   title: service.stepTitles[idx],
//                    description: service.stepDescriptions[idx],
//                   stepNumber: idx + 1
//                 }))
//               ];

//               return (
//                 <div
//                   id={service.id}
//                   className={`service-card-page ${index % 2 !== 0 ? "reverse" : ""} fade-in`}
//                 >
//                   <div className="image-side-page">
//                     <div className="image-wrapper-page">
//                       <img
//                         src={activeImage}
//                         alt={service.title}
//                         onClick={() => showModal()}
//                         style={{ cursor: "pointer" }}
//                       />
//                       {activeImage !== service.image && (
//                         <div
//                           className="back-to-flowchart"
//                           onClick={() => setActiveImage(service.image)}
//                         >
//                           Back to Flowchart
//                         </div>
//                       )}
//                     </div>

//                     <div className="step-images-gallery">
//                       {service.stepImages.map((stepImage: string, idx: number) => (
//                         <div
//                           key={idx}
//                           className={`step-image-wrapper ${
//                             activeImage === stepImage ? "active" : ""
//                           }`}
//                           onClick={() => handleStepClick(stepImage, idx)}
//                         >
//                           <div className="step-number">
//                             {idx + 1}
//                           </div>
//                           <img
//                             src={stepImage}
//                             alt={`Step ${idx + 1} for ${service.title}`}
//                           />
//                           {/* <div className="step-title">
//                             {service.stepTitles[idx]}
//                           </div> */}
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="content-side-page">
//                     <div className="content-wrapper-page">
//                       <div className="section-title-wrapper-page">
//                         <Title level={2} className="service-title-page">
//                           {service.title}
//                         </Title>
//                         <div className="title-decorator-page"></div>
//                       </div>
//                       <Paragraph className="service-description-page">
//                         {service.description}
//                       </Paragraph>
//                       <div className="divider-page"></div>
//                       <ul className="features-list-page">
//                         {service.features.map((feature: string, featureIdx: number) => (
//                           <li key={featureIdx}>
//                             <CheckCircleOutlined className="feature-icon-page" />
//                             <span>{feature}</span>
//                           </li>
//                         ))}
//                       </ul>
//                       <Button type="primary" className="learn-more-btn-page">
//                         Learn More
//                       </Button>
//                     </div>
//                   </div>

//                   <Modal
//                     visible={isModalVisible}
//                     onCancel={handleModalCancel}
//                     footer={null}
//                     centered
//                     width={900}
//                     className="enhanced-image-modal"
//                     destroyOnClose
//                   >
//                     <Slider {...modalSliderSettings} initialSlide={modalInitialSlide}>
//                       {modalSlides.map((slide: ModalSlide, slideIdx: number) => (
//                         <div key={slideIdx} className="modal-slide-wrapper">
//                           <div className="modal-slide-header">
//                             {slide.type === 'step' && (
//                               <div className="step-badge">
//                                 Step {slide.stepNumber}
//                               </div>
//                             )}
//                             <h3 className="slide-title">{slide.title}</h3>
//                           </div>
//                           <div className="modal-image-container">
//                             <img
//                               src={slide.image}
//                               alt={slide.title}
//                             />
//                           </div>
//                           <div className="modal-slide-footer">
//                             <p className="slide-description">{slide.description}</p>
//                           </div>
//                         </div>
//                       ))}
//                     </Slider>
//                   </Modal>
//                 </div>
//               );
//             };

//             return <ServiceCard key={service.title} />;
//           })}
//         </div>
//         <ScrollToTop />
//       </section>
//     </>
//   );
// };

// export default Services;

