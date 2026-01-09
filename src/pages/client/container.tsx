import { Outlet } from 'react-router-dom';
import FooterComponent from './home/footer';
import NavbarComponent from './home/navbar';

const FrontContainer = () => {
  return (
    <>
      <NavbarComponent />
      <Outlet />
      <FooterComponent />
    </>
  );
};

export default FrontContainer;
