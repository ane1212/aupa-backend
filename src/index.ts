
import express from 'express';
import "dotenv/config";
import { checkDB, syncDB } from './config';
import { User } from './models';
import seedAll from './config/seed';
import { router } from './routes';
const PORT = process.env.PORT || 3000

const app = express();
app.use(express.json())


app.use("/", router);

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