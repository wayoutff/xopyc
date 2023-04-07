//./passport/index.js
import passport from 'passport';
import passportLocal from 'passport-local';

const localStrategy = passportLocal.Strategy;
import UserModel from './model';

type O = string | number;

passport.serializeUser<O>(function (user, done) {
  const id = user.id;
  done(null, id);
});

passport.deserializeUser(function (id: string, done) {
  UserModel.findById(id, function (err: string, user: boolean | Express.User | null | undefined) {
    done(err, user);
  });
});

//Create a passport middleware to handle User login
passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });
        if (user) {
          return done('User already exist', undefined);
        }

        const candidateUser = new UserModel({
          email,
          password,
        });
        candidateUser.save((err: string, user: boolean | Express.User | undefined) => {
          if (err) {
            return done(err, undefined);
          }
          //delete user.password; //todo
          return done(null, user, { message: 'SignUp success' });
        });
      } catch (error) {
        done(error, undefined);
      }
    }
  )
);

//Create a passport middleware to handle User login
passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        //Find the user associated with the email provided by the user
        const user = await UserModel.findOne({ email });
        if (!user) {
          //If the user isn't found in the database, return a message
          return done('Email or Password not valid', false);
        }
        //Validate password and make sure it matches with the corresponding hash stored in the database
        //If the passwords match, it returns a value of true.
        const validate = await user.isValidPassword(password);
        if (!validate) {
          return done('Email or Password not valid', false);
        }
        //Send the user information to the next middleware
        return done(null, user, { message: 'Logged in success' });
      } catch (error) {
        return done(error);
      }
    }
  )
);
