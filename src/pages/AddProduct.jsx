// import React, { useState } from 'react';
// import NewProduct from '../Styles/NewProduct.css'
// import axios from 'axios'

// const AddProduct = () => {
//     const [formData, setFormData] = useState({
//         title: '',
//         quantity: '',
//         offers: '',
//         description: '',
//         maxPrice: '',
//         discount: '',
//         image: [],
//         rating: '',
//         review: '',
//         sellerName: '',
//         colors: [],
//     });

//     const [colorInput, setColorInput] = useState('');
//     const [imagePreview, setImagePreview] = useState([]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevState) => ({
//             ...prevState,
//             [name]: value,
//         }));
//     };

//     const handleColorAdd = () => {
//         if (colorInput && !formData.colors.includes(colorInput)) {
//             setFormData((prevState) => ({
//                 ...prevState,
//                 colors: [...prevState.colors, colorInput],
//             }));
//             setColorInput('');
//         }
//     };

//     const handleColorRemove = (color) => {
//         setFormData((prevState) => ({
//             ...prevState,
//             colors: prevState.colors.filter((c) => c !== color),
//         }));
//     };

//     const handleImageUpload = (e) => {
//         const files = Array.from(e.target.files);
//         const readers = files.map((file) => {
//             const reader = new FileReader();
//             reader.readAsDataURL(file);
//             return new Promise((resolve) => {
//                 reader.onloadend = () => resolve(reader.result);
//             });
//         });

//         Promise.all(readers).then((images) => {
//             setFormData((prevState) => ({
//                 ...prevState,
//                 image: [...prevState.image, ...images],
//             }));
//             setImagePreview((prevPreview) => [...prevPreview, ...images]);
//         });
//     };

//     const handleImageRemove = (index) => {
//         setFormData((prevState) => ({
//             ...prevState,
//             image: prevState.image.filter((_, i) => i !== index),
//         }));
//         setImagePreview((prevPreview) => prevPreview.filter((_, i) => i !== index));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const payload = {
//             title: formData.title,
//             quantity: Number(formData.quantity),
//             offers: formData.offers.split(',').map((offer) => offer.trim()),
//             description: formData.description,
//             maxPrice: Number(formData.maxPrice),
//             discount: Number(formData.discount),
//             image: formData.image,
//             rating: Number(formData.rating),
//             review: formData.review.split(',').map((review) => review.trim()),
//             sellerName: formData.sellerName,
//             colors: formData.colors,
//         };
//         console.log(payload);

//         axios({
//             method: 'post',
//             url: 'http://localhost:9000/ecommerce/addproduct',
//             data: payload, // you are sending body instead
//             headers: {
//                 // 'Authorization': `bearer ${token}`,
//                 'Content-Type': 'application/json'
//             },
//         })
//     };

//     return (
//         <div className="container">
//             <form className="form" onSubmit={handleSubmit}>
//                 <h2 className="title">Add New Product</h2>
//                 <div className="formResContainer">
//                     <div className="formResLeftContainer">
//                         <div className="field">
//                             <label htmlFor="title" className="label">Title:</label>
//                             <input
//                                 type="text"
//                                 id="title"
//                                 name="title"
//                                 value={formData.title}
//                                 onChange={handleInputChange}
//                                 required
//                                 className="input"
//                             />
//                         </div>
//                         <div className="field">
//                             <label htmlFor="quantity" className="label">Quantity:</label>
//                             <input
//                                 type="number"
//                                 id="quantity"
//                                 name="quantity"
//                                 value={formData.quantity}
//                                 onChange={handleInputChange}
//                                 required
//                                 className="input"
//                             />
//                         </div>
//                         <div className="field">
//                             <label htmlFor="offers" className="label">Offers (comma-separated):</label>
//                             <input
//                                 type="text"
//                                 id="offers"
//                                 name="offers"
//                                 value={formData.offers}
//                                 onChange={handleInputChange}
//                                 className="input"
//                             />
//                         </div>
//                         <div className="field">
//                             <label htmlFor="description" className="label">Description:</label>
//                             <textarea
//                                 id="description"
//                                 name="description"
//                                 value={formData.description}
//                                 onChange={handleInputChange}
//                                 required
//                                 className="textarea"
//                             />
//                         </div>
//                         <div className="field">
//                             <label htmlFor="rating" className="label">Rating (0-5):</label>
//                             <input
//                                 type="number"
//                                 id="rating"
//                                 name="rating"
//                                 value={formData.rating}
//                                 onChange={handleInputChange}
//                                 required
//                                 min="0"
//                                 max="5"
//                                 className="input"
//                             />
//                         </div>
//                         <div className="field">
//                             <label htmlFor="review" className="label">Reviews (comma-separated):</label>
//                             <input
//                                 type="text"
//                                 id="review"
//                                 name="review"
//                                 value={formData.review}
//                                 onChange={handleInputChange}
//                                 className="input"
//                             />
//                         </div>
//                     </div>
//                     <div className="formResLeftContainer">
//                         <div className="field">
//                             <label htmlFor="maxPrice" className="label">Max Price:</label>
//                             <input
//                                 type="number"
//                                 id="maxPrice"
//                                 name="maxPrice"
//                                 value={formData.maxPrice}
//                                 onChange={handleInputChange}
//                                 required
//                                 className="input"
//                             />
//                         </div>
//                         <div className="field">
//                             <label htmlFor="discount" className="label">Discount (%):</label>
//                             <input
//                                 type="number"
//                                 id="discount"
//                                 name="discount"
//                                 value={formData.discount}
//                                 onChange={handleInputChange}
//                                 required
//                                 className="input"
//                             />
//                         </div>
//                         <div className="field">
//                             <label htmlFor="sellerName" className="label">Seller Name:</label>
//                             <input
//                                 type="text"
//                                 id="sellerName"
//                                 name="sellerName"
//                                 value={formData.sellerName}
//                                 onChange={handleInputChange}
//                                 required
//                                 className="input"
//                             />
//                         </div>
//                         <div className="field">
//                             <label htmlFor="colors" className="label">Colors:</label>
//                             <div className="color-picker-container">
//                                 <input
//                                     type="color"
//                                     value={colorInput}
//                                     onChange={(e) => setColorInput(e.target.value)}
//                                     className="color-picker"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={handleColorAdd}
//                                     className="button"
//                                 >
//                                     Add Color
//                                 </button>
//                             </div>
//                             <div className="color-list">
//                                 {formData.colors.map((color, index) => (
//                                     <div
//                                         key={index}
//                                         className="color-item"
//                                         style={{ backgroundColor: color }}
//                                         onClick={() => handleColorRemove(color)}
//                                         title="Click to remove color"
//                                     />
//                                 ))}
//                             </div>
//                         </div>
//                         <div className="field">
//                             <label htmlFor="image" className="label">Images:</label>
//                             <input
//                                 type="file"
//                                 id="image"
//                                 accept="image/*"
//                                 multiple
//                                 onChange={handleImageUpload}
//                                 required
//                                 className="input"
//                             />
//                             <div className="image-preview">
//                                 {imagePreview.map((image, index) => (
//                                     <div className="preview-container">
//                                         <img src={image} alt={`Preview ${index + 1}`} className="preview-image" />
//                                         <button
//                                             type="button"
//                                             onClick={() => handleImageRemove(index)}
//                                             className="remove-image-button"
//                                         >
//                                             ×
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <button type="submit" className="button">Add Product</button>
//             </form>
//         </div>
//     );
// };

// export default AddProduct;

import React, { useState } from 'react';
import NewProduct from '../Styles/NewProduct.css';
import axios from 'axios';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        title: '',
        quantity: '',
        offers: '',
        description: '',
        maxPrice: '',
        discount: '',
        image: [],
        rating: '',
        review: '',
        sellerName: '',
        colors: [],
        category: '', // Added category field
    });

    const [colorInput, setColorInput] = useState('');
    const [imagePreview, setImagePreview] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleColorAdd = () => {
        if (colorInput && !formData.colors.includes(colorInput)) {
            setFormData((prevState) => ({
                ...prevState,
                colors: [...prevState.colors, colorInput],
            }));
            setColorInput('');
        }
    };

    const handleColorRemove = (color) => {
        setFormData((prevState) => ({
            ...prevState,
            colors: prevState.colors.filter((c) => c !== color),
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const readers = files.map((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result);
            });
        });

        Promise.all(readers).then((images) => {
            setFormData((prevState) => ({
                ...prevState,
                image: [...prevState.image, ...images],
            }));
            setImagePreview((prevPreview) => [...prevPreview, ...images]);
        });
    };

    const handleImageRemove = (index) => {
        setFormData((prevState) => ({
            ...prevState,
            image: prevState.image.filter((_, i) => i !== index),
        }));
        setImagePreview((prevPreview) => prevPreview.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            quantity: Number(formData.quantity),
            maxPrice: Number(formData.maxPrice),
            discount: Number(formData.discount),
            rating: Number(formData.rating),
            offers: formData.offers.split(',').map((offer) => offer.trim()),
            review: formData.review.split(',').map((review) => review.trim()),
        };

        console.log(payload);

     
        // axios.post('http://192.168.1.120:9000/ecommerce/addproduct', payload, {
            axios.post('https://d8a1-117-202-0-167.ngrok-free.app/ecommerce/addproduct', payload, {
            headers: { 'Content-Type': 'application/json' ,"ngrok-skip-browser-warning": "true"},
        });
    };

    return (
        <div className="container">
            <form className="form" onSubmit={handleSubmit}>
                <h2 className="title">Add New Product</h2>
                <div className="formResContainer">
                    <div className="formResLeftContainer">
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
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="category" className="label">Category:</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                                className="input"
                            >
                                <option value="" disabled>Select a category</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Home Appliances">Home Appliances</option>
                                <option value="Books">Books</option>
                                <option value="Toys">Toys</option>
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="quantity" className="label">Quantity:</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                required
                                className="input"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="offers" className="label">Offers (comma-separated):</label>
                            <input
                                type="text"
                                id="offers"
                                name="offers"
                                value={formData.offers}
                                onChange={handleInputChange}
                                className="input"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="description" className="label">Description:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                className="textarea"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="rating" className="label">Rating (0-5):</label>
                            <input
                                type="number"
                                id="rating"
                                name="rating"
                                value={formData.rating}
                                onChange={handleInputChange}
                                required
                                min="0"
                                max="5"
                                className="input"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="review" className="label">Reviews (comma-separated):</label>
                            <input
                                type="text"
                                id="review"
                                name="review"
                                value={formData.review}
                                onChange={handleInputChange}
                                className="input"
                            />
                        </div>
                    </div>
                    <div className="formResLeftContainer">
                        <div className="field">
                            <label htmlFor="maxPrice" className="label">Max Price:</label>
                            <input
                                type="number"
                                id="maxPrice"
                                name="maxPrice"
                                value={formData.maxPrice}
                                onChange={handleInputChange}
                                required
                                className="input"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="discount" className="label">Discount (%):</label>
                            <input
                                type="number"
                                id="discount"
                                name="discount"
                                value={formData.discount}
                                onChange={handleInputChange}
                                required
                                className="input"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="sellerName" className="label">Seller Name:</label>
                            <input
                                type="text"
                                id="sellerName"
                                name="sellerName"
                                value={formData.sellerName}
                                onChange={handleInputChange}
                                required
                                className="input"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="colors" className="label">Colors:</label>
                            <div className="color-picker-container">
                                <input
                                    type="color"
                                    value={colorInput}
                                    onChange={(e) => setColorInput(e.target.value)}
                                    className="color-picker"
                                />
                                <button
                                    type="button"
                                    onClick={handleColorAdd}
                                    className="button"
                                >
                                    Add Color
                                </button>
                            </div>
                            <div className="color-list">
                                {formData.colors.map((color, index) => (
                                    <div
                                        key={index}
                                        className="color-item"
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleColorRemove(color)}
                                        title="Click to remove color"
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="image" className="label">Images:</label>
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                required
                                className="input"
                            />
                            <div className="image-preview">
                                {imagePreview.map((image, index) => (
                                    <div className="preview-container" key={index}>
                                        <img src={image} alt={`Preview ${index + 1}`} className="preview-image" />
                                        <button
                                            type="button"
                                            onClick={() => handleImageRemove(index)}
                                            className="remove-image-button"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <button type="submit" className="button">Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;
