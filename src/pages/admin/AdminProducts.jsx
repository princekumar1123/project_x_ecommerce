import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, notification } from "antd";
import {
    PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined,
    ExclamationCircleOutlined, FilterOutlined, ReloadOutlined,
    EyeOutlined, ArrowUpOutlined, ArrowDownOutlined
} from "@ant-design/icons";
import axiosInstance from "../../api/axiosInstance";
import EditProductModal from "./EditProductModal";
import "./AdminProducts.css";

const CATEGORIES = ["All", "Electronics", "Clothing", "Home Appliances", "Books", "Toys", "Beauty", "Sports", "Furniture", "Grocery"];
const STOCK_LABELS = { in_stock: "In Stock", out_of_stock: "Out of Stock", limited: "Limited" };
const STOCK_COLORS = { in_stock: "#2E7D32", out_of_stock: "#C62828", limited: "#E65100" };

export default function AdminProducts() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [category, setCategory] = useState("All");
    const [sortField, setSortField] = useState("createdAt");
    const [sortDir, setSortDir] = useState("desc");
    const [editProduct, setEditProduct] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [api, ctx] = notification.useNotification();

    const LIMIT = 10;

    const fetchProducts = useCallback(async (pg = page, q = search, cat = category, sf = sortField, sd = sortDir) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pg,
                limit: LIMIT,
                ...(q && { search: q }),
                ...(cat !== "All" && { category: cat }),
                sort: sf,
                order: sd,
            });
            const res = await axiosInstance.get(`/ecommerce/getproducts?${params}`);
            setProducts(res.data.products || []);
            setTotal(res.data.total || 0);
            setTotalPages(res.data.totalPages || 1);
        } catch (e) {
            api.open({ type: "error", message: "Failed to load products", duration: 3 });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts(page, search, category, sortField, sortDir);
    }, [page, search, category, sortField, sortDir]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput);
    };

    const handleCategoryChange = (cat) => {
        setCategory(cat);
        setPage(1);
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDir((d) => d === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDir("asc");
        }
        setPage(1);
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await axiosInstance.delete(`/ecommerce/deleteproduct/${deleteId}`);
            api.open({ type: "success", message: "Product deleted", duration: 2 });
            setDeleteId(null);
            fetchProducts(page, search, category, sortField, sortDir);
        } catch (e) {
            api.open({ type: "error", message: "Failed to delete product", duration: 3 });
        } finally {
            setDeleting(false);
        }
    };

    const handleEditSave = () => {
        setEditProduct(null);
        fetchProducts(page, search, category, sortField, sortDir);
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <span className="sort-icon neutral">↕</span>;
        return sortDir === "asc"
            ? <ArrowUpOutlined className="sort-icon active" />
            : <ArrowDownOutlined className="sort-icon active" />;
    };

    const finalPrice = (p) => Math.round(p.maxPrice - (p.discount / 100) * p.maxPrice);

    return (
        <div className="admin-products">
            {ctx}

            {/* Edit modal */}
            {editProduct && (
                <EditProductModal
                    product={editProduct}
                    onClose={() => setEditProduct(null)}
                    onSave={handleEditSave}
                />
            )}

            {/* Delete confirm modal */}
            <Modal
                open={!!deleteId}
                onCancel={() => setDeleteId(null)}
                onOk={handleDelete}
                okText="Delete"
                okButtonProps={{ danger: true, loading: deleting }}
                title={<span><ExclamationCircleOutlined style={{ color: "#F44336", marginRight: 8 }} />Delete Product</span>}
            >
                <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            </Modal>

            {/* Header */}
            <div className="ap-header">
                <div>
                    <h2 className="ap-title">Products</h2>
                    <p className="ap-subtitle">{total} product{total !== 1 ? "s" : ""} total</p>
                </div>
                <button className="ap-add-btn" onClick={() => navigate("/newproduct")}>
                    <PlusOutlined /> Add Product
                </button>
            </div>

            {/* Toolbar */}
            <div className="ap-toolbar">
                {/* Search */}
                <form className="ap-search" onSubmit={handleSearch}>
                    <input
                        className="ap-search-input"
                        type="text"
                        placeholder="Search by title, description..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button type="submit" className="ap-search-btn"><SearchOutlined /></button>
                    {search && (
                        <button type="button" className="ap-clear-btn" onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }}>✕</button>
                    )}
                </form>

                <button className="ap-refresh-btn" onClick={() => fetchProducts(page, search, category, sortField, sortDir)} title="Refresh">
                    <ReloadOutlined />
                </button>
            </div>

            {/* Category filter tabs */}
            <div className="ap-category-tabs">
                <FilterOutlined style={{ color: "#9E9E9E", marginRight: "0.5rem" }} />
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        className={`ap-cat-tab ${category === cat ? "active" : ""}`}
                        onClick={() => handleCategoryChange(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="ap-table-wrapper">
                <table className="ap-table">
                    <thead>
                        <tr>
                            <th style={{ width: 60 }}>Image</th>
                            <th className="sortable" onClick={() => handleSort("title")}>
                                Product <SortIcon field="title" />
                            </th>
                            <th className="sortable" onClick={() => handleSort("category")}>
                                Category <SortIcon field="category" />
                            </th>
                            <th className="sortable" onClick={() => handleSort("maxPrice")}>
                                Price <SortIcon field="maxPrice" />
                            </th>
                            <th className="sortable" onClick={() => handleSort("quantity")}>
                                Stock <SortIcon field="quantity" />
                            </th>
                            <th className="sortable" onClick={() => handleSort("rating")}>
                                Rating <SortIcon field="rating" />
                            </th>
                            <th className="sortable" onClick={() => handleSort("createdAt")}>
                                Added <SortIcon field="createdAt" />
                            </th>
                            <th style={{ width: 120 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="ap-skeleton-row">
                                    {Array.from({ length: 8 }).map((_, j) => (
                                        <td key={j}><div className="ap-skeleton" /></td>
                                    ))}
                                </tr>
                            ))
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="ap-empty">
                                    No products found.{" "}
                                    {(search || category !== "All") && (
                                        <button className="ap-link" onClick={() => { setSearch(""); setSearchInput(""); setCategory("All"); setPage(1); }}>
                                            Clear filters
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ) : (
                            products.map((p) => (
                                <tr key={p._id} className="ap-row">
                                    <td>
                                        <img
                                            src={p.image?.[0]}
                                            alt={p.title}
                                            className="ap-product-img"
                                            onClick={() => navigate("/detail", { state: { id: p._id } })}
                                        />
                                    </td>
                                    <td>
                                        <div className="ap-product-title">{p.title}</div>
                                        {p.brand && <div className="ap-product-brand">{p.brand}</div>}
                                        <div className="ap-product-seller">by {p.sellerName}</div>
                                    </td>
                                    <td>
                                        <span className="ap-category-badge">{p.category}</span>
                                    </td>
                                    <td>
                                        <div className="ap-price">₹{finalPrice(p).toLocaleString("en-IN")}</div>
                                        <div className="ap-mrp">₹{p.maxPrice.toLocaleString("en-IN")}</div>
                                        <div className="ap-discount">{p.discount}% off</div>
                                    </td>
                                    <td>
                                        <div className="ap-qty">{p.quantity}</div>
                                        {p.stockStatus && (
                                            <span className="ap-stock-badge" style={{ color: STOCK_COLORS[p.stockStatus] }}>
                                                {STOCK_LABELS[p.stockStatus]}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="ap-rating">
                                            ★ {p.rating > 0 ? p.rating.toFixed(1) : "—"}
                                        </div>
                                        <div className="ap-review-count">{p.reviewCount || 0} reviews</div>
                                    </td>
                                    <td className="ap-date">
                                        {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                    </td>
                                    <td>
                                        <div className="ap-actions">
                                            <button
                                                className="ap-action-btn view"
                                                onClick={() => navigate("/detail", { state: { id: p._id } })}
                                                title="View"
                                            >
                                                <EyeOutlined />
                                            </button>
                                            <button
                                                className="ap-action-btn edit"
                                                onClick={() => setEditProduct(p)}
                                                title="Edit"
                                            >
                                                <EditOutlined />
                                            </button>
                                            <button
                                                className="ap-action-btn delete"
                                                onClick={() => setDeleteId(p._id)}
                                                title="Delete"
                                            >
                                                <DeleteOutlined />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="ap-pagination">
                    <button className="ap-page-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>
                    <button className="ap-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                        .reduce((acc, p, i, arr) => {
                            if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                            acc.push(p);
                            return acc;
                        }, [])
                        .map((p, i) =>
                            p === "..." ? (
                                <span key={`ellipsis-${i}`} className="ap-page-ellipsis">…</span>
                            ) : (
                                <button
                                    key={p}
                                    className={`ap-page-btn ${page === p ? "active" : ""}`}
                                    onClick={() => setPage(p)}
                                >
                                    {p}
                                </button>
                            )
                        )}
                    <button className="ap-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
                    <button className="ap-page-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
                    <span className="ap-page-info">Page {page} of {totalPages}</span>
                </div>
            )}
        </div>
    );
}
