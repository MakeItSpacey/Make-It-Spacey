const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  const db = new sqlite3.Database('database.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the database.');
  });

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);

    db.all(message, [], (err, rows) => {
      if (err) {
        console.error(err.message);
        ws.send(JSON.stringify({ error: err.message }));
        return;
      }

      ws.send(JSON.stringify(rows));
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Closed the database connection.');
    });
  });
});
