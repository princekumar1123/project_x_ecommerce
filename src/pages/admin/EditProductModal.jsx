import { useState } from "react";
import { Modal, notification } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import axiosInstance from "../../api/axiosInstance";
import "./EditProductModal.css";

const CATEGORIES = ["Electronics", "Clothing", "Home Appliances", "Books", "Toys", "Beauty", "Sports", "Furniture", "Grocery"];

export default function EditProductModal({ product, onClose, onSave }) {
    const [api, ctx] = notification.useNotification();
    const [submitting, setSubmitting] = useState(false);
    const [colorInput, setColorInput] = useState("#000000");
    const [newImages, setNewImages] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);

    const [formData, setFormData] = useState({
        title: product.title || "",
        brand: product.brand || "",
        category: product.category || "",
        description: product.description || "",
        highlights: (product.highlights || []).join("\n"),
        maxPrice: product.maxPrice || "",
        discount: product.discount || "",
        quantity: product.quantity || "",
        stockStatus: product.stockStatus || "in_stock",
        offers: (product.offers || []).join(", "),
        sellerName: product.sellerName || "",
        colors: product.colors || [],
        image: product.image || [],
        warranty: product.warranty || "",
        returnPolicy: product.returnPolicy || "",
        deliveryInfo: product.deliveryInfo || "",
        countryOfOrigin: product.countryOfOrigin || "",
        inTheBox: product.inTheBox || "",
        weight: product.weight || "",
        dimensions: product.dimensions || "",
        tags: (product.tags || []).join(", "),
    });

    const handleChange = (e) => {
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
            setNewImages((prev) => [...prev, ...images]);
            setNewImagePreviews((prev) => [...prev, ...images]);
        });
    };

    const handleRemoveExistingImage = (index) => {
        setFormData((prev) => ({ ...prev, image: prev.image.filter((_, i) => i !== index) }));
    };

    const handleRemoveNewImage = (index) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
        setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const payload = {
            ...formData,
            maxPrice: Number(formData.maxPrice),
            discount: Number(formData.discount),
            quantity: Number(formData.quantity),
            offers: formData.offers.split(",").map((o) => o.trim()).filter(Boolean),
            highlights: formData.highlights.split("\n").map((h) => h.trim()).filter(Boolean),
            tags: formData.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
            image: [...formData.image, ...newImages],
        };
        try {
            await axiosInstance.put(`/ecommerce/updateproduct/${product._id}`, payload);
            api.open({ type: "success", message: "Product updated!", duration: 2 });
            setTimeout(() => { onSave(); }, 600);
        } catch (err) {
            const msg = err.response?.data?.error?.message || "Failed to update product.";
            api.open({ type: "error", message: msg, duration: 3 });
        } finally {
            setSubmitting(false);
        }
    };

    const finalPrice = formData.maxPrice && formData.discount
        ? Math.round(formData.maxPrice - (formData.discount / 100) * formData.maxPrice)
        : null;

    return (
        <Modal
            open={true}
            onCancel={onClose}
            footer={null}
            title={null}
            width={720}
            centered
            closable={false}
            styles={{ body: { padding: 0 } }}
        >
            {ctx}
            <div className="edit-modal-inner">
                <div className="edit-modal-header">
                    <h3>Edit Product</h3>
                    <button className="edit-modal-close" onClick={onClose} type="button">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="edit-modal-form">
                    <div className="edit-form-grid">
                        {/* Title */}
                        <div className="ef-field full">
                            <label className="ef-label">Product Title *</label>
                            <input className="ef-input" name="title" value={formData.title} onChange={handleChange} required />
                        </div>

                        {/* Brand + Category */}
                        <div className="ef-field">
                            <label className="ef-label">Brand</label>
                            <input className="ef-input" name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Samsung" />
                        </div>
                        <div className="ef-field">
                            <label className="ef-label">Category *</label>
                            <select className="ef-input" name="category" value={formData.category} onChange={handleChange} required>
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Seller + Stock */}
                        <div className="ef-field">
                            <label className="ef-label">Seller Name *</label>
                            <input className="ef-input" name="sellerName" value={formData.sellerName} onChange={handleChange} required />
                        </div>
                        <div className="ef-field">
                            <label className="ef-label">Stock Status</label>
                            <select className="ef-input" name="stockStatus" value={formData.stockStatus} onChange={handleChange}>
                                <option value="in_stock">In Stock</option>
                                <option value="out_of_stock">Out of Stock</option>
                                <option value="limited">Limited Stock</option>
                            </select>
                        </div>

                        {/* Price + Discount + Qty */}
                        <div className="ef-field">
                            <label className="ef-label">MRP (₹) *</label>
                            <input className="ef-input" type="number" name="maxPrice" value={formData.maxPrice} onChange={handleChange} min="0" required />
                        </div>
                        <div className="ef-field">
                            <label className="ef-label">Discount (%) *</label>
                            <input className="ef-input" type="number" name="discount" value={formData.discount} onChange={handleChange} min="0" max="100" required />
                            {finalPrice && <span className="ef-hint">Selling: ₹{finalPrice.toLocaleString("en-IN")}</span>}
                        </div>
                        <div className="ef-field">
                            <label className="ef-label">Quantity *</label>
                            <input className="ef-input" type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="0" required />
                        </div>

                        {/* Description */}
                        <div className="ef-field full">
                            <label className="ef-label">Description *</label>
                            <textarea className="ef-input ef-textarea" name="description" value={formData.description} onChange={handleChange} rows={3} required />
                        </div>

                        {/* Highlights */}
                        <div className="ef-field full">
                            <label className="ef-label">Key Highlights <span className="ef-hint-label">(one per line)</span></label>
                            <textarea className="ef-input ef-textarea" name="highlights" value={formData.highlights} onChange={handleChange} rows={3} placeholder={"6.8-inch display\n200MP camera"} />
                        </div>

                        {/* Offers */}
                        <div className="ef-field full">
                            <label className="ef-label">Offers <span className="ef-hint-label">(comma-separated)</span></label>
                            <input className="ef-input" name="offers" value={formData.offers} onChange={handleChange} placeholder="5% cashback, Free delivery" />
                        </div>

                        {/* Delivery & Returns */}
                        <div className="ef-field">
                            <label className="ef-label">Delivery Info</label>
                            <input className="ef-input" name="deliveryInfo" value={formData.deliveryInfo} onChange={handleChange} placeholder="Free delivery by Tomorrow" />
                        </div>
                        <div className="ef-field">
                            <label className="ef-label">Return Policy</label>
                            <input className="ef-input" name="returnPolicy" value={formData.returnPolicy} onChange={handleChange} placeholder="10 days returnable" />
                        </div>
                        <div className="ef-field">
                            <label className="ef-label">Warranty</label>
                            <input className="ef-input" name="warranty" value={formData.warranty} onChange={handleChange} placeholder="1 Year Manufacturer Warranty" />
                        </div>
                        <div className="ef-field">
                            <label className="ef-label">Country of Origin</label>
                            <input className="ef-input" name="countryOfOrigin" value={formData.countryOfOrigin} onChange={handleChange} placeholder="India" />
                        </div>
                        <div className="ef-field full">
                            <label className="ef-label">In The Box</label>
                            <input className="ef-input" name="inTheBox" value={formData.inTheBox} onChange={handleChange} placeholder="1 Phone, 1 Charger, 1 Cable" />
                        </div>
                        <div className="ef-field">
                            <label className="ef-label">Weight</label>
                            <input className="ef-input" name="weight" value={formData.weight} onChange={handleChange} placeholder="185g" />
                        </div>
                        <div className="ef-field">
                            <label className="ef-label">Dimensions</label>
                            <input className="ef-input" name="dimensions" value={formData.dimensions} onChange={handleChange} placeholder="163.3 × 78.1 × 8.9 mm" />
                        </div>
                        <div className="ef-field full">
                            <label className="ef-label">Search Tags <span className="ef-hint-label">(comma-separated)</span></label>
                            <input className="ef-input" name="tags" value={formData.tags} onChange={handleChange} placeholder="smartphone, 5g, samsung, android" />
                        </div>

                        {/* Colors */}
                        <div className="ef-field full">
                            <label className="ef-label">Color Variants</label>
                            <div className="ef-color-row">
                                <input type="color" className="ef-color-picker" value={colorInput} onChange={(e) => setColorInput(e.target.value)} />
                                <button type="button" className="ef-add-color-btn" onClick={handleColorAdd}>+ Add</button>
                                <div className="ef-color-swatches">
                                    {formData.colors.map((c, i) => (
                                        <div key={i} className="ef-color-swatch" style={{ backgroundColor: c }} onClick={() => handleColorRemove(c)} title="Click to remove" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="ef-field full">
                            <label className="ef-label">Product Images</label>
                            <div className="ef-images-grid">
                                {/* Existing images */}
                                {formData.image.map((img, i) => (
                                    <div key={`existing-${i}`} className="ef-img-item">
                                        <img src={img} alt={`img-${i}`} />
                                        <button type="button" className="ef-img-remove" onClick={() => handleRemoveExistingImage(i)}>×</button>
                                    </div>
                                ))}
                                {/* New images */}
                                {newImagePreviews.map((img, i) => (
                                    <div key={`new-${i}`} className="ef-img-item new">
                                        <img src={img} alt={`new-${i}`} />
                                        <button type="button" className="ef-img-remove" onClick={() => handleRemoveNewImage(i)}>×</button>
                                    </div>
                                ))}
                                {/* Upload button */}
                                <label className="ef-img-upload" htmlFor="edit-image-upload">
                                    <PictureOutlined />
                                    <span>Add</span>
                                    <input id="edit-image-upload" type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: "none" }} />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="edit-modal-footer">
                        <button type="button" className="ef-cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="ef-save-btn" disabled={submitting}>
                            {submitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
