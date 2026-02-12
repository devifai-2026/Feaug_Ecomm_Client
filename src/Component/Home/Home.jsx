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
            {/* Hero Banner - Fetches banner for home page at hero position */}
            <Banner
                page="home"
                position="hero"
                className="h-[60vh] md:h-[70vh] lg:h-[80vh]"
                autoPlay={true}
                autoPlayInterval={5000}
            />

            {/* Top Banner - Optional promotional banner */}
            <Banner
                page="home"
                position="top"
                className="h-32 md:h-40"
            />

            <BottomBanner></BottomBanner>
            <FeaturedCollection></FeaturedCollection>
            <CleopatraGlam></CleopatraGlam>
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