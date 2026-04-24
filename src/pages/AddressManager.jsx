import { useEffect, useState } from "react";
import { Modal, notification } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleFilled, HomeOutlined, BankOutlined } from "@ant-design/icons";
import axiosInstance from "../api/axiosInstance";
import "./AddressManager.css";

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry","Chandigarh","Andaman & Nicobar","Dadra & Nagar Haveli","Daman & Diu","Lakshadweep"];

export function AddressForm({ initial, onSave, onCancel, saving }) {
    const [form, setForm] = useState({
        fullName: initial?.fullName || "",
        mobile: initial?.mobile || "",
        pincode: initial?.pincode || "",
        addressLine1: initial?.addressLine1 || "",
        addressLine2: initial?.addressLine2 || "",
        city: initial?.city || "",
        state: initial?.state || "",
        addressType: initial?.addressType || "home",
        isDefault: initial?.isDefault || false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    const inp = "addr-input";
    const lbl = "addr-label";

    return (
        <form onSubmit={handleSubmit} className="addr-form">
            <div className="addr-form-grid">
                <div className="addr-field">
                    <label className={lbl}>Full Name *</label>
                    <input className={inp} name="fullName" value={form.fullName} onChange={handleChange} placeholder="As on ID" required />
                </div>
                <div className="addr-field">
                    <label className={lbl}>Mobile Number *</label>
                    <input className={inp} name="mobile" value={form.mobile} onChange={handleChange} placeholder="10-digit mobile" pattern="\d{10}" required />
                </div>
                <div className="addr-field">
                    <label className={lbl}>Pincode *</label>
                    <input className={inp} name="pincode" value={form.pincode} onChange={handleChange} placeholder="6-digit pincode" pattern="\d{6}" required />
                </div>
                <div className="addr-field">
                    <label className={lbl}>Address Type</label>
                    <select className={inp} name="addressType" value={form.addressType} onChange={handleChange}>
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="addr-field full">
                    <label className={lbl}>Address Line 1 *</label>
                    <input className={inp} name="addressLine1" value={form.addressLine1} onChange={handleChange} placeholder="House No., Building, Street" required />
                </div>
                <div className="addr-field full">
                    <label className={lbl}>Address Line 2</label>
                    <input className={inp} name="addressLine2" value={form.addressLine2} onChange={handleChange} placeholder="Area, Colony, Landmark (optional)" />
                </div>
                <div className="addr-field">
                    <label className={lbl}>City *</label>
                    <input className={inp} name="city" value={form.city} onChange={handleChange} placeholder="City" required />
                </div>
                <div className="addr-field">
                    <label className={lbl}>State *</label>
                    <select className={inp} name="state" value={form.state} onChange={handleChange} required>
                        <option value="" disabled>Select state</option>
                        {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
            <label className="addr-default-check">
                <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} />
                <span>Set as default address</span>
            </label>
            <div className="addr-form-actions">
                <button type="button" className="addr-btn-cancel" onClick={onCancel}>Cancel</button>
                <button type="submit" className="addr-btn-save" disabled={saving}>
                    {saving ? "Saving..." : "Save Address"}
                </button>
            </div>
        </form>
    );
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault, selectable, selected, onSelect }) {
    const typeIcon = address.addressType === "work" ? <BankOutlined /> : <HomeOutlined />;
    return (
        <div
            className={`addr-card ${address.isDefault ? "default" : ""} ${selectable ? "selectable" : ""} ${selected ? "selected" : ""}`}
            onClick={selectable ? onSelect : undefined}
        >
            {selectable && (
                <div className="addr-radio">
                    <div className={`addr-radio-dot ${selected ? "active" : ""}`} />
                </div>
            )}
            <div className="addr-card-body">
                <div className="addr-card-header">
                    <span className="addr-name">{address.fullName}</span>
                    <span className="addr-type-badge">{typeIcon} {address.addressType}</span>
                    {address.isDefault && <span className="addr-default-badge"><CheckCircleFilled /> Default</span>}
                </div>
                <p className="addr-line">{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ""}</p>
                <p className="addr-line">{address.city}, {address.state} — {address.pincode}</p>
                <p className="addr-mobile">📞 {address.mobile}</p>
            </div>
            {!selectable && (
                <div className="addr-card-actions">
                    {!address.isDefault && (
                        <button className="addr-action-link" onClick={() => onSetDefault(address._id)}>Set Default</button>
                    )}
                    <button className="addr-action-link edit" onClick={() => onEdit(address)}><EditOutlined /> Edit</button>
                    <button className="addr-action-link delete" onClick={() => onDelete(address._id)}><DeleteOutlined /> Delete</button>
                </div>
            )}
        </div>
    );
}

export default function AddressManager() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [api, ctx] = notification.useNotification();

    const fetchAddresses = async () => {
        try {
            const res = await axiosInstance.get("/user/addresses");
            setAddresses(res.data.addresses || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAddresses(); }, []);

    const handleSave = async (form) => {
        setSaving(true);
        try {
            if (editTarget) {
                await axiosInstance.put(`/user/addresses/${editTarget._id}`, form);
                api.open({ type: "success", message: "Address updated", duration: 2 });
            } else {
                await axiosInstance.post("/user/addresses", form);
                api.open({ type: "success", message: "Address added", duration: 2 });
            }
            setShowForm(false);
            setEditTarget(null);
            fetchAddresses();
        } catch (err) {
            const msg = err.response?.data?.error?.message || err.response?.data?.errors?.[0]?.msg || "Failed to save address.";
            api.open({ type: "error", message: msg, duration: 3 });
        } finally { setSaving(false); }
    };

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`/user/addresses/${deleteId}`);
            api.open({ type: "success", message: "Address deleted", duration: 2 });
            setDeleteId(null);
            fetchAddresses();
        } catch (e) {
            api.open({ type: "error", message: "Failed to delete address", duration: 3 });
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await axiosInstance.patch(`/user/addresses/${id}/default`);
            fetchAddresses();
        } catch (e) { console.error(e); }
    };

    return (
        <div className="addr-manager">
            {ctx}
            <Modal open={!!deleteId} onCancel={() => setDeleteId(null)} onOk={handleDelete} okText="Delete" okButtonProps={{ danger: true }} title="Delete Address">
                <p>Are you sure you want to delete this address?</p>
            </Modal>

            <div className="addr-manager-header">
                <h3>Saved Addresses</h3>
                {!showForm && (
                    <button className="addr-btn-add" onClick={() => { setEditTarget(null); setShowForm(true); }}>
                        <PlusOutlined /> Add New Address
                    </button>
                )}
            </div>

            {showForm && (
                <div className="addr-form-card">
                    <h4>{editTarget ? "Edit Address" : "Add New Address"}</h4>
                    <AddressForm
                        initial={editTarget}
                        onSave={handleSave}
                        onCancel={() => { setShowForm(false); setEditTarget(null); }}
                        saving={saving}
                    />
                </div>
            )}

            {loading ? (
                <div className="addr-loading">Loading addresses...</div>
            ) : addresses.length === 0 && !showForm ? (
                <div className="addr-empty">
                    <p>No saved addresses yet.</p>
                    <button className="addr-btn-add" onClick={() => setShowForm(true)}><PlusOutlined /> Add Address</button>
                </div>
            ) : (
                <div className="addr-list">
                    {addresses.map((addr) => (
                        <AddressCard
                            key={addr._id}
                            address={addr}
                            onEdit={(a) => { setEditTarget(a); setShowForm(true); }}
                            onDelete={(id) => setDeleteId(id)}
                            onSetDefault={handleSetDefault}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
