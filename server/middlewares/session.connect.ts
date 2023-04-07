import session from 'express-session';

import { createClient } from 'redis';
import { Express } from 'express';

import RedisStore from 'connect-redis';

// Initialize client.
let redisClient = createClient();
redisClient.connect().catch(console.error);

let redisStore = new RedisStore({
  client: redisClient,
  prefix: 'myapp:',
});

redisClient.on('error', (err) => {
  console.log('Could not establish a connection with redis. ' + err, 'red');
});
redisClient.on('connect', (err) => {
  console.log('Connected to redis successfully', 'blue');
});

export default function connectSession(app: Express) {
  app.use(
    session({
      store: redisStore,
      secret: 'session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie
        maxAge: 1000 * 60 * 60 * 24 * 30, // session max age in miliseconds === 30 days
      },
    })
  );
}
