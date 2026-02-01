// AssociationSection.tsx
import React from "react";
import gharPlotLogo from "../../assets/images/548361845_122100870513014614_1778832371218339877_n.jpg";
import interiorConstruction from "../../assets/images/449467072_122107858814373129_7939150935589759784_n.jpg";
import "../client/AssocaiationSection.css";

interface Partner {
  name: string;
  description: string;
  link: string;
  logoUrl: string;
  accentColor: string;
}

const associations: Partner[] = [
  {
    name: "Ghar Plot Nepal",
    description: "Your trusted partner for premium land & house plots in Nepal",
    link: "https://www.facebook.com/p/Ghar-Plot-Nepal-61580438438809",
    logoUrl: gharPlotLogo,
    accentColor: "#262262",
  },
  {
    name: "Interior Construction Nepal",
    description: "Expert interior design & construction services across Nepal",
    link: "https://www.facebook.com/61561193882646",
    logoUrl: interiorConstruction,
    accentColor: "#262262",
  },
];

export default function AssociationSection() {
  return (
    <section className="association-section">
      <div className="content-wrapper">
        <div>
          <h2 className="section-title">
            Trusted <span>Association</span> Partners
          </h2>
          {/* <p className="section-subtitle">
            Working together with leading names in real estate and construction
            across Nepal
          </p> */}
        </div>
        <div className="partners-row">
          {associations.map((partner) => (
            <a
              key={partner.name}
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="partner-block"
              style={
                {
                  "--partner-accent": partner.accentColor,
                } as React.CSSProperties
              }
            >
              <div className="partner-logo-side">
                <img
                  src={partner.logoUrl}
                  alt={`${partner.name} logo`}
                  className="partner-logo"
                  loading="lazy"
                />
              </div>

              <div className="partner-info">
                <h3 className="partner-name">{partner.name}</h3>
                <p className="partner-desc">{partner.description}</p>
                <span className="visit-link">Visit Partner →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
