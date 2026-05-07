import { useEffect, useState, useCallback } from "react";
import {
    SearchOutlined, ReloadOutlined, EyeOutlined,
    DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined,
    CloseOutlined, UserOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../api/axiosInstance";
import { toastSuccess, toastError, confirmDanger, confirmAction } from "../../utils/swal";
import "./AdminUsers.css";

const ROLE_TABS = ["All", "user", "admin"];
const LIMIT = 10;

// ── Small helpers ─────────────────────────────────────────────────────────────

function Avatar({ name }) {
    const letter = name ? name.charAt(0).toUpperCase() : "?";
    return <div className="au-avatar">{letter}</div>;
}

function RoleBadge({ role }) {
    return (
        <span className={`au-role-badge ${role}`}>
            {role === "admin" ? "Admin" : "User"}
        </span>
    );
}

function SkeletonRows({ count = LIMIT }) {
    return Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="au-skeleton-row">
            <td><div className="au-skeleton" style={{ width: "60%" }} /></td>
            <td><div className="au-skeleton" style={{ width: "80%" }} /></td>
            <td><div className="au-skeleton" style={{ width: "55%" }} /></td>
            <td><div className="au-skeleton" style={{ width: "40%" }} /></td>
            <td><div className="au-skeleton" style={{ width: "35%" }} /></td>
            <td><div className="au-skeleton" style={{ width: "50%" }} /></td>
            <td><div className="au-skeleton" style={{ width: "60%" }} /></td>
        </tr>
    ));
}

function Pagination({ page, totalPages, total, onPage }) {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || i === totalPages ||
            (i >= page - 1 && i <= page + 1)
        ) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== "...") {
            pages.push("...");
        }
    }

    return (
        <div className="au-pagination">
            <button
                className="au-page-btn"
                disabled={page === 1}
                onClick={() => onPage(page - 1)}
            >
                ‹
            </button>
            {pages.map((p, i) =>
                p === "..." ? (
                    <span key={`e${i}`} className="au-page-ellipsis">…</span>
                ) : (
                    <button
                        key={p}
                        className={`au-page-btn ${p === page ? "active" : ""}`}
                        onClick={() => onPage(p)}
                    >
                        {p}
                    </button>
                )
            )}
            <button
                className="au-page-btn"
                disabled={page === totalPages}
                onClick={() => onPage(page + 1)}
            >
                ›
            </button>
            <span className="au-page-info">{total} total</span>
        </div>
    );
}

// ── View modal ────────────────────────────────────────────────────────────────

function ViewUserModal({ user, onClose }) {
    if (!user) return null;

    const rows = [
        { label: "Name",    value: user.name },
        { label: "Email",   value: user.email },
        { label: "Mobile",  value: user.mobile || "—" },
        { label: "Gender",  value: user.gender || "—" },
        { label: "Role",    value: <RoleBadge role={user.role || "user"} /> },
        { label: "Orders",  value: user.orders?.length ?? 0 },
        { label: "Joined",  value: user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—" },
    ];

    return (
        <div className="au-modal-overlay" onClick={onClose}>
            <div className="au-modal" onClick={(e) => e.stopPropagation()}>
                <div className="au-modal-header">
                    <h3 className="au-modal-title">User Details</h3>
                    <button className="au-modal-close" onClick={onClose}><CloseOutlined /></button>
                </div>
                <div className="au-modal-body">
                    <div className="au-modal-avatar">
                        {user.name ? user.name.charAt(0).toUpperCase() : <UserOutlined />}
                    </div>
                    {rows.map(({ label, value }) => (
                        <div key={label} className="au-detail-row">
                            <span className="au-detail-label">{label}</span>
                            <span className="au-detail-value">{value}</span>
                        </div>
                    ))}
                </div>
                <div className="au-modal-footer">
                    <button className="au-modal-footer-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminUsers() {
    const [users, setUsers]           = useState([]);
    const [total, setTotal]           = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage]             = useState(1);
    const [loading, setLoading]       = useState(true);
    const [search, setSearch]         = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [viewUser, setViewUser]     = useState(null);
    const [acting, setActing]         = useState(false);

    const fetchUsers = useCallback(async (pg = 1, q = "", role = "All") => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pg,
                limit: LIMIT,
                ...(q && { search: q }),
                ...(role !== "All" && { role }),
            });
            const res = await axiosInstance.get(`/user/getAllUsers?${params}`);
            setUsers(res.data.users || []);
            setTotal(res.data.total || 0);
            setTotalPages(res.data.totalPages || 1);
        } catch {
            toastError("Failed to load users");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers(page, search, roleFilter);
    }, [page, search, roleFilter, fetchUsers]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput);
    };

    const handleRoleFilter = (role) => {
        setRoleFilter(role);
        setPage(1);
    };

    const handleRefresh = () => {
        setSearchInput("");
        setSearch("");
        setRoleFilter("All");
        setPage(1);
        fetchUsers(1, "", "All");
    };

    // ── Delete ────────────────────────────────────────────────────────────────

    const confirmDelete = async (user) => {
        const ok = await confirmDanger({
            title: "Delete User",
            text: `Permanently delete "${user.name}"? This cannot be undone.`,
            confirmText: "Delete",
        });
        if (!ok) return;
        setActing(true);
        try {
            await axiosInstance.delete(`/user/deleteAUserById/${user._id}`);
            toastSuccess("User deleted successfully");
            fetchUsers(page, search, roleFilter);
        } catch {
            toastError("Failed to delete user");
        } finally {
            setActing(false);
        }
    };

    // ── Role change ───────────────────────────────────────────────────────────

    const confirmRoleChange = async (user, newRole) => {
        const isPromote = newRole === "admin";
        const ok = await confirmAction({
            title: isPromote ? "Promote to Admin" : "Demote to User",
            text: isPromote
                ? `Grant admin privileges to "${user.name}"?`
                : `Remove admin privileges from "${user.name}"?`,
            confirmText: isPromote ? "Promote" : "Demote",
            icon: isPromote ? "question" : "warning",
        });
        if (!ok) return;
        setActing(true);
        try {
            await axiosInstance.put(`/user/updateAUserById/${user._id}`, { role: newRole });
            toastSuccess(`Role updated to ${newRole}`);
            fetchUsers(page, search, roleFilter);
        } catch {
            toastError("Failed to update role");
        } finally {
            setActing(false);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="admin-users">
            {/* Header */}
            <div className="au-header">
                <div>
                    <h2 className="au-title">Registered Users</h2>
                    <p className="au-subtitle">{total} user{total !== 1 ? "s" : ""} registered</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="au-toolbar">
                <form className="au-search" onSubmit={handleSearch}>
                    <input
                        className="au-search-input"
                        placeholder="Search by name, email or mobile…"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    {searchInput && (
                        <button
                            type="button"
                            className="au-clear-btn"
                            onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }}
                        >
                            <CloseOutlined />
                        </button>
                    )}
                    <button type="submit" className="au-search-btn">
                        <SearchOutlined />
                    </button>
                </form>
                <button className="au-refresh-btn" onClick={handleRefresh} title="Reset filters">
                    <ReloadOutlined />
                </button>
            </div>

            {/* Role filter tabs */}
            <div className="au-role-tabs">
                {ROLE_TABS.map((r) => (
                    <button
                        key={r}
                        className={`au-role-tab ${roleFilter === r ? "active" : ""}`}
                        onClick={() => handleRoleFilter(r)}
                    >
                        {r === "All" ? "All Roles" : r === "admin" ? "Admins" : "Users"}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="au-table-wrapper">
                <table className="au-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Gender</th>
                            <th>Role</th>
                            <th>Orders</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <SkeletonRows count={LIMIT} />
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="au-empty">
                                    No users found.{" "}
                                    {(search || roleFilter !== "All") && (
                                        <button className="au-clear-btn" onClick={handleRefresh}>
                                            Clear filters
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user._id} className="au-row">
                                    <td>
                                        <div className="au-user-cell">
                                            <Avatar name={user.name} />
                                            <div>
                                                <div className="au-user-name">{user.name}</div>
                                                {user.gender && (
                                                    <div className="au-user-gender">
                                                        {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{user.mobile || "—"}</td>
                                    <td>{user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "—"}</td>
                                    <td><RoleBadge role={user.role || "user"} /></td>
                                    <td className="au-orders">{user.orders?.length ?? 0}</td>
                                    <td className="au-date">
                                        {user.createdAt
                                            ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                                                day: "2-digit", month: "short", year: "numeric",
                                              })
                                            : "—"}
                                    </td>
                                    <td>
                                        <div className="au-actions">
                                            <button
                                                className="au-action-btn view"
                                                title="View details"
                                                onClick={() => setViewUser(user)}
                                            >
                                                <EyeOutlined />
                                            </button>
                                            {user.role !== "admin" ? (
                                                <button
                                                    className="au-action-btn promote"
                                                    title="Promote to admin"
                                                    disabled={acting}
                                                    onClick={() => confirmRoleChange(user, "admin")}
                                                >
                                                    <ArrowUpOutlined />
                                                </button>
                                            ) : (
                                                <button
                                                    className="au-action-btn demote"
                                                    title="Demote to user"
                                                    disabled={acting}
                                                    onClick={() => confirmRoleChange(user, "user")}
                                                >
                                                    <ArrowDownOutlined />
                                                </button>
                                            )}
                                            <button
                                                className="au-action-btn delete"
                                                title="Delete user"
                                                disabled={acting}
                                                onClick={() => confirmDelete(user)}
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
            <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                onPage={(p) => setPage(p)}
            />

            {/* Modals */}
            <ViewUserModal user={viewUser} onClose={() => setViewUser(null)} />
        </div>
    );
}
