import axios from 'axios';

export async function leaveGame(userId: number) {
  const response = await axios.delete(
    `http://localhost:8080/leave/${userId}`,
    {}
  );

  return response.data;
}
