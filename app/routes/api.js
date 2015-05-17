var User = require('../models/user.js');
var jwt = require('jsonwebtoken');
var config = require('../../config.js');

// Server-side secret for creating web tokens
var superSecret = config.secret;

module.exports = function(app, express) {
  // Set up instance of Express Router
  var apiRouter = express.Router();

  apiRouter.post('/authenticate', function(req, res) {
    console.log(req.body);
    User.findOne({
      username: req.body.username
    }).select('name username password').exec(function(err, user) {
      if (err) { throw err; }

      // If no user found
      if (!user) { 
        res.json({
          success: false,
          message: 'Authentication failed. User not found.'
        })
      } else if (user) {
        // If no password submitted, set it to blank
        // Undefined will give a bCrypt error
        req.body.password = req.body.password || "";
        // Check pw match
        var validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          })
        } else {
          // if user found and password correct
          var token = jwt.sign({
              name: user.name,
              username: user.username
            }, superSecret, {
              expiresInMinutes: 1440 // 24 hrs
            });

          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        }
      }
    });
  });

  // Middleware for all API requests
  // Authenticating token
  apiRouter.use(function(req, res, next) {
    console.log('Someone just came to our app!');

    // Use the token whether it comes from the POST params, URL params, or as an HTTP header
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    if (token) {
      // verifies secret and checks expiration
      jwt.verify(token, superSecret, function(err, decoded) {
        if (err) {
          return res.status.send({
            success: false,
            message: 'Failed to authenticate token.'
          });
        } else {
          req.decoded = decoded; // If good, save to request for use in other routes
          // decoded is the user. We use this in the /api/me route.

          next();
        }
      })
    } else {
      // If no token
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }
  });

  // Test route to make sure everything is working
  // GET http://localhost:8080/api
  apiRouter.get('/', function(req, res) {
    res.json({ message: 'Hooray! Welcome to our API!' });
  });

  // Routes for /users
  apiRouter.route('/users')
    // POST /api/users -- users#create
    .post(function(req, res) {
      // Create new instance of the User model
      var user = new User();

      // Set user info from the request
      user.name = req.body.name;
      user.username = req.body.username;
      user.password = req.body.password;

      user.save(function(err) {
        if (err) {
          // Handle duplicat entry
          if (err.code == 11000) {
            return res.json({ success: false, message: 'Username already exists'})
          } else {
            return res.send(err);
          }
        }

        res.json({ message: 'User created!' });
      });
    })

    // GET /users -- users#index
    .get(function(req, res) {
      User.find(function(err, users) {
        if (err) res.send(err);

        // Return users
        res.json(users);
      })
    });

  apiRouter.route('/users/:user_id')
    // GET /users/:user_id -- users#show
    .get(function(req, res) {
      User.findById(req.params.user_id, function(err, user) {
        if (err) { res.send(err); }

        res.json(user);
      })
    })
    .put(function(req, res) {
      // Update user by the user_id given
      User.findById(req.params.user_id, function(err, user) {
        if (err) { res.send(err); }

        // If testing via Postman, do it via x-www-form-urlencoded
        // Update info only if it's new
        if (req.body.name) { user.name = req.body.name; }
        if (req.body.username) { user.username = req.body.username; }
        if (req.body.password) { user.password = req.body.password; }

        console.log(user);
        user.save(function(err) {
          if (err) { res.send(err); }
        })

        res.json({ message: 'User updated!' });
      })
    })
    .delete(function(req, res) {
      User.remove({ _id: req.params.user_id, }, function(err, user) {
        if (err) { return res.send(err) }

        res.json({ message: 'Successfully deleted.' })
      });
    });

  apiRouter.get('/me', function(req, res) {
    res.send(req.decoded);
  });

  return apiRouter;
};
