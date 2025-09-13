import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const modules = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Products", path: "/products" },
    { name: "Sales", path: "/sales" },
    { name: "Inventory", path: "/inventory" },
    { name: "Customers", path: "/customers" },
    { name: "Reporting", path: "/reporting" },
  ];

  return (
    <header className="header">
      <div className="header-left">
        <h1>Stock Inventory System</h1>
      </div>

      <nav className="header-nav">
        {modules.map((mod) => (
          <NavLink
            key={mod.path}
            to={mod.path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {mod.name}
          </NavLink>
        ))}
      </nav>

      <div className="user-info">
      </div>
    </header>
  );
};

export default Header;
