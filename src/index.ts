
import express from 'express';
import "dotenv/config";
import { checkDB, syncDB } from './config';
import { User } from './models';
import seedAll from './config/seed';
const PORT = process.env.PORT || 3000

const app = express();
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Server running 🚀')
})

async function start() {
  await checkDB();
  await syncDB();

  if ((await User.count()) === 0) {
    await seedAll();
    console.log('Seed cargado.');
  }

  app.listen(PORT, () => {
    console.log(` Servidor en puerto ${PORT}`);
  });
}

start();