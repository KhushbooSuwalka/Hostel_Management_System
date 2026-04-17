import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-blue-900 text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-6 text-sm">
        <div>
          <h4 className="font-bold mb-2">About</h4>
          <p>Efficient hostel management and grievance control system.</p>
        </div>

        <div>
          <h4 className="font-bold mb-2">Quick Links</h4>
          <Link className="block hover:text-blue-200" to="/">Home</Link>
          <Link className="block hover:text-blue-200" to="/room">Room Allocation</Link>
          <Link className="block hover:text-blue-200" to="/grievance">Grievance</Link>
          <Link className="block hover:text-blue-200" to="/contact">Contact</Link>
        </div>

        <div>
          <h4 className="font-bold mb-2">Contact</h4>
          <p>Email: khushbusuwalka2006@gmail.com</p>
          <p>Phone: +91 9929823850</p>
          <p>Email: kanishkajoshi206@gmail.com</p>
          <p>Phone: +91 7300427924</p>
        </div>

        <div>
          <h4 className="font-bold mb-2">Follow Us</h4>
          <p>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="facebook-icon">
              <i className="fab fa-facebook"></i>
            </a>{" | "}

            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="twitter-icon mx-2">
              <i className="fab fa-twitter"></i>
            </a>{" | "}

            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="instagram-icon">
              <i className="fab fa-instagram"></i>
            </a>
          </p>
        </div>
      </div>

      <div className="text-center text-xs bg-blue-950 py-3">
        © 2026 Hostel Management System. All rights reserved.
      </div>
    </footer>
  );
}

function SocialBadge({ label }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-200 bg-blue-800 font-semibold uppercase text-white">
      {label}
    </span>
  );
}

export default Footer;
