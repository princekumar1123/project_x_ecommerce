import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';

function SingleCarousel() {
    return (
        <Carousel data-bs-theme="dark" style={{ overflow: 'hidden' }}>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    style={{ height: 'calc(70vh - 56px)', objectFit: 'cover' }}
                    src={`shoppingimg.jpg`}
                    alt="First slide"
                />
                <Carousel.Caption>
                    <h5 style={{ color: "white" }}>New Arrivals Just Landed</h5>
                    <p style={{ color: "white" }}>Explore the latest trends in fashion, electronics, and more.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    style={{ height: 'calc(70vh - 56px)', objectFit: 'cover' }}
                    src="shoppingimg2.jpg"
                    alt="Second slide"
                />
                <Carousel.Caption>
                    <h5 style={{ color: "white" }}>Hot Deals on Trendy Items</h5>
                    <p style={{ color: "white" }}>Shop now and save big on your favorite brands.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    style={{ height: 'calc(70vh - 76px)', objectFit: 'cover' }}
                    src="shoppingimg3.jpg"
                    alt="Third slide"
                />
                <Carousel.Caption>
                    <h5 style={{ color: "white" }}>Exclusive Products Await You</h5>
                    <p style={{ color: "white" }}>Discover unique items you won't find anywhere else!</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}

export default SingleCarousel;