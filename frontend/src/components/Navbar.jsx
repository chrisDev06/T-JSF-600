

import { Link } from "react-router-dom";
import "./styles.css";

const Navbar = () => {
    return (
        <>
            <div class="navbar">
                <a href="#" class="navbar-logo">
                    <img src="your-logo.png" alt="Logo" />
                    My Website
                </a>

                <ul class="navbar-links">
                    <li><a href="#" class="navbar-link">Home</a></li>
                    <li><a href="#" class="navbar-link">About</a></li>
                    <li><a href="#" class="navbar-link">Contact</a></li>
                </ul>

                <div class="icon">
                    <a href="#" class="navbar-link"><i class="fas fa-sign-in-alt"></i> Login</a>
                    <a href="#" class="navbar-link"><i class="fas fa-user-plus"></i> Register</a>
                </div>
            </div>
        </>
    )
}

export default Navbar;