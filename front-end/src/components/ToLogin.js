import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { GlobalContext } from '../context/GlobalState';

// import { Container } from './styles';

function ToLogin() {
  const { setUser, setProducts } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [login, setLogin] = useState({ email: '', password: '' });
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState(false);

  function handleChange({ target: { value, name } }) {
    setLogin({
      ...login,
      [name]: value,
    });
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'customer') {
      navigate('/customer/products');
    }
    if (user && user.role === 'seller') {
      navigate('/seller/orders');
    }
    if (user && user.role === 'administrator') {
      navigate('/admin/manage');
    }
  }, []);

  useEffect(() => {
    const { email, password } = login;
    const minPass = 6;
    const emailValid = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    if (emailValid.test(email) && password.length >= minPass && password.length !== 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [login]);

  async function submitBtn() {
    const { email, password } = login;
    try {
      const userData = await axios.post('http://localhost:3001/login', {
        email,
        password,
      });
      setUser(true);
      localStorage.setItem('user', JSON.stringify({
        name: userData.data.user.name,
        email: userData.data.user.email,
        role: userData.data.user.role,
        token: userData.data.user.token,
      }));
      const prod = await axios.get('http://localhost:3001/customer/products');
      prod.data.map((item) => {
        item.total = 0;
        item.quantity = 0;
        return item;
      });
      setProducts(prod);
      localStorage.setItem('products', JSON.stringify(prod.data));
      localStorage.setItem('chart', JSON.stringify([]));
      // if (email === 'zebirita@email.com' && password === '$#zebirita#$') {
      // }
      if (email.split('@')[0] === 'adm') {
        navigate('/admin/manage');
      } else if (userData.data.user.role === 'customer') {
        navigate('/customer/products');
      } else if (userData.data.user.role === 'seller') {
        navigate('/seller/orders');
      }
    } catch (erro) {
      if (erro) {
        setError(true);
      }
    }
  }

  function formInit() {
    return (
      <form style={ { textAlign: '-webkit-center' } }>
        <div htmlFor="email">
          <h4>E-mail</h4>
          <input
            id="id-email"
            type="email"
            placeholder="Type your e-mail here"
            name="email"
            onChange={ handleChange }
            data-testid="common_login__input-email"
          />
        </div>
        <div htmlFor="password">
          <h4>Password</h4>
          <input
            id="password"
            type="password"
            placeholder="Type your password here"
            name="password"
            onChange={ handleChange }
            data-testid="common_login__input-password"
          />
        </div>
        <button
          style={ { marginTop: '10px', width: '100px' } }
          type="button"
          disabled={ disabled }
          onClick={ submitBtn }
          data-testid="common_login__button-login"
        >
          Enter
        </button>
        {error ? (
          <h3
            style={ { border: '1px solid black', borderRadius: '5px', width: '200px' } }
            data-testid="common_login__element-invalid-email"
          >
            Dados inválidos!
          </h3>
        ) : null}
      </form>
    );
  }

  const styleLogin = {
    textAlignLast: 'center',
    position: 'relative',
    top: '150px',
  };

  return (
    <main style={ styleLogin }>
      <h2>Login</h2>
      {formInit()}
      <div>
        <button
          style={ { marginTop: '10px', width: '100px' } }
          type="button"
          onClick={ () => navigate('/register') }
          data-testid="common_login__button-register"
        >
          Register
        </button>
      </div>
    </main>
  );
}

export default ToLogin;
