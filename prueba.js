import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 15,          // 15 bots enviando productos a la vez
  duration: '20s',  // Durante 20 segundos
};

export default function () {
  const url = 'https://aguaruta.congresoticunesum.com/test-api/products';

 // Dentro de tu prueba.js
const payload = JSON.stringify({
  company_id: 8, // <-- Asegúrate de que coincida con tu empresa activa
  name: `Bidón k6 - VU ${__VU} - It ${__ITER}`,
  price: 3.25,
  current_stock: 150
});

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'Producto insertado directamente': (r) => r.status === 201,
  });

  sleep(0.5); // Ráfagas rápidas de medio segundo por bot
}
