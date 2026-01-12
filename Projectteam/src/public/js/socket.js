const socket = new WebSocket('ws://localhost:3001/socket');

socket.addEventListener('open', () => {
  console.log('WebSocket connection established');
});

socket.addEventListener('message', (event) => {
  console.log('Received product count:', event.data);
  document.getElementById('productCount').textContent = event.data.split(': ')[1];
});

socket.addEventListener('close', () => {
  console.log('WebSocket connection closed');
});