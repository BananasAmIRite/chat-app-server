import ChatServer from './Server';

const s = new ChatServer();
s.start(1000, () => {
  console.log(`Server started!`);
});
