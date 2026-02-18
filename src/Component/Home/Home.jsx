import React, { useEffect } from 'react';
import Banner from '../Common/Banner';
import BottomBanner from './BottomBanner';
import FeaturedCollection from './FeaturedCollection';
import CleopatraGlam from './CleopatraGlam';
import ExploreProducts from './ExploreProducts';
import Services from './Services';
import FlashSale from './FlashSale';
import TopFooter from './TopFooter';
import BestSeller from './BestSeller';
import QuestionsUpdate from './QuestionsUpdate';
import FAQ from './FAQ';

const Home = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            {/* Header Banner is rendered by Navbar carousel (fetches position="top") */}

            <BottomBanner></BottomBanner>
            <FeaturedCollection></FeaturedCollection>
            <CleopatraGlam />
            <ExploreProducts></ExploreProducts>
            <BestSeller></BestSeller>
            <Services></Services>
            <FlashSale></FlashSale>

            {/* Middle Banner - Between content sections */}
            {/* <Banner
                page="home"
                position="middle"
                className="h-48 md:h-64 my-8"
            /> */}

            <FAQ></FAQ>
            <QuestionsUpdate></QuestionsUpdate>

            {/* Bottom Banner - Before footer */}
            <Banner
                page="home"
                position="bottom"
                className="h-40 md:h-52"
            />

            <TopFooter></TopFooter>
        </div>
    );
};

export default Home;