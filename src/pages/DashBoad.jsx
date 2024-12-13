import React from 'react';
import DarkVariantExample from '../components/Carousel';
import TopNavBar from '../components/TopNavBar';
import ResponsiveCarousel from '../components/MultiCarousel';
import { Divider } from 'antd';
import Footer from '../components/Footer';

function DashBoard() {
    return (
        <>
            <TopNavBar />
            <div style={{ position: 'relative', width: '100%' }}>
                <DarkVariantExample />
            </div>

            {/* <div>
                <Divider style={{ borderColor: '#1A3757' }}>Aluminium</Divider>
            </div> */}

            <div>
                <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Responsive Card Carousel</h1>
                <ResponsiveCarousel dir={true} />
            </div>

            <div style={{ margin: '0 auto', width: '80%', marginTop:"4%" }}>
                <Divider style={{ borderColor: '#1A3757' }}>Aluminium</Divider>
            </div>

            <div>
                <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Responsive Card Carousel</h1>
                <ResponsiveCarousel dir={false} />
            </div>
            <div style={{ margin: '0 auto', width: '80%', marginTop:"4%" }}>
                <Divider style={{ borderColor: '#1A3757' }}>Aluminium</Divider>
            </div>



            <div>
                <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Responsive Card Carousel</h1>
                <ResponsiveCarousel dir={true} />
            </div>

            <div style={{ margin: '0 auto', width: '80%', marginTop:"4%" }}>
                <Divider style={{ borderColor: '#1A3757' }}>Aluminium</Divider>
            </div>

            <div>
                <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Responsive Card Carousel</h1>
                <ResponsiveCarousel dir={false} />
            </div>
            <div style={{ margin: '0 auto', width: '80%', marginTop:"4%" }}>
                <Divider style={{ borderColor: '#1A3757' }}></Divider>
            </div>

<div>
    <Footer/>
</div>
        </>
    );
}

export default DashBoard;
