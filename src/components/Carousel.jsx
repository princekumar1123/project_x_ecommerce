import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';

function DarkVariantExample() {
    return (
        <Carousel data-bs-theme="dark" style={{ overflow: 'hidden' }}>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    style={{ height: 'calc(70vh - 56px)', objectFit: 'fill' }}
                    src="https://picsum.photos/id/237/1920/1080"
                    alt="First slide"
                />
                <Carousel.Caption>
                    <h5>First slide label</h5>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    style={{ height: 'calc(70vh - 56px)', objectFit: 'fill' }}
                    src="https://picsum.photos/1920/1080?grayscale"
                    alt="Second slide"
                />
                <Carousel.Caption>
                    <h5>Second slide label</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    style={{ height: 'calc(70vh - 56px)', objectFit: 'fill' }}
                    src="https://picsum.photos/seed/picsum/1920/1080"
                    alt="Third slide"
                />
                <Carousel.Caption>
                    <h5>Third slide label</h5>
                    <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                </Carousel.Caption>
            </Carousel.Item>

        </Carousel>
    );
}

export default DarkVariantExample;