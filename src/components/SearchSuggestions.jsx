import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SearchOutlined, TagOutlined } from "@ant-design/icons";
import axiosInstance from "../api/axiosInstance";

/**
 * Dropdown search suggestions.
 *
 * Props:
 *   query      – current search input string
 *   onSelect   – (product) => void  – called when user clicks a suggestion
 *   onClose    – () => void         – called when dropdown should close
 *   visible    – boolean
 */
export default function SearchSuggestions({ query, onSelect, onClose, visible }) {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeIdx, setActiveIdx] = useState(-1);
    const navigate = useNavigate();
    const debounceRef = useRef(null);
    const listRef = useRef(null);

    // Debounced fetch
    useEffect(() => {
        if (!visible || !query.trim()) {
            setSuggestions([]);
            setActiveIdx(-1);
            return;
        }

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(
                    `/ecommerce/search/suggestions?q=${encodeURIComponent(query.trim())}`
                );
                setSuggestions(res.data.suggestions || []);
                setActiveIdx(-1);
            } catch {
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 280);

        return () => clearTimeout(debounceRef.current);
    }, [query, visible]);

    // Keyboard navigation — parent passes keydown events via onKeyDown prop
    const handleKeyDown = useCallback(
        (e) => {
            if (!visible || suggestions.length === 0) return;
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIdx((i) => Math.max(i - 1, -1));
            } else if (e.key === "Enter" && activeIdx >= 0) {
                e.preventDefault();
                const p = suggestions[activeIdx];
                navigate("/detail", { state: { id: p._id } });
                onSelect?.(p);
                onClose?.();
            } else if (e.key === "Escape") {
                onClose?.();
            }
        },
        [visible, suggestions, activeIdx, navigate, onSelect, onClose]
    );

    // Expose keyboard handler via ref so parent can call it
    useEffect(() => {
        if (listRef.current) {
            listRef.current._handleKeyDown = handleKeyDown;
        }
    }, [handleKeyDown]);

    if (!visible || (!loading && suggestions.length === 0 && query.trim())) return null;
    if (!visible) return null;

    return (
        <div
            style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                right: 0,
                background: "#fff",
                borderRadius: "0 0 10px 10px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                zIndex: 9999,
                overflow: "hidden",
                maxHeight: 360,
                overflowY: "auto",
            }}
            ref={listRef}
        >
            {loading ? (
                <div style={{ padding: "0.75rem 1rem", color: "#9E9E9E", fontSize: "0.875rem" }}>
                    Searching…
                </div>
            ) : suggestions.length === 0 ? (
                <div style={{ padding: "0.75rem 1rem", color: "#9E9E9E", fontSize: "0.875rem" }}>
                    No results for "{query}"
                </div>
            ) : (
                suggestions.map((p, i) => {
                    const finalPrice = Math.round(p.maxPrice - (p.discount / 100) * p.maxPrice);
                    const isActive = i === activeIdx;
                    return (
                        <div
                            key={p._id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                padding: "0.6rem 1rem",
                                cursor: "pointer",
                                background: isActive ? "#E3F2FD" : "transparent",
                                borderBottom: "1px solid #F5F5F5",
                                transition: "background 0.1s",
                            }}
                            onMouseEnter={() => setActiveIdx(i)}
                            onMouseLeave={() => setActiveIdx(-1)}
                            onClick={() => {
                                navigate("/detail", { state: { id: p._id } });
                                onSelect?.(p);
                                onClose?.();
                            }}
                        >
                            {/* Thumbnail */}
                            <img
                                src={p.image?.[0]}
                                alt={p.title}
                                style={{
                                    width: 40,
                                    height: 40,
                                    objectFit: "contain",
                                    borderRadius: 6,
                                    background: "#FAFAFA",
                                    flexShrink: 0,
                                    border: "1px solid #F0F0F0",
                                }}
                            />

                            {/* Text */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                    margin: 0,
                                    fontSize: "0.875rem",
                                    fontWeight: 600,
                                    color: "#212121",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}>
                                    {p.title}
                                </p>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.1rem" }}>
                                    <span style={{ fontSize: "0.75rem", color: "#1976D2", display: "flex", alignItems: "center", gap: 2 }}>
                                        <TagOutlined style={{ fontSize: 10 }} /> {p.category}
                                    </span>
                                    <span style={{ fontSize: "0.75rem", color: "#9E9E9E" }}>·</span>
                                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#212121" }}>
                                        ₹{finalPrice.toLocaleString("en-IN")}
                                    </span>
                                </div>
                            </div>

                            <SearchOutlined style={{ color: "#BDBDBD", fontSize: 14, flexShrink: 0 }} />
                        </div>
                    );
                })
            )}
        </div>
    );
}
