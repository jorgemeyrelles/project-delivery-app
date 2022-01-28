import React from 'react';
import { useNavigate } from 'react-router';

import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const currentUser = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
    }
    return user;
  };

  return (
    <nav className="navbar">
      <div className="navbar-items-container">
        <button
          type="button"
          onClick={ () => navigate('/customer/products') }
          style={ { cursor: 'pointer', height: '100%', border: 'none' } }
          className="navbar-item"
          data-testid="customer_products__element-navbar-link-products"
        >
          PRODUTOS
        </button>
        <button
          type="button"
          onClick={ () => navigate(`/${currentUser().role}/orders`) }
          style={ { cursor: 'pointer', height: '100%', border: 'none' } }
          className="navbar-item"
          data-testid="customer_products__element-navbar-link-orders"
        >
          MEUS PEDIDOS
        </button>
      </div>
      <div
        className="navbar-user-name"
        data-testid="customer_products__element-navbar-user-full-name"
      >
        { currentUser().name }
      </div>
      <button
        type="button"
        className="navbar-logout"
        data-testid="customer_products__element-navbar-link-logout"
        onClick={ () => logout() }
      >
        Sair
      </button>
    </nav>
  );
}

export default Navbar;
