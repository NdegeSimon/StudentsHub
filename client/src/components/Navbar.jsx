import React from "react";  

export default function Navbar() {
    return (
        <nav>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/jobs">Jobs</a></li>
                <li><a href="/login">Login</a></li>
                <li><a href="/signup">Signup</a></li>
            </ul>
        </nav>
    );
}