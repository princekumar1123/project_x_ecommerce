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

import { useState } from 'react';
import '../Styles/NewProduct.css';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { PictureOutlined } from '@ant-design/icons';
import PageHeader from '../components/PageHeader';
import { toastSuccess, toastError } from '../utils/swal';

const CATEGORIES = ["Electronics", "Clothing", "Home Appliances", "Books", "Toys", "Beauty", "Sports", "Furniture", "Grocery"];

const AddProduct = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        brand: '',
        category: '',
        quantity: '',
        stockStatus: 'in_stock',
        offers: '',
        description: '',
        highlights: '',
        maxPrice: '',
        discount: '',
        image: [],
        sellerName: '',
        colors: [],
        // Amazon-style fields
        warranty: '',
        returnPolicy: '',
        deliveryInfo: '',
        countryOfOrigin: '',
        inTheBox: '',
        weight: '',
        dimensions: '',
        tags: '',
    });

    const [colorInput, setColorInput] = useState('#000000');
    const [imagePreview, setImagePreview] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleColorAdd = () => {
        if (colorInput && !formData.colors.includes(colorInput)) {
            setFormData((prev) => ({ ...prev, colors: [...prev.colors, colorInput] }));
        }
    };

    const handleColorRemove = (color) => {
        setFormData((prev) => ({ ...prev, colors: prev.colors.filter((c) => c !== color) }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const readers = files.map((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise((resolve) => { reader.onloadend = () => resolve(reader.result); });
        });
        Promise.all(readers).then((images) => {
            setFormData((prev) => ({ ...prev, image: [...prev.image, ...images] }));
            setImagePreview((prev) => [...prev, ...images]);
        });
    };

    const handleImageRemove = (index) => {
        setFormData((prev) => ({ ...prev, image: prev.image.filter((_, i) => i !== index) }));
        setImagePreview((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const payload = {
            ...formData,
            quantity: Number(formData.quantity),
            maxPrice: Number(formData.maxPrice),
            discount: Number(formData.discount),
            offers: formData.offers.split(',').map((o) => o.trim()).filter(Boolean),
            highlights: formData.highlights.split('\n').map((h) => h.trim()).filter(Boolean),
            tags: formData.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
        };
        try {
            await axiosInstance.post('/ecommerce/addproduct', payload);
            toastSuccess(`"${payload.title}" added successfully!`);
            setFormData({ title: '', brand: '', category: '', quantity: '', stockStatus: 'in_stock', offers: '', description: '', highlights: '', maxPrice: '', discount: '', image: [], sellerName: '', colors: [], warranty: '', returnPolicy: '', deliveryInfo: '', countryOfOrigin: '', inTheBox: '', weight: '', dimensions: '', tags: '' });
            setImagePreview([]);
            setTimeout(() => navigate('/'), 1500);
        } catch (error) {
            const msg = error.response?.data?.error?.message || error.response?.data?.errors?.[0]?.msg || 'Failed to add product.';
            toastError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="add-product-page">
            <PageHeader
                title="Add New Product"
                subtitle="Fill in the details below to list a new product in the store"
                backTo="/"
                backLabel="Back to Home"
            />

            <form className="product-form-card" onSubmit={handleSubmit}>

                {/* Basic Info */}
                <div className="form-section">
                    <p className="form-section-title">Basic Information</p>
                    <div className="form-grid">
                        <div className="pf-field full-width">
                            <label className="pf-label">Product Title *</label>
                            <input className="pf-input" type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Samsung Galaxy S24 Ultra 256GB" required />
                        </div>
                        <div className="pf-field">
                            <label className="pf-label">Brand *</label>
                            <input className="pf-input" type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="e.g. Samsung" required />
                        </div>
                        <div className="pf-field">
                            <label className="pf-label">Category *</label>
                            <select className="pf-select" name="category" value={formData.category} onChange={handleInputChange} required>
                                <option value="" disabled>Select category</option>
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="pf-field">
                            <label className="pf-label">Seller Name *</label>
                            <input className="pf-input" type="text" name="sellerName" value={formData.sellerName} onChange={handleInputChange} placeholder="e.g. TechStore India" required />
                        </div>
                        <div className="pf-field">
                            <label className="pf-label">Stock Status *</label>
                            <select className="pf-select" name="stockStatus" value={formData.stockStatus} onChange={handleInputChange} required>
                                <option value="in_stock">In Stock</option>
                                <option value="out_of_stock">Out of Stock</option>
                                <option value="limited">Limited Stock</option>
                            </select>
                        </div>
                        <div className="pf-field full-width">
                            <label className="pf-label">Description *</label>
                            <textarea className="pf-textarea" name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe the product — what it is, who it's for, key features..." required />
                        </div>
                        <div className="pf-field full-width">
                            <label className="pf-label">Key Highlights <span style={{fontWeight:400,color:'#BDBDBD'}}>(one per line — shown as bullet points)</span></label>
                            <textarea className="pf-textarea" name="highlights" value={formData.highlights} onChange={handleInputChange} placeholder={"6.8-inch Dynamic AMOLED display\n200MP camera with AI features\n5000mAh battery\nSnapdragon 8 Gen 3 processor"} rows={4} />
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <div className="form-section">
                    <p className="form-section-title">Pricing & Inventory</p>
                    <div className="form-grid">
                        <div className="pf-field">
                            <label className="pf-label">MRP (₹) *</label>
                            <input className="pf-input" type="number" name="maxPrice" value={formData.maxPrice} onChange={handleInputChange} placeholder="0" min="0" required />
                        </div>
                        <div className="pf-field">
                            <label className="pf-label">Discount (%) *</label>
                            <input className="pf-input" type="number" name="discount" value={formData.discount} onChange={handleInputChange} placeholder="0" min="0" max="100" required />
                            {formData.maxPrice && formData.discount ? (
                                <span style={{ fontSize: '0.78rem', color: '#2E7D32', marginTop: '0.2rem' }}>
                                    Selling price: ₹{Math.round(formData.maxPrice - (formData.discount / 100) * formData.maxPrice).toLocaleString('en-IN')}
                                </span>
                            ) : null}
                        </div>
                        <div className="pf-field">
                            <label className="pf-label">Stock Quantity *</label>
                            <input className="pf-input" type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="0" min="0" required />
                        </div>
                    </div>
                </div>

                {/* Offers */}
                <div className="form-section">
                    <p className="form-section-title">Bank Offers & Promotions</p>
                    <div className="pf-field">
                        <label className="pf-label">Offers <span style={{fontWeight:400,color:'#BDBDBD'}}>(comma-separated)</span></label>
                        <input className="pf-input" type="text" name="offers" value={formData.offers} onChange={handleInputChange} placeholder="5% cashback on HDFC card, Free delivery, Extra 10% off on first order" />
                    </div>
                </div>

                {/* Delivery & Returns */}
                <div className="form-section">
                    <p className="form-section-title">Delivery & Returns</p>
                    <div className="form-grid">
                        <div className="pf-field">
                            <label className="pf-label">Delivery Info</label>
                            <input className="pf-input" type="text" name="deliveryInfo" value={formData.deliveryInfo} onChange={handleInputChange} placeholder="e.g. Free delivery by Tomorrow" />
                        </div>
                        <div className="pf-field">
                            <label className="pf-label">Return Policy</label>
                            <input className="pf-input" type="text" name="returnPolicy" value={formData.returnPolicy} onChange={handleInputChange} placeholder="e.g. 10 days returnable" />
                        </div>
                        <div className="pf-field">
                            <label className="pf-label">Warranty</label>
                            <input className="pf-input" type="text" name="warranty" value={formData.warranty} onChange={handleInputChange} placeholder="e.g. 1 Year Manufacturer Warranty" />
                        </div>
                        <div className="pf-field">
                            <label className="pf-label">Country of Origin</label>
                            <input className="pf-input" type="text" name="countryOfOrigin" value={formData.countryOfOrigin} onChange={handleInputChange} placeholder="e.g. India" />
                        </div>
                    </div>
                </div>

                {/* Product Details */}
                <div className="form-section">
                    <p className="form-section-title">Product Details</p>
                    <div className="form-grid">
                        <div className="pf-field full-width">
                            <label className="pf-label">In The Box</label>
                            <input className="pf-input" type="text" name="inTheBox" value={formData.inTheBox} onChange={handleInputChange} placeholder="e.g. 1 Smartphone, 1 USB-C Cable, 1 SIM Ejector Pin, Documentation" />
                        </div>
                        <div className="pf-field">
                            <label className="pf-label">Weight</label>
                            <input className="pf-input" type="text" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="e.g. 185g" />
                        </div>
                        <div className="pf-field">
                            <label className="pf-label">Dimensions</label>
                            <input className="pf-input" type="text" name="dimensions" value={formData.dimensions} onChange={handleInputChange} placeholder="e.g. 163.3 × 78.1 × 8.9 mm" />
                        </div>
                        <div className="pf-field full-width">
                            <label className="pf-label">Search Tags <span style={{fontWeight:400,color:'#BDBDBD'}}>(comma-separated — helps customers find this product)</span></label>
                            <input className="pf-input" type="text" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="e.g. smartphone, 5g phone, samsung, android" />
                        </div>
                    </div>
                </div>

                {/* Colors */}
                <div className="form-section">
                    <p className="form-section-title">Color Variants <span style={{ fontWeight: 400, color: '#BDBDBD', textTransform: 'none', letterSpacing: 0, fontSize: '0.75rem' }}>(optional)</span></p>
                    <div className="color-picker-row">
                        <input type="color" className="color-picker-input" value={colorInput} onChange={(e) => setColorInput(e.target.value)} />
                        <button type="button" className="btn-add-color" onClick={handleColorAdd}>+ Add Color</button>
                    </div>
                    {formData.colors.length > 0 && (
                        <div className="color-swatches">
                            {formData.colors.map((color, i) => (
                                <div key={i} className="color-swatch" style={{ backgroundColor: color }} onClick={() => handleColorRemove(color)} title="Click to remove" />
                            ))}
                        </div>
                    )}
                </div>

                {/* Images */}
                <div className="form-section">
                    <p className="form-section-title">Product Images *</p>
                    <div className="image-upload-area">
                        <label className="image-upload-label" htmlFor="image-upload">
                            <PictureOutlined className="image-upload-icon" />
                            <span><strong>Click to upload</strong> or drag and drop</span>
                            <span style={{ fontSize: "0.8rem", color: "#BDBDBD" }}>PNG, JPG, WEBP up to 10MB each</span>
                        </label>
                        <input id="image-upload" type="file" accept="image/*" multiple onChange={handleImageUpload} />
                    </div>
                    {imagePreview.length > 0 && (
                        <div className="image-previews">
                            {imagePreview.map((img, i) => (
                                <div key={i} className="image-preview-item">
                                    <img src={img} alt={`Preview ${i + 1}`} />
                                    <button type="button" className="image-remove-btn" onClick={() => handleImageRemove(i)}>×</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit */}
                <div className="form-submit-row">
                    <button type="button" className="btn-cancel-product" onClick={() => navigate('/')}>Cancel</button>
                    <button type="submit" className="btn-submit-product" disabled={submitting}>
                        {submitting ? 'Adding Product...' : 'Add Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
