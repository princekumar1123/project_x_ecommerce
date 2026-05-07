import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { sessionExpiredAction, clearSessionExpired } from "../store/authSlice";
import { clearCartState } from "../store/cartSlice";
import { clearWishlistState } from "../store/wishlistSlice";

export default function SessionExpiredModal() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionExpired = useSelector((s) => s.auth.sessionExpired);

    // Listen for the custom event fired by axiosInstance when refresh fails
    useEffect(() => {
        const handler = () => {
            dispatch(sessionExpiredAction());
            dispatch(clearCartState());
            dispatch(clearWishlistState());
        };
        window.addEventListener("session-expired", handler);
        return () => window.removeEventListener("session-expired", handler);
    }, [dispatch]);

    useEffect(() => {
        if (!sessionExpired) return;

        Swal.fire({
            icon: "warning",
            title: "Session Expired",
            text: "Your session has timed out for security. Please log in again to continue.",
            confirmButtonText: "Log In Again",
            cancelButtonText: "Dismiss",
            showCancelButton: true,
            reverseButtons: true,
            allowOutsideClick: false,
            customClass: {
                popup: "swal-popup",
                confirmButton: "swal-btn swal-btn-confirm",
                cancelButton: "swal-btn swal-btn-cancel",
            },
            buttonsStyling: false,
        }).then((result) => {
            dispatch(clearSessionExpired());
            navigate("/");
            if (result.isConfirmed) {
                setTimeout(() => window.dispatchEvent(new CustomEvent("open-login-modal")), 100);
            }
        });
    }, [sessionExpired, dispatch, navigate]);

    return null;
}
