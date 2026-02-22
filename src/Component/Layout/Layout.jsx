import React, { useEffect } from 'react';
import Navbar from '../Home/Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../Home/Footer';

const Layout = () => {
    const location = useLocation();

    // Scroll to top on every page/route change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [location.pathname]);
    
    // Define which paths should hide the footer
    const hideFooterPaths = ['/login', '/register', '/forgotPassword'];
    
    // Check if current path should hide footer
    const shouldHideFooter = hideFooterPaths.some(path => 
        location.pathname.startsWith(path)
    );

    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            {!shouldHideFooter && <Footer></Footer>}
        </div>
    );
};

export default Layout;