import { useCallback } from "react";

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

const loadScript = () =>
    new Promise((resolve) => {
        if (document.querySelector(`script[src="${RAZORPAY_SCRIPT}"]`)) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = RAZORPAY_SCRIPT;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

/**
 * useRazorpay hook
 * Returns an `openPayment` function that launches the Razorpay checkout modal.
 *
 * @param {object} options
 *   key          - Razorpay key_id
 *   orderId      - Razorpay order ID from server
 *   amount       - Amount in paise
 *   currency     - "INR"
 *   name         - Business name shown in modal
 *   description  - Payment description
 *   prefill      - { name, email, contact }
 *   onSuccess    - callback({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
 *   onFailure    - callback(error)
 */
const useRazorpay = () => {
    const openPayment = useCallback(async (options) => {
        const loaded = await loadScript();
        if (!loaded) {
            options.onFailure?.("Failed to load Razorpay SDK. Check your internet connection.");
            return;
        }

        const rzp = new window.Razorpay({
            key: options.key,
            amount: options.amount,
            currency: options.currency || "INR",
            name: options.name || "Prince Shopify",
            description: options.description || "Order Payment",
            image: "/e-logo.png",
            order_id: options.orderId,
            prefill: options.prefill || {},
            theme: { color: "#2196F3" },
            handler: (response) => {
                options.onSuccess?.(response);
            },
            modal: {
                ondismiss: () => {
                    options.onFailure?.("Payment cancelled by user.");
                },
            },
        });

        rzp.on("payment.failed", (response) => {
            options.onFailure?.(response.error?.description || "Payment failed.");
        });

        rzp.open();
    }, []);

    return { openPayment };
};

export default useRazorpay;
