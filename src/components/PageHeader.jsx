import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./PageHeader.css";

/**
 * Reusable page header with back button.
 * Props:
 *   title       - main heading
 *   subtitle    - optional sub-text
 *   backTo      - explicit path to go back to (optional; defaults to browser history)
 *   backLabel   - label next to arrow (optional; defaults to "Back")
 *   actions     - optional JSX rendered on the right side
 */
function PageHeader({ title, subtitle, backTo, backLabel = "Back", actions }) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (backTo) {
            navigate(backTo);
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="page-header">
            <div className="page-header-left">
                <button className="page-header-back" onClick={handleBack} aria-label="Go back">
                    <ArrowLeftOutlined />
                    <span>{backLabel}</span>
                </button>
                <div className="page-header-titles">
                    <h1 className="page-header-title">{title}</h1>
                    {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
                </div>
            </div>
            {actions && <div className="page-header-actions">{actions}</div>}
        </div>
    );
}

export default PageHeader;
