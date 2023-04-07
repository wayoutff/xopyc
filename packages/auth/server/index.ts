import passport from 'passport';
import { Express } from 'express';
import authRoutes from './routes';

export default function initAuth(app: Express) {
  app.use(passport.initialize());
  app.use(passport.session());
  app.use('/auth', authRoutes);
}
