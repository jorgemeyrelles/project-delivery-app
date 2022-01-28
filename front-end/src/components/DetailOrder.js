import React, { useEffect, useState } from 'react';

// import { Container } from './styles';

function DetailOrder() {
  const [prod, setProd] = useState([]);
  const [tot, setTot] = useState('');
  const [client, setClient] = useState('customer');
  // const { products } = props;

  useEffect(() => {
    const { role } = JSON.parse(localStorage.getItem('user'));
    setClient(role);
    const value = JSON.parse(localStorage.getItem('detail'));
    // console.log(value);
    setProd(value.product);
    const total = value.product
      .reduce((acc, rec) => acc + (parseFloat(rec.price) * rec.SalesProduct.quantity), 0);
    setTot(total.toFixed(2).toString().replace('.', ','));
  }, []);

  const subTotal = (price, qty) => {
    const sub = parseFloat(price) * qty;
    return sub.toFixed(2).toString().replace('.', ',');
  };

  const styleTest = {
    position: 'absolute',
    right: '20px',
    padding: '5px',
    borderRadius: '10px',
    backgroundColor: '#036b52',
    width: '180px',
    textAlign: 'center',
  };

  const testid41 = `${client}_order_details__element-order-table-item-number-`;
  const testid43 = `${client}_order_details__element-order-table-quantity-`;
  const testid44 = `${client}_order_details__element-order-table-sub-total-`;

  const card = () => (
    <div>
      <table style={ { width: '100%', textAlign: 'center' } }>
        <thead>
          <tr>
            <th>Item</th>
            <th>Descrição</th>
            <th>Quantidade</th>
            <th>Valor Unitário</th>
            <th>Sub-total</th>
          </tr>
        </thead>
        <tbody>
          { prod.map((e, i) => (
            <tr key={ i }>
              <td
                data-testid={ `${testid41}${i}` }
              >
                { i + 1 }
              </td>
              <td
                data-testid={ `${client}_order_details__element-order-table-name-${i}` }
              >
                { e.name }
              </td>
              <td
                data-testid={ `${testid43}${i}` }
              >
                { e.SalesProduct.quantity }
              </td>
              <td
                data-testid={ `${testid44}${i}` }
              >
                { `R$ ${e.price.replace('.', ',')}` }
              </td>
              <td
                data-testid={ `${client}_order_details__element-order-total-price-${i}` }
              >
                { `R$ ${subTotal(e.price, e.SalesProduct.quantity)}` }
              </td>
            </tr>
          )) }
        </tbody>
      </table>
      <div
        style={ styleTest }
      >
        <h2
          data-testid={ `${client}_order_details__element-order-total-price` }
          style={ { margin: '5px 5px' } }
        >
          {`Total: R$ ${tot}`}
        </h2>
      </div>
    </div>
  );

  return card();
}

export default DetailOrder;
