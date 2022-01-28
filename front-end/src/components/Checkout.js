import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import CardCheckout from './CardCheckout';

// import { Container } from './styles';

function Checkout() {
  // const { selected } = useContext(GlobalContext);
  const [address, setAddress] = useState({});
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);
  // const local = JSON.parse(localStorage.getItem('chart'));

  useEffect(() => {
    const getSeller = async () => {
      const allUsers = await axios.get('http://localhost:3001/user');
      const sel = allUsers.data.filter((e) => e.role === 'seller');
      setSellers(sel);
      // console.log(sel, sellers);
    };
    getSeller();
  }, []);

  function handleChange({ target: { value, name } }) {
    setAddress({
      ...address,
      [name]: value,
    });
  }

  async function submitBtn() {
    const { email, token, role } = JSON.parse(localStorage.getItem('user'));
    console.log('token', role);
    const user = await axios.get(`http://localhost:3001/user/${email}`);
    // console.log('aqui', user);
    const prods = JSON.parse(localStorage.getItem('chart'))
      .map((e) => ({ productId: e.id, quantity: e.quantity }));
    const res = {
      userId: user.data.id,
      sellerId: 2,
      totalPrice: JSON.parse(localStorage.getItem('chart'))
        .reduce((acc, { price, quantity }) => acc + (price * quantity), 0),
      deliveryAddress: address.address,
      deliveryNumber: address.number,
      status: 'Pendente',
      products: prods,
    };
    const ret = await axios.post('http://localhost:3001/customer/checkout',
      { ...res },
      { headers: { authorization: token } });
    const ret2 = await axios.get(`http://localhost:3001/${role}/orders/${ret.data}`,
      { headers: { authorization: token } });
    // console.log('post', ret2);
    localStorage.setItem('detail', JSON.stringify(ret2.data));
    navigate(`/${role}/orders/${ret.data}`);
  }

  const list = () => (
    <select
      name="vend"
      onChange={ handleChange }
      data-testid="customer_checkout__select-seller"
    >
      <option value="">Selecione</option>
      { sellers && sellers.map((e, i) => (
        <option
          value={ e.name }
          key={ i }
        >
          { e.name }
        </option>
      )) }
    </select>
  );

  const card = () => (
    <div>
      <div>
        <h2>Finalizar pedidos</h2>
        <div>
          <CardCheckout />
        </div>
      </div>
      <div style={ { marginTop: '70px' } }>
        <h2>Detalhes e endereços para entrega</h2>
        <form action="" style={ { display: 'flex', justifyContent: 'space-around' } }>
          <div style={ { display: 'block' } }>
            <h4>P. Vendedora responsável</h4>
            { list() }
          </div>
          <div style={ { display: 'block' } }>
            <h4>Endereço</h4>
            <input
              data-testid="customer_checkout__input-address"
              style={ { width: '300px' } }
              type="text"
              name="address"
              placeholder="Address here - with no number"
              onChange={ handleChange }
            />
          </div>
          <div style={ { display: 'block' } }>
            <h4>Número</h4>
            <input
              data-testid="customer_checkout__input-addressNumber"
              style={ { width: '50px' } }
              type="number"
              name="number"
              onChange={ handleChange }
            />
          </div>
        </form>
        <div style={ { textAlign: 'center', marginTop: '20px' } }>
          <button
            data-testid="customer_checkout__button-submit-order"
            type="button"
            onClick={ () => submitBtn() }
          >
            FINALIZAR PEDIDO
          </button>
        </div>
      </div>
    </div>
  );

  return card();
}

export default Checkout;
