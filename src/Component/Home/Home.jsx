import React from 'react';
import BottomBanner from './BottomBanner';
import FeaturedCollection from './FeaturedCollection';
import CleopatraGlam from './CleopatraGlam';
import ExploreProducts from './ExploreProducts';
import Services from './Services';
import FlashSale from './FlashSale';
import TopFooter from './TopFooter';

const Home = () => {
    return (
        <div>
            <BottomBanner></BottomBanner>
            <FeaturedCollection></FeaturedCollection>
            <CleopatraGlam></CleopatraGlam>
            <ExploreProducts></ExploreProducts>
            <Services></Services>
            <FlashSale></FlashSale>
            <TopFooter></TopFooter>
        </div>
    );
};

export default Home;