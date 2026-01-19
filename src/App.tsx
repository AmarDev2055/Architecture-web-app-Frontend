import { Fragment } from "react";
import "./assets/scss/index.scss";
import RouteConfig from "./routes/routerConfig";
import { App as AntdApp } from "antd";
// import Loading from "./components/Loading";

function App() {

  return (
    <Fragment>
      <AntdApp notification={{ placement: "topRight" }}>
        <RouteConfig />
      </AntdApp>
    </Fragment>
  );
}

export default App;
