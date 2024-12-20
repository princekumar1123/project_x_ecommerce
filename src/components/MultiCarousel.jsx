import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Card from "./Card";
import { Link, useNavigate } from 'react-router-dom';


function ResponsiveCarousel({ data, dir }) {


    console.log("data", data);

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
            {data.map((item, index) => (
                <div key={index} style={{ padding: "10px", display: "flex", justifyContent: "center" }} onClick={() => { navigate("/detail", { state: { id: item._id } }) }}>
                    <Card
                        title={item.title}
                        description={item.description}
                        image={item.image[0]}
                        rating={item.rating}
                        reviews={item.review.length}
                        price={Math.round(item.maxPrice - ((item.discount / 100) * item.maxPrice).toFixed(2))}
                        originalPrice={item.maxPrice}
                        discount={item.discount}
                    />
                </div>
            ))}
        </Carousel>
    );
}

export default ResponsiveCarousel;