
import express, { NextFunction, Request, Response } from 'express';
import { createServer } from 'http';
import "dotenv/config";
import { checkDB, syncDB } from './config';
import { User } from './models';
import seedAll from './config/seed';
import { router } from './routes';
import { AppError } from './utils';
import { initSocket } from './socket';
const PORT = process.env.PORT || 3000

const app = express();
const server = createServer(app);
initSocket(server);

app.use(express.json())

app.use("/", router);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ code: err.code })
    }
    return res.status(500).json({ code: 'INTERNAL_SERVER_ERROR' })
});

async function start() {
  await checkDB();
  await syncDB();

  if ((await User.count()) === 0) {
    await seedAll();
    console.log('Seed cargado.');
  }

  server.listen(PORT, () => {
    console.log(` Servidor en puerto ${PORT}`);
  });
}

start();
