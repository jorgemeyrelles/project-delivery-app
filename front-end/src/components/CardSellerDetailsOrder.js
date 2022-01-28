import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DetailOrder from './DetailOrder';

// import { Container } from './styles';

function CardSellerDetailsOrder() {
  const [details, setDetails] = useState([]);
  const [seller, setSeller] = useState('');
  const [sellId, setSellId] = useState('');
  const [date, setDate] = useState('');
  const [st, setSt] = useState('');
  const [client, setClient] = useState('seller');

  useEffect(() => {
    const getSeller = async () => {
      // getting all users
      const allSel = await axios.get('http://localhost:3001/user');
      // getting details about order from localstorage
      const id = window.location.pathname.split('/')[3];
      // console.log('id', id);
      const { token, role } = JSON.parse(localStorage.getItem('user'));
      setClient(role);
      const detail = await axios.get(`http://localhost:3001/${role}/orders/${id}`,
        { headers: { authorization: token } });
      console.log('detail', detail.data, detail);
      // getting seller's name who is in details
      const sel = allSel.data.find((e) => e.id === detail.data.sellerId);
      // setting in seller's name in local state
      setSeller(sel);
      // setting in all details in local state
      setDetails(detail);
      // setting in order id formated in local state
      const numMagic = 4;
      setSellId((detail.data.id).toString().padStart(numMagic, '0'));
      // console.log('detail', details);
      // setting in date formated in local state
      const value = new Date(detail.data.saleDate);
      setDate(value.toLocaleDateString('pt-Br'));
      // setting in upper case of status in local state
      setSt(detail.data.status);
    };
    getSeller();
  }, []);

  const testid40 = `${client}_order_details__element-order-details-label-delivery-status`;
  const testid38 = `${client}_order_details__element-order-details-label-seller-name`;
  const testid39 = `${client}_order_details__element-order-details-label-order-date`;
  const check = (client === 'customer') ? 'delivery' : 'preparing';
  const transit = 'Em Trânsito';
  const ok = (st === 'Pendente' || st === 'Entregue' || st === transit);

  const submitBtn = async () => {
    const { token, role } = JSON.parse(localStorage.getItem('user'));
    await axios.post(`http://localhost:3001/${role}/orders/${details.data.id}`,
      { status: 'Preparando' },
      { headers: { authorization: token } });
    // console.log(test);
    setSt('Preparando');
  };

  const toDispatch = async () => {
    const { token, role } = JSON.parse(localStorage.getItem('user'));
    await axios.post(`http://localhost:3001/${role}/orders/${details.data.id}`,
      { status: transit },
      { headers: { authorization: token } });
    setSt(transit);
  };

  const dualBtn = () => {
    const sel = st === 'Preparando' || st === 'Entregue' || st === transit;
    return (
      <button
        style={ { height: '25px', alignSelf: 'center' } }
        data-testid={ `${client}_order_details__button-${check}-check` }
        type="button"
        onClick={ () => submitBtn() }
        disabled={ sel }
      >
        PREPARAR O PEDIDO
      </button>
    );
  };

  return (
    <div>
      <h1>Detalhes do pedido</h1>
      <div style={ { display: 'flex', width: '100%', justifyContent: 'space-around' } }>
        <h4
          data-testid={ `${client}_order_details__element-order-details-label-order-id` }
        >
          {`PEDIDO ${sellId}; `}
        </h4>
        <h4
          data-testid={ testid38 }
        >
          {`P. Vend: ${seller.name}`}
        </h4>
        <h3
          data-testid={ testid39 }
        >
          {date}
        </h3>
        <h3
          data-testid={ testid40 }
        >
          {st}
        </h3>
        { dualBtn() }
        <button
          style={ { height: '25px', alignSelf: 'center' } }
          type="button"
          onClick={ () => toDispatch() }
          data-testid="seller_order_details__button-dispatch-check"
          disabled={ ok }
        >
          SAIU PARA ENTREGA
        </button>
      </div>
      <div>
        <DetailOrder products={ details } />
      </div>
    </div>
  );
}

export default CardSellerDetailsOrder;
