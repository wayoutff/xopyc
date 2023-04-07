import express from 'express';
import UserModel from '../model';
import passport from 'passport';

const router = express.Router();

//log in route
router.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (error, user, info) => {
    try {
      if (error) {
        return res.status(500).json({
          message: 'Something is wrong',
          error: error || 'internal server errror',
        });
      }

      //req.login is provided by passport to serilize user id
      req.login(user, async (error) => {
        if (error) {
          res.status(500).json({
            message: 'Somthing is wrong',
            error: error || 'internal server errror',
          });
          return;
        }

        return res.send({ user, info });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

//sign up route
router.post('/signup', async (req, res, next) => {
  passport.authenticate('signup', async (error, user, info) => {
    try {
      if (error) {
        console.log(error, '<<<<<<?');
        return res.json({
          message: 'Ooops, somthing happend',
          error: error || 'internal server errror',
        });
      }

      req.login(user, async (error) => {
        if (error) {
          res.json({
            message: 'Ooops, somthing happend',
            error: error || 'internal server errror',
          });
          return;
        }

        return res.json({ user, info });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

//to check if the user is authenticated
router.get('/login_check', (req, res, next) => {
  if (!req.user) {
    res.send({});
    return;
  }
  res.json(req.user);
});

//log out
router.get('/logout', async (req, res) => {
  req.logout();
  return res.json({ message: 'logged out' });
});

export default router;
