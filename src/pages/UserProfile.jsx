import { useEffect, useState } from "react";
import { Spin } from "antd";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";
import PageHeader from "../components/PageHeader";
import AddressManager from "./AddressManager";
import { toastSuccess, toastError } from "../utils/swal";
import "./AddressManager.css";

function UserProfile() {
    const { userName } = useSelector((state) => state.auth);
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("Profile");
    const [formData, setFormData] = useState({ name: "", gender: "", mobile: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        axiosInstance
            .get("/user/profile")
            .then((res) => {
                setProfile(res.data.user);
                setFormData({
                    name: res.data.user.name || "",
                    gender: res.data.user.gender || "",
                    mobile: res.data.user.mobile || "",
                });
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await axiosInstance.put("/user/profile", formData);
            setProfile(res.data.user);
            setEditing(false);
            toastSuccess("Profile updated!");
        } catch (err) {
            const msg = err.response?.data?.error?.message || "Failed to update profile.";
            toastError(msg);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <Spin size="large" />
            </div>
        );
    }

    const fieldStyle = { width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "1rem", marginTop: "4px" };
    const labelStyle = { fontWeight: "500", color: "#555", fontSize: "0.9rem" };

    return (
        <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "0 1rem 3rem" }}>
            <PageHeader
                title="My Account"
                subtitle="Manage your profile and addresses"
                backTo="/"
                backLabel="Back to Home"
            />

            {/* Tabs */}
            <div style={{ display: "flex", marginBottom: "1.25rem", background: "#fff", borderRadius: "10px", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                {["Profile", "Addresses"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            flex: 1, padding: "0.75rem", border: "none", background: "none",
                            fontWeight: 600, fontSize: "0.875rem", cursor: "pointer",
                            borderBottom: `3px solid ${activeTab === tab ? "#1976D2" : "transparent"}`,
                            color: activeTab === tab ? "#1976D2" : "#9E9E9E",
                            transition: "all 0.15s",
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Profile tab */}
            {activeTab === "Profile" && (
                <div style={{ background: "#fff", borderRadius: "12px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                    <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                        <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#2196F3", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.5rem", fontSize: "2rem", color: "#fff", fontWeight: "bold" }}>
                            {(profile?.name || userName || "U")[0].toUpperCase()}
                        </div>
                        <h2 style={{ margin: 0 }}>{profile?.name}</h2>
                        <p style={{ color: "#888", margin: "4px 0" }}>{profile?.email}</p>
                    </div>

                    {editing ? (
                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: "1rem" }}>
                                <label style={labelStyle}>Name</label>
                                <input style={fieldStyle} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div style={{ marginBottom: "1rem" }}>
                                <label style={labelStyle}>Mobile</label>
                                <input style={fieldStyle} value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} pattern="\d{10}" />
                            </div>
                            <div style={{ marginBottom: "1.5rem" }}>
                                <label style={labelStyle}>Gender</label>
                                <select style={fieldStyle} value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div style={{ display: "flex", gap: "1rem" }}>
                                <button type="submit" disabled={saving} style={{ flex: 1, padding: "0.6rem", backgroundColor: "#2196F3", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem" }}>
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                                <button type="button" onClick={() => setEditing(false)} style={{ flex: 1, padding: "0.6rem", backgroundColor: "#fff", color: "#333", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer", fontSize: "1rem" }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            {[
                                { label: "Email", value: profile?.email },
                                { label: "Mobile", value: profile?.mobile },
                                { label: "Gender", value: profile?.gender || "—" },
                                { label: "Member Since", value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "—" },
                            ].map(({ label, value }) => (
                                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0", borderBottom: "1px solid #f0f0f0" }}>
                                    <span style={labelStyle}>{label}</span>
                                    <span style={{ color: "#333" }}>{value}</span>
                                </div>
                            ))}
                            <button
                                onClick={() => setEditing(true)}
                                style={{ width: "100%", marginTop: "1.5rem", padding: "0.6rem", backgroundColor: "#2196F3", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem" }}
                            >
                                Edit Profile
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Addresses tab */}
            {activeTab === "Addresses" && (
                <div style={{ background: "#fff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                    <AddressManager />
                </div>
            )}
        </div>
    );
}

export default UserProfile;
