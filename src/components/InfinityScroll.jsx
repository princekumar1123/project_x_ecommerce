import React, { useState, useRef, useCallback } from "react";

const STATIC_DATA = Array.from({ length: 100 }, (_, index) => `Item ${index + 1}`);

const InfiniteScroll = () => {
    const [items, setItems] = useState(STATIC_DATA.slice(0, 20)); // Initially load the first 20 items
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Simulate fetching more data
    const fetchMoreData = () => {
        setIsFetching(true);
        setTimeout(() => {
            const newItems = STATIC_DATA.slice(items.length, items.length + 20); // Fetch the next 20 items
            setItems((prev) => [...prev, ...newItems]);
            if (items.length + newItems.length >= STATIC_DATA.length) {
                setHasMore(false); // No more data to fetch
            }
            setIsFetching(false);
        }, 1000);
    };

    // Reference to the observer
    const observer = useRef();

    // The callback function for the Intersection Observer
    const lastItemRef = useCallback(
        (node) => {
            if (isFetching) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    fetchMoreData();
                }
            });

            if (node) observer.current.observe(node);
        },
        [isFetching, hasMore]
    );

    return (
        <div>
            <h1>Infinite Scroll with Static Data</h1>
            <ul>
                {items.map((item, index) => {
                    if (index === items.length - 1) {
                        // Attach the observer to the last item
                        return (
                            <li key={index} ref={lastItemRef} style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                                {item}
                            </li>
                        );
                    }
                    return (
                        <li key={index} style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                            {item}
                        </li>
                    );
                })}
            </ul>
            {isFetching && <h4>Loading more items...</h4>}
            {!hasMore && <h4>No more items to load</h4>}
        </div>
    );
};

export default InfiniteScroll;
