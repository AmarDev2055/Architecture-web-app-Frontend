import {Button, Result} from "antd";
import {Link} from "react-router-dom";
const PageNotFound = () => {

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f8',
  };

    return (
      <div className="not-found-container" style={containerStyle}>
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you are looking for does not exist."
            extra={<Button type="primary"><Link to="/">Back to Home</Link></Button>}
        />
      </div>
  );
};

export default PageNotFound;
