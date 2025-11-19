import React from 'react';
import Navbar from '../Home/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../Home/Footer';

const Layout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
            
        </div>
    );
};

export default Layout;