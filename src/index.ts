
import express from 'express';
import "dotenv/config";
import { checkDB, syncDB } from './config';
const PORT = process.env.PORT || 3000

const app = express();
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Server running 🚀')
})

async function start() {
  await checkDB();
  await syncDB();

  app.listen(PORT, () => {
    console.log(` Servidor en puerto ${PORT}`);
  });
}

start();