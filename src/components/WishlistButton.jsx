import { useDispatch, useSelector } from "react-redux";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { addToWishlistAsync, removeFromWishlistAsync } from "../store/wishlistSlice";
import { useState } from "react";

/**
 * Heart toggle button for adding/removing a product from the wishlist.
 *
 * Props:
 *   productId  – string  (required)
 *   onLoginRequired – () => void  – called when user is not authenticated
 *   size       – number  (icon font-size, default 18)
 *   style      – object  (extra inline styles for the button)
 */
export default function WishlistButton({ productId, onLoginRequired, size = 18, style = {} }) {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((s) => s.auth);
    const wishlistItems = useSelector((s) => s.wishlist.items);
    const isWishlisted = wishlistItems.some((p) => p._id === productId);
    const [busy, setBusy] = useState(false);

    const handleClick = async (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            onLoginRequired?.();
            return;
        }
        if (busy) return;
        setBusy(true);
        try {
            if (isWishlisted) {
                await dispatch(removeFromWishlistAsync(productId)).unwrap();
            } else {
                await dispatch(addToWishlistAsync(productId)).unwrap();
            }
        } finally {
            setBusy(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            disabled={busy}
            className="wishlist-btn-heart"
            style={{
                background: "rgba(255,255,255,0.92)",
                border: "none",
                borderRadius: "50%",
                width: size + 16,
                height: size + 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: busy ? "wait" : "pointer",
                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                transition: "transform 0.15s, background 0.15s",
                flexShrink: 0,
                ...style,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.15)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
            {isWishlisted ? (
                <HeartFilled
                    style={{ fontSize: size, display: "block" }}
                    className="wl-heart-icon wl-heart-filled"
                />
            ) : (
                <HeartOutlined
                    style={{ fontSize: size, display: "block" }}
                    className="wl-heart-icon wl-heart-outline"
                />
            )}
        </button>
    );
}
