import React, { useEffect, useState } from 'react';

// import { Container } from './styles';

function CardCheckout() {
  const [chart, setChart] = useState([]);
  const [load, setLoad] = useState(false);
  const [totalLocal, setTotalLocal] = useState('');

  useEffect(() => {
    const response = JSON.parse(localStorage.getItem('chart'));
    const total = response
      .reduce((acc, { price, quantity }) => acc + (parseFloat(price) * quantity), 0);
    console.log('effect []', response, total);
    setTotalLocal(total.toFixed(2).toString().replace('.', ','));
    setChart(response);
  }, []);

  useEffect(() => {
    const res = JSON.parse(localStorage.getItem('chart'));
    const total = res
      .reduce((acc, { price, quantity }) => acc + (parseFloat(price) * quantity), 0);
    console.log('effect [load]', res, total);
    setTotalLocal(total.toFixed(2).toString().replace('.', ','));
    setChart(res);
    setLoad(false);
  }, [load]);

  const updateProducts = (valueAcc, valueName) => {
    const prod = JSON.parse(localStorage.getItem('products'));
    const index = prod.findIndex((e) => e.name === valueName);
    const numMagic = -1;
    if (index !== numMagic) {
      prod[index].quantity = valueAcc;
      prod[index].total = parseFloat(prod[index].price) * valueAcc;
    }
    return localStorage.setItem('products', JSON.stringify(prod));
  };

  const removeOne = (name) => {
    const arr = JSON.parse(localStorage.getItem('chart'));
    const index = arr.findIndex((e) => e.name === name);
    arr.splice(index, 1);
    localStorage.setItem('chart', JSON.stringify(arr));
    updateProducts(0, name);
    setLoad(true);
  };

  const styleTest = {
    position: 'absolute',
    right: '20px',
    padding: '8px',
    borderRadius: '10px',
    backgroundColor: '#036b52',
    width: '150px',
  };

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
            <th>Remover Item</th>
          </tr>
        </thead>
        <tbody>
          { chart.map((e, i) => (
            <tr key={ i }>
              <td
                data-testid={ `customer_checkout__element-order-table-item-number-${i}` }
              >
                { i + 1 }
              </td>
              <td
                data-testid={ `customer_checkout__element-order-table-name-${i}` }
              >
                { e.name }
              </td>
              <td
                data-testid={ `customer_checkout__element-order-table-quantity-${i}` }
              >
                { e.quantity }
              </td>
              <td
                data-testid={ `customer_checkout__element-order-table-unit-price-${i}` }
              >
                { `R$ ${e.price.replace('.', ',')}` }
              </td>
              <td
                data-testid={ `customer_checkout__element-order-table-sub-total-${i}` }
              >
                { `R$ ${(e.quantity * e.price).toFixed(2).toString().replace('.', ',')}` }
              </td>
              <td>
                <button
                  data-testid={ `customer_checkout__element-order-table-remove-${i}` }
                  type="button"
                  onClick={ () => removeOne(e.name) }
                >
                  Remover
                </button>
              </td>
            </tr>
          )) }
        </tbody>
      </table>
      <h3
        style={ styleTest }
        data-testid="customer_checkout__element-order-total-price"
      >
        {`Total: R$ ${totalLocal}`}
      </h3>
    </div>
  );

  return card();
}

export default CardCheckout;
