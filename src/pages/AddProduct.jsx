import React, { useState } from 'react';
import NewProduct from '../Styles/NewProduct.css'

const AddProduct = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        qty: '',
        price: '',
        discountPercentage: '',
        offers: '',
        image: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prevState) => ({
                    ...prevState,
                    image: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="container">
            <form className="form" onSubmit={handleSubmit}>
                <h2 className="title">Add New Product</h2>
                <div className='formResContainer' >
                    <div className='formResLeftContainer'>
                        <div className="field">
                            <label htmlFor="title" className="label">Title:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="input"
                                aria-label="Product Title"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="qty" className="label">Quantity:</label>
                            <input
                                type="number"
                                id="qty"
                                name="qty"
                                value={formData.qty}
                                onChange={handleInputChange}
                                required
                                className="input"
                                aria-label="Product Quantity"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="offers" className="label">Offers:</label>
                            <input
                                type="text"
                                id="offers"
                                name="offers"
                                value={formData.offers}
                                onChange={handleInputChange}
                                required
                                className="input"
                                aria-label="Product Offers"
                            />
                        </div>
                    </div>
                    <div className='formResLeftContainer' >
                        <div className="field">
                            <label htmlFor="price" className="label">Price:</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                className="input"
                                aria-label="Product Price"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="discountPercentage" className="label">Discount in %:</label>
                            <input
                                type="number"
                                id="discountPercentage"
                                name="discountPercentage"
                                value={formData.discountPercentage}
                                onChange={handleInputChange}
                                required
                                className="input"
                                aria-label="Product Discount Percentage"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="image" className="label">Image:</label>
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageUpload}
                                required
                                className="input"
                                aria-label="Upload Product Image"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <div className="field">
                        <label htmlFor="description" className="label">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            className="textarea"
                            aria-label="Product Description"
                        />
                    </div>
                </div>
                <button type="submit" className="button">Add</button>
            </form>
        </div>
    );
};

export default AddProduct;
