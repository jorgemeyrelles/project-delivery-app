// import axios from 'axios';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { GlobalContext } from '../context/GlobalState';

// import { Container } from './styles';

function BtnToChart() {
  const { total } = useContext(GlobalContext);
  // const [total, setTotal] = useState('');
  const navigate = useNavigate();

  // const calcTotal = () => {
  //   const arr = JSON.parse(localStorage.getItem('chart'));
  //   const calc = arr.reduce((acc, e) => acc + (e.price * e.quantity), 0);
  //   setTotal(calc);
  // };

  const toChart = async () => {
    // console.log(total);
    // const { token } = JSON.parse(localStorage.getItem('user'));
    // await axios.post('http://localhost:3001/customer/checkout',
    //   { headers: { authorization: token } });
    navigate('/customer/checkout');
  };

  const styleBtn = {
    cursor: 'pointer',
    border: '1px solid black',
    borderRadius: '10px',
    width: '250px',
    padding: '2px',
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#036b52',
    textAlign: 'center',
  };

  return (
    <button
      style={ styleBtn }
      type="button"
      onClick={ () => toChart() }
      data-testid="customer_products__button-cart"
      disabled={ (total < 1) }
    >
      <h2 data-testid="customer_products__checkout-bottom-value">
        {`Ver carrinho: R$ ${total.toFixed(2).toString().replace('.', ',')}`}
      </h2>
    </button>
  );
}

export default BtnToChart;
