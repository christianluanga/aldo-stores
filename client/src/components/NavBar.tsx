import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-white font-bold text-xl py-2">ALDO GROUP STORES</Link>
        </div>
        <ul className="flex space-x-4">
          <li><Link to="/" className="text-white hover:text-gray-300">Home</Link></li>
          <li><Link to="/admin" className="text-white hover:text-gray-300">Monitor Stock</Link></li>
          <li><Link to="/report" className="text-white hover:text-gray-300">Reports</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
