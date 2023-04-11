import passport from 'passport';
import { Express } from 'express';
import authRoutes from './routes';

function initAuth (app, options?) {
  app.use(passport.initialize());
  app.use(passport.session());
  app.use('/auth', authRoutes);
}

interface Options {
  test: boolean;
  kek: string
}

export default function init(appOrOptions: Express | { [K in keyof Options]?: Options[K]}) {
  if (typeof appOrOptions === 'function') {
    initAuth(appOrOptions)
  }
  return function curr (app: Express) {
    initAuth(app, appOrOptions)
  }
}
