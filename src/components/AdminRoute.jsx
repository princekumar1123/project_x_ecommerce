import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
    const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);

    if (!isAuthenticated) return <Navigate to="/" replace />;
    if (!isAdmin) return <Navigate to="/" replace />;

    return children;
}

export default AdminRoute;
