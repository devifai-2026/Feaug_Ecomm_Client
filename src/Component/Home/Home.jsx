import React from 'react';
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
    return (
        <div>
            <BottomBanner></BottomBanner>
            <FeaturedCollection></FeaturedCollection>
            <CleopatraGlam></CleopatraGlam>
            <ExploreProducts></ExploreProducts>
            <BestSeller></BestSeller>
            <Services></Services>
            <FlashSale></FlashSale>
            <FAQ></FAQ>
            <QuestionsUpdate></QuestionsUpdate>
            <TopFooter></TopFooter>
        </div>
    );
};

export default Home;