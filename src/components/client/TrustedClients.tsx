import { motion } from "framer-motion";
import useGetAPI from "../../hooks/useGetAPI";
import LoadingSpinner from "./LoadingSpinner";
import { apiUrl } from "../../utils";

interface Client {
  id: number;
  name: string;
  link: string;
  filepath: string | null;
  filename: string | null;
}

const OurTrustedClients: React.FC = () => {
  const {
    data: clients,
    loading,
    error,
  } = useGetAPI<Client[]>("architecture-web-app/our-clients/feature");

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="error-container">
        <p className="error-message">Error loading clients: {error}</p>
      </div>
    );

  // Filter out clients with null fileurl
  const validClients = clients?.filter((client) => client.filepath) || [];
  // Duplicate for seamless looping on all viewports (mobile + desktop)
  const marqueeClients = [...validClients, ...validClients];

  return (
    <section className="trusted-clients">
      <div className="trusted-clients__container">
        <motion.h2
          className="trusted-clients__title"
          initial={{ opacity: 0, translateY: 50 }}
          whileInView={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.6 }}
        >
          OUR TRUSTED CLIENTS
        </motion.h2>

        {validClients.length > 0 ? (
          <div
            className="trusted-clients__marquee"
            style={
              {
                "--marquee-duration": `${marqueeClients.length * 3.5}s`,
              } as React.CSSProperties
            }
          >
            <div className="trusted-clients__marquee-inner">
              {marqueeClients.map((client, index) => (
                <a
                  key={`${client.id}-${index}`}
                  href={client.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="trusted-clients__logo-wrapper"
                >
                  <img
                    src={`${apiUrl}/architecture-web-app${client.filepath}`}
                    alt={client.name}
                    className="trusted-clients__logo"
                  />
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-clients-message">
            <p>No client logos available.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default OurTrustedClients;
