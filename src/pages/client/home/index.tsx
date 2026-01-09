/* eslint-disable @typescript-eslint/no-explicit-any */
import { Layout } from "antd";
import BannerComponent from "./banner";
import ScrollToTop from "../../../components/client/ScrollToTop.tsx";
import ContactUsSection from "../../../components/client/ContactUsSection.tsx";
import YoutubeVideoSection from "../../../components/client/YoutubeVideoSection.tsx";
import TestimonialSlider from "../../../components/client/Testimonial.tsx";
import ProjectsSection from "../../../components/client/ProjectsSection.tsx";
import Services from "./services.tsx";
import WhyUs from "../../../components/client/WhyUs.tsx";
import LoadingSpinner from "../../../components/client/LoadingSpinner";
import useGetAPI from "../../../hooks/useGetAPI";
import TrustedClientsSection from "../../../components/client/TrustedClients.tsx";

interface BannerData {
  id: number;
  imageUrl: string;
  filepath: string;
  heading: string;
  subHeading: string;
  description: string;
}

const Home = () => {
  const {
    data: bannerData,
    loading,
    error,
  } = useGetAPI<BannerData>(`architecture-web-app/banner`);

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="error-message">Error loading page: {error}</div>;
  if (!bannerData) return null;

  return (
    <>
      <BannerComponent bannerData={bannerData} />
      <Layout>
        <Services />
      </Layout>
      <Layout>
        <YoutubeVideoSection />
      </Layout>
      <Layout>
        <WhyUs />
      </Layout>
      <Layout>
        <TrustedClientsSection />
      </Layout>
      <Layout>
        <ProjectsSection />
      </Layout>
      <Layout>
        <TestimonialSlider />
      </Layout>
      <Layout>
        <ContactUsSection />
      </Layout>
      <ScrollToTop />
    </>
  );
};

export default Home;
