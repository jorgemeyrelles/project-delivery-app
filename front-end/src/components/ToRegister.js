import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { GlobalContext } from '../context/GlobalState';

// import { Container } from './styles';

function ToRegister() {
  const { setProducts } = useContext(GlobalContext);
  const [register, setRegister] = useState({ name: '', email: '', password: '' });

  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  function handleChange({ target: { value, name } }) {
    setRegister({
      ...register,
      [name]: value,
    });
  }

  useEffect(() => {
    const { email, name, password } = register;
    const minName = 12;
    const emailValid = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const minPass = 6;
    const valid = emailValid.test(email)
      && name.length >= minName && password.length >= minPass;
    if (valid) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [register]);

  async function submitBtn() {
    const { name, email, password } = register;
    // console.log(name, email, password);
    try {
      const tkn = await axios.post('http://localhost:3001/register', {
        name,
        email,
        password,
        role: 'customer',
      });
      const response = await axios.get(`http://localhost:3001/user/${email}`);
      console.log('user', register);
      localStorage.setItem('user', JSON.stringify({
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        token: tkn.data.token,
      }));
      const prod = await axios.get('http://localhost:3001/customer/products');
      prod.data.map((item) => {
        item.total = 0;
        item.quantity = 0;
        return item;
      });
      // console.log('nav', user, local)
      setProducts(prod);
      localStorage.setItem('products', JSON.stringify(prod.data));
      localStorage.setItem('chart', JSON.stringify([]));
      navigate('/customer/products');
    } catch (erro) {
      console.log(erro);
      console.log(erro.status);
      if (erro) {
        setError(true);
      }
    }
  }

  const styleLogin = {
    textAlignLast: 'center',
    position: 'relative',
    top: '150px',
  };

  return (
    <main style={ styleLogin }>
      <h2>Register</h2>
      <form style={ { textAlign: '-webkit-center' } }>
        <div>
          <h4>Name</h4>
          <input
            id="name"
            type="text"
            placeholder="Type your name here"
            name="name"
            onChange={ handleChange }
            data-testid="common_register__input-name"
          />
        </div>
        <div>
          <h4>E-mail</h4>
          <input
            id="email"
            type="email"
            placeholder="Type your e-mail here"
            name="email"
            onChange={ handleChange }
            data-testid="common_register__input-email"
          />
        </div>
        <div>
          <h4>Password</h4>
          <input
            id="password"
            type="password"
            placeholder="Type your password here"
            name="password"
            onChange={ handleChange }
            data-testid="common_register__input-password"
          />
        </div>
        <button
          style={ { marginTop: '10px', width: '100px' } }
          type="button"
          disabled={ disabled }
          onClick={ submitBtn }
          data-testid="common_register__button-register"
        >
          Register
        </button>

        { error ? (
          <h3
            style={ { border: '1px solid black', borderRadius: '5px', width: '200px' } }
            data-testid="common_register__element-invalid_register"
          >
            Usuário já cadastrado!
          </h3>
        ) : null}
      </form>
    </main>
  );
}

export default ToRegister;
