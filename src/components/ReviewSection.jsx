import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, notification } from "antd";
import { LikeOutlined, LikeFilled, EditOutlined, DeleteOutlined, CheckCircleFilled } from "@ant-design/icons";
import axiosInstance from "../api/axiosInstance";
import "./ReviewSection.css";

// ── Star renderer ─────────────────────────────────────────────────────────────
function Stars({ value, size = "md", interactive = false, onChange }) {
    const [hovered, setHovered] = useState(0);
    const sizes = { sm: "0.85rem", md: "1.1rem", lg: "1.4rem" };
    return (
        <div className="stars-row" style={{ fontSize: sizes[size] }}>
            {[1, 2, 3, 4, 5].map((i) => (
                <span
                    key={i}
                    className={`star-icon ${i <= (interactive ? hovered || value : value) ? "filled" : ""}`}
                    style={{ cursor: interactive ? "pointer" : "default" }}
                    onMouseEnter={() => interactive && setHovered(i)}
                    onMouseLeave={() => interactive && setHovered(0)}
                    onClick={() => interactive && onChange?.(i)}
                >
                    ★
                </span>
            ))}
        </div>
    );
}

// ── Rating bar (distribution) ─────────────────────────────────────────────────
function RatingBar({ label, count, total }) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="rating-bar-row">
            <span className="rating-bar-label">{label} ★</span>
            <div className="rating-bar-track">
                <div className="rating-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="rating-bar-count">{count}</span>
        </div>
    );
}

// ── Write/Edit review modal ───────────────────────────────────────────────────
function ReviewModal({ open, onClose, productId, existing, onSuccess }) {
    const [rating, setRating] = useState(existing?.rating || 0);
    const [hovered, setHovered] = useState(0);
    const [title, setTitle] = useState(existing?.title || "");
    const [text, setText] = useState(existing?.text || "");
    const [submitting, setSubmitting] = useState(false);
    const [api, ctx] = notification.useNotification();

    useEffect(() => {
        if (open) {
            setRating(existing?.rating || 0);
            setHovered(0);
            setTitle(existing?.title || "");
            setText(existing?.text || "");
        }
    }, [open, existing]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) { api.open({ type: "warning", message: "Please select a star rating", duration: 2 }); return; }
        setSubmitting(true);
        try {
            if (existing) {
                await axiosInstance.put(`/reviews/${existing._id}`, { rating, title, text });
                api.open({ type: "success", message: "Review updated!", duration: 2 });
            } else {
                await axiosInstance.post("/reviews", { productId, rating, title, text });
                api.open({ type: "success", message: "Review submitted!", duration: 2 });
            }
            setTimeout(() => { onSuccess?.(); onClose(); }, 800);
        } catch (err) {
            const msg = err.response?.data?.error?.message || "Failed to submit review.";
            api.open({ type: "error", message: msg, duration: 3 });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            title={null}
            width={480}
            centered
            closable={false}
            styles={{ body: { padding: 0 } }}
        >
            {ctx}
            <div className="review-modal-inner">
                {/* Header */}
                <div className="review-modal-header">
                    <h3 className="review-modal-title">
                        {existing ? "Edit Your Review" : "Write a Review"}
                    </h3>
                    <button className="review-modal-close" onClick={onClose} type="button">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="review-form">
                    {/* Star rating */}
                    <div className="review-form-field">
                        <label className="review-form-label">Overall Rating *</label>
                        <div className="review-form-stars">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <span
                                    key={i}
                                    className={`review-form-star ${i <= (hovered || rating) ? "filled" : ""}`}
                                    onMouseEnter={() => setHovered(i)}
                                    onMouseLeave={() => setHovered(0)}
                                    onClick={() => setRating(i)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <span className="review-rating-hint">
                            {hovered
                                ? ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][hovered]
                                : rating
                                ? ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]
                                : "Click a star to rate"}
                        </span>
                    </div>

                    {/* Title */}
                    <div className="review-form-field">
                        <label className="review-form-label">Review Title *</label>
                        <input
                            className="review-form-input"
                            type="text"
                            placeholder="Summarize your experience"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={120}
                            required
                        />
                    </div>

                    {/* Body */}
                    <div className="review-form-field">
                        <label className="review-form-label">Your Review *</label>
                        <textarea
                            className="review-form-textarea"
                            placeholder="What did you like or dislike? How was the quality?"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            maxLength={2000}
                            required
                            rows={4}
                        />
                        <span className="review-char-count">{text.length}/2000</span>
                    </div>

                    {/* Footer */}
                    <div className="review-modal-footer">
                        <button type="button" className="review-cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="review-submit-btn" type="submit" disabled={submitting}>
                            {submitting ? "Submitting..." : existing ? "Update Review" : "Submit Review"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

// ── Single review card ────────────────────────────────────────────────────────
function ReviewCard({ review, currentUserId, onEdit, onDelete, onHelpful }) {
    const isOwn = review.userId === currentUserId || review.userId?._id === currentUserId;
    const date = new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

    return (
        <div className="review-card">
            <div className="review-card-header">
                <div className="review-avatar">{review.userName?.[0]?.toUpperCase() || "U"}</div>
                <div className="review-meta">
                    <span className="review-author">{review.userName}</span>
                    {review.verifiedPurchase && (
                        <span className="verified-badge">
                            <CheckCircleFilled /> Verified Purchase
                        </span>
                    )}
                </div>
                <span className="review-date">{date}</span>
            </div>

            <div className="review-card-body">
                <div className="review-rating-title">
                    <Stars value={review.rating} size="sm" />
                    <span className="review-title">{review.title}</span>
                </div>
                <p className="review-text">{review.text}</p>
            </div>

            <div className="review-card-footer">
                <button
                    className={`helpful-btn ${review.userVoted ? "voted" : ""}`}
                    onClick={() => onHelpful(review._id)}
                >
                    {review.userVoted ? <LikeFilled /> : <LikeOutlined />}
                    Helpful ({review.helpful})
                </button>
                {isOwn && (
                    <div className="review-own-actions">
                        <button className="review-edit-btn" onClick={() => onEdit(review)}>
                            <EditOutlined /> Edit
                        </button>
                        <button className="review-delete-btn" onClick={() => onDelete(review._id)}>
                            <DeleteOutlined /> Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Main ReviewSection ────────────────────────────────────────────────────────
export default function ReviewSection({ productId, productRating, reviewCount, onReviewChange }) {
    const { isAuthenticated, userId } = useSelector((s) => s.auth);
    const [reviews, setReviews] = useState([]);
    const [total, setTotal] = useState(reviewCount || 0);
    const [liveRating, setLiveRating] = useState(productRating || 0);
    const [dist, setDist] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [canReview, setCanReview] = useState(false);
    const [alreadyReviewed, setAlreadyReviewed] = useState(false);
    const [existingReview, setExistingReview] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [api, ctx] = notification.useNotification();

    const fetchReviews = async (pg = 1, srt = sort) => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/reviews/product/${productId}?sort=${srt}&page=${pg}&limit=5`);
            setReviews(res.data.reviews);
            setTotal(res.data.total);
            setTotalPages(res.data.totalPages);
            setDist(res.data.ratingDistribution);

            // Compute live average from distribution
            const d = res.data.ratingDistribution;
            const t = res.data.total;
            if (t > 0) {
                const weightedSum = [1, 2, 3, 4, 5].reduce((sum, star) => sum + star * (d[star] || 0), 0);
                setLiveRating(Math.round((weightedSum / t) * 10) / 10);
            } else {
                setLiveRating(0);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchCanReview = async () => {
        if (!isAuthenticated) return;
        try {
            const res = await axiosInstance.get(`/reviews/can-review/${productId}`);
            setCanReview(res.data.canReview);
            setAlreadyReviewed(res.data.alreadyReviewed);
            setExistingReview(res.data.existingReview);
        } catch (e) { /* silent */ }
    };

    useEffect(() => {
        fetchReviews(1, sort);
        fetchCanReview();
    }, [productId, isAuthenticated]);

    const handleSort = (s) => {
        setSort(s);
        setPage(1);
        fetchReviews(1, s);
    };

    const handlePage = (p) => {
        setPage(p);
        fetchReviews(p, sort);
        document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
    };

    const handleHelpful = async (reviewId) => {
        if (!isAuthenticated) { api.open({ type: "info", message: "Please login to vote", duration: 2 }); return; }
        try {
            const res = await axiosInstance.post(`/reviews/${reviewId}/helpful`);
            setReviews((prev) => prev.map((r) =>
                r._id === reviewId ? { ...r, helpful: res.data.helpful, userVoted: res.data.voted } : r
            ));
        } catch (e) { /* silent */ }
    };

    const handleDelete = async (reviewId) => {
        try {
            await axiosInstance.delete(`/reviews/${reviewId}`);
            api.open({ type: "success", message: "Review deleted", duration: 2 });
            fetchReviews(1, sort);
            fetchCanReview();
            onReviewChange?.();
        } catch (e) {
            api.open({ type: "error", message: "Failed to delete review", duration: 3 });
        }
    };

    const handleEdit = (review) => {
        setEditTarget(review);
        setModalOpen(true);
    };

    const handleWriteReview = () => {
        setEditTarget(null);
        setModalOpen(true);
    };

    const avgRating = liveRating;

    return (
        <div className="review-section" id="reviews-section">
            {ctx}
            <ReviewModal
                open={modalOpen}
                onClose={() => { setModalOpen(false); setEditTarget(null); }}
                productId={productId}
                existing={editTarget || (alreadyReviewed ? existingReview : null)}
                onSuccess={() => { fetchReviews(1, sort); fetchCanReview(); onReviewChange?.(); }}
            />

            <h2 className="review-section-title">Customer Reviews</h2>

            {/* Summary */}
            <div className="review-summary">
                <div className="review-summary-left">
                    <div className="review-avg-score">{avgRating.toFixed(1)}</div>
                    <Stars value={Math.round(avgRating)} size="lg" />
                    <div className="review-total-count">{total} review{total !== 1 ? "s" : ""}</div>
                </div>
                <div className="review-summary-right">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <RatingBar key={star} label={star} count={dist[star] || 0} total={total} />
                    ))}
                </div>
            </div>

            {/* Write review CTA */}
            {isAuthenticated ? (
                <div className="review-cta">
                    {alreadyReviewed ? (
                        <div className="review-cta-done">
                            <CheckCircleFilled style={{ color: "#4CAF50" }} />
                            <span>You've reviewed this product.</span>
                            <button className="review-edit-cta-btn" onClick={() => handleEdit(existingReview)}>
                                <EditOutlined /> Edit Review
                            </button>
                        </div>
                    ) : (
                        <div className="review-cta-write">
                            <p>Share your thoughts with other customers</p>
                            <button className="review-write-btn" onClick={handleWriteReview}>
                                Write a Review
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="review-cta review-cta-login">
                    <p>Please <strong>login</strong> to write a review</p>
                </div>
            )}

            {/* Sort controls */}
            {total > 0 && (
                <div className="review-controls">
                    <span className="review-controls-label">Sort by:</span>
                    {["newest", "helpful", "highest", "lowest"].map((s) => (
                        <button
                            key={s}
                            className={`review-sort-btn ${sort === s ? "active" : ""}`}
                            onClick={() => handleSort(s)}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            )}

            {/* Review list */}
            {loading ? (
                <div className="review-loading">Loading reviews...</div>
            ) : reviews.length === 0 ? (
                <div className="review-empty">
                    <p>No reviews yet. Be the first to review this product!</p>
                </div>
            ) : (
                <>
                    {reviews.map((review) => (
                        <ReviewCard
                            key={review._id}
                            review={review}
                            currentUserId={userId}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onHelpful={handleHelpful}
                        />
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="review-pagination">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    className={`review-page-btn ${page === p ? "active" : ""}`}
                                    onClick={() => handlePage(p)}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
