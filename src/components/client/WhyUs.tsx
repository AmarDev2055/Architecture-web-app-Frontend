import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Building, Globe } from 'lucide-react';

interface WhyChooseUsProps {
  className?: string;
}

const WhyUs: React.FC<WhyChooseUsProps> = ({ className }) => {
  const expertiseAreas = [
    {
      icon: <Palette size={56} strokeWidth={1.5} />,
      title: 'Expertise That Delivers Excellence',
      description: "Our multidisciplinary team includes seasoned architects, interior designers, and engineers with years of practical experience in Nepal’s construction landscape. From concept to completion, we provide end-to-end services that ensure quality, consistency, and efficiency throughout every phase. Our proven track record of successful residential, commercial, institutional, and hospitality projects—both locally and internationally—speaks to the trust we've built with our clients.",

    },
    {
      icon: <Building size={56} strokeWidth={1.5} />,
      title: 'Client-Focused, Innovative, and Transparent',
      description: 'We place your vision at the core of our work. By actively listening and understanding your needs, we create customized solutions that blend creativity, functionality, and value. Our commitment to sustainability and modern aesthetics results in designs that are not only visually stunning but also environmentally responsible. We maintain full transparency with honest pricing, clear communication, and regular updates, ensuring a smooth and professional experience from start to finish.',

    },
    {
      icon: <Globe size={56} strokeWidth={1.5} />,
      title: 'Smart, Reliable, and Nationwide Services',
      description: 'With service coverage across Nepal, we are equipped to handle projects anywhere in the country. Our skilled site engineers and coordinators provide continuous on-site supervision and technical support to maintain quality and control. For our international clients, we offer online consultations and real-time construction monitoring via CCTV and digital reports. Our proprietary mobile and web apps keep clients connected—allowing instant access to designs, updates, and progress reports in a fully digital and systematic way.',

    }
  ];

  return (
    <section className={`architectural-expertise ${className}`}>
      <div className="architectural-expertise__container">
        <motion.h2 
          className="architectural-expertise__title"
          initial={{ opacity: 0, translateY: 50 }}
          whileInView={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.6 }}
        >
          WHY CHOOSE US ?
        </motion.h2>
        
        <div className="architectural-expertise__grid">
          {expertiseAreas.map((area, index) => (
            <motion.div
              key={area.title}
              className="expertise-card"
              initial={{ opacity: 0, translateY: 50 }}
              whileInView={{ opacity: 1, translateY: 0 }}
              transition={{ 
                duration: 0.6,
                delay: index * 0.2 
              }}
            >
              <div className="expertise-card__icon">
                {area.icon}
              </div>
              <h3 className="expertise-card__title">{area.title}</h3>
              <p className="expertise-card__description">{area.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;