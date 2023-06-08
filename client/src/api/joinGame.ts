import axios from 'axios';

export async function joinGame() {
  const response = await axios.post('http://localhost:8080/join', {});

  return response.data;
}
