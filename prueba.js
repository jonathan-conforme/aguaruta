import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 1, // 50 bots (usuarios virtuales) simultáneos
  duration: '10s', // Atacando durante 30 segundos
};

export default function () {
  // OJO: Cambia esta URL por la dirección local exacta donde ves tu sistema
  http.get('http://localhost:8000/login');
  sleep(1);
}
