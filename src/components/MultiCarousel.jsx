import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Card from './Card';
import { Link, useNavigate } from 'react-router-dom';

function ResponsiveCarousel({ dir }) {
    const navigate = useNavigate()
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 1024 },
            items: 5,
            partialVisibilityGutter: 20,
        },
        desktop: {
            breakpoint: { max: 1024, min: 768 },
            items: 4,
            partialVisibilityGutter: 20,
        },
        tablet: {
            breakpoint: { max: 768, min: 464 },
            items: 3,
            partialVisibilityGutter: 15,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            partialVisibilityGutter: 10,
        },
    };

    const cards = [
        {
            title: 'Samsung 6.5kg washing machine',
            description: 'This is a wonderful product to buy.',
            image: 'https://picsum.photos/200/300?random=1',
        },
        {
            title: 'LG Television',
            description: 'This is 32 inch television.',
            image: 'https://picsum.photos/200/300?random=2',
        },
        {
            title: 'Sony Home theator',
            description: 'This is a bass booster.',
            image: 'https://picsum.photos/200/300?random=3',
        },
        {
            title: 'Mi Watch',
            description: 'This is calculate the time.',
            image: 'https://picsum.photos/200/300?random=4',
        },
        {
            title: 'Samsung 1.5ton split AC',
            description: 'It is used to cool your enviroinment',
            image: 'https://picsum.photos/200/300?random=5',
        },
    ];
    return (
        <Carousel
            rtl={dir}
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={1500}
            containerClass="carousel-container"
            itemClass="carousel-item-padding-40-px"
            customTransition="transform 300ms ease-in-out"
        >
            {cards.map((card, index) => (
                <div key={index} style={{ padding: '10px', display: "flex", justifyContent: "center" }} onClick={() => { navigate("/detail") }}>
                    <Card
                        title={card.title}
                        description={card.description}
                        image={card.image}
                        onClick={() => { }}
                    />
                </div>
            ))}
        </Carousel>
    );
}

export default ResponsiveCarousel;
