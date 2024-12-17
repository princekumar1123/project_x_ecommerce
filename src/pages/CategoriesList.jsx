import { useNavigate } from "react-router-dom";
import Card from "../components/Card";

function CategoriesList() {
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
        {
            title: 'Samsung 1.5ton split AC',
            description: 'It is used to cool your enviroinment',
            image: 'https://picsum.photos/200/300?random=5',
        },
        {
            title: 'Samsung 1.5ton split AC',
            description: 'It is used to cool your enviroinment',
            image: 'https://picsum.photos/200/300?random=5',
        },
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
        {
            title: 'Samsung 1.5ton split AC',
            description: 'It is used to cool your enviroinment',
            image: 'https://picsum.photos/200/300?random=5',
        },
        {
            title: 'Samsung 1.5ton split AC',
            description: 'It is used to cool your enviroinment',
            image: 'https://picsum.photos/200/300?random=5',
        },
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
        {
            title: 'Samsung 1.5ton split AC',
            description: 'It is used to cool your enviroinment',
            image: 'https://picsum.photos/200/300?random=5',
        },
        {
            title: 'Samsung 1.5ton split AC',
            description: 'It is used to cool your enviroinment',
            image: 'https://picsum.photos/200/300?random=5',
        },
    ];

    const navigate = useNavigate()
    return (
        <>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "2%", fontFamily: "cursive" }}>
                <h1>Electronic Appliances</h1>
            </div>
            <div style={{
                width: "100vw", display: "flex", justifyContent: "center", flexWrap: "wrap", padding: "0.6%"
            }}>
                {cards.map((card, index) => (
                    <div key={index} style={{ padding: '10px', display: "flex", justifyContent: "center" }} onClick={() => { navigate("/detail") }}>
                        <Card
                            title={card.title.length >= 20 ? card.title.slice(0, 19) + "..." : card.title}
                            description={card.description.length >= 30 ? card.description.slice(0, 29) + "..." : card.description}
                            image={card.image}
                        />
                    </div>
                ))}
            </div>
        </>
    )
}

export default CategoriesList