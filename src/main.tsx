import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ConfigProvider } from "antd";
import { ANT_CONFIG } from "./constants/common.ts";
import { BrowserRouter } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'swiper/swiper-bundle.css';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider theme={ANT_CONFIG}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ConfigProvider>
);
