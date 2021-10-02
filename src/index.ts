import ChatServer from './Server';

const s = new ChatServer();
s.start(1000, () => {
  console.log(`Server started!`);
});

s.events.on('ChatRequest', (token, data) => {
  console.log(token);
  console.log(data);
});
