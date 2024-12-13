import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Card from './Card';

function ResponsiveCarousel({dir}) {
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 1024 },
            items: 5,
            partialVisibilityGutter: 20, // Adds gap between cards
        },
        desktop: {
            breakpoint: { max: 1024, min: 768 },
            items: 3,
            partialVisibilityGutter: 20,
        },
        tablet: {
            breakpoint: { max: 768, min: 464 },
            items: 2,
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
            title: 'Card 1',
            description: 'This is the description for card 1.',
            image: 'https://picsum.photos/200/300?random=1',
        },
        {
            title: 'Card 2',
            description: 'This is the description for card 2.',
            image: 'https://picsum.photos/200/300?random=2',
        },
        {
            title: 'Card 3',
            description: 'This is the description for card 3.',
            image: 'https://picsum.photos/200/300?random=3',
        },
        {
            title: 'Card 4',
            description: 'This is the description for card 4.',
            image: 'https://picsum.photos/200/300?random=4',
        },
        {
            title: 'Card 5',
            description: 'This is the description for card 5.',
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
            itemClass="carousel-item-padding-40-px" // Adds space between items
            customTransition="transform 300ms ease-in-out"
        >
            {cards.map((card, index) => (
                <div key={index} style={{ padding: '10px', display: "flex", justifyContent: "center" }}> {/* Add spacing */}
                    <Card
                        title={card.title}
                        description={card.description}
                        image={card.image}
                    />
                </div>
            ))}
        </Carousel>
    );
}

export default ResponsiveCarousel;
