const socket = new WebSocket('ws://157.193.171.36:3001/socket');

socket.addEventListener('open', () => {
  console.log('WebSocket connection established');
});

socket.addEventListener('message', (event) => {
  console.log('Received child count:', event.data);
  document.getElementById('childCount').textContent = event.data.split(': ')[1];
});

socket.addEventListener('close', () => {
  console.log('WebSocket connection closed');
});