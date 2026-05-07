import Swal from "sweetalert2";

// ── Themed base instance ──────────────────────────────────────────────────────
const MySwal = Swal.mixin({
    customClass: {
        confirmButton: "swal-btn swal-btn-confirm",
        cancelButton:  "swal-btn swal-btn-cancel",
        popup:         "swal-popup",
    },
    buttonsStyling: false,
    allowOutsideClick: false,
});

// ── Toast (top-right, auto-dismiss) ──────────────────────────────────────────
export const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    // Push the toast below the sticky navbar (64px) and above everything else
    customClass: { container: "swal-toast-container" },
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
});

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Show a success toast */
export const toastSuccess = (title) =>
    Toast.fire({ icon: "success", title });

/** Show an error toast */
export const toastError = (title) =>
    Toast.fire({ icon: "error", title });

/** Show a warning toast */
export const toastWarning = (title) =>
    Toast.fire({ icon: "warning", title });

/** Show an info toast */
export const toastInfo = (title) =>
    Toast.fire({ icon: "info", title });

/**
 * Show a danger confirmation dialog.
 * Returns true if the user confirmed, false otherwise.
 */
export const confirmDanger = async ({ title, text, confirmText = "Yes, delete" }) => {
    const result = await MySwal.fire({
        icon: "warning",
        title,
        text,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: "Cancel",
        reverseButtons: true,
        focusCancel: true,
    });
    return result.isConfirmed;
};

/**
 * Show a generic confirmation dialog.
 * Returns true if the user confirmed.
 */
export const confirmAction = async ({ title, text, confirmText = "Yes", icon = "question" }) => {
    const result = await MySwal.fire({
        icon,
        title,
        text,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: "Cancel",
        reverseButtons: true,
    });
    return result.isConfirmed;
};

export default MySwal;
