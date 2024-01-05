import "./styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import Signout from "../assets/signout.gif";

const Navbar = () => {
    const isAuthenticated = localStorage.getItem("user_ID");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <nav>
            <ul>
                {isAuthenticated && (
                    <>
                        <li className="logout">
                            <img src={Signout} alt="" />
                            <button onClick={handleLogout}>Logout</button>
                        </li>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/profile">Profile</Link>
                        </li>
                    </>
                )}
                {!isAuthenticated && (
                    <>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/login">Sign in</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
