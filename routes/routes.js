const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const User = require('../models/user');

const restaurantController = require('../controllers/restaurants-controller');

router.get('/', (req, res) => {
  res.render('home', {layout: 'index'});
});

router
  .route('/login')
  .get((req, res) => {
    res.render('login', {layout: 'index'});
  })
  .post(passport.authenticate('local', { failureRedirect: '/login'}), (req, res, next) => {
    console.log('Authenticated');
    res.redirect('/' + req.user.username + '/profile');
  });

router
  .route('/signup')
  .get((req, res) => {
    res.render('signup', {layout: 'index'});
  })
  .post((req, res, next) => {
    User.register(new User({username: req.body.username}), req.body.password, function(err) {
      if (err) {
        console.log('error while resgistering user!', err);
        return next(err);
      }
      
      console.log('user registered!');
    });
  });

router
  .route('/:username/profile')
  .get((req, res, next) => {
    if(req.isAuthenticated()) {
      res.render('profile', {layout: 'index', username: req.params.username});
    }
    else {
      res.redirect('/login');
    }
  })
  .post((req, res) => {
    req.logout();
    res.redirect('/');
  });

router
  .route('/restaurants')
  .get((req, res) => {
    const restaurants = restaurantController.getAll();
    res.send(restaurants);
  })
  .post((req, res) => {
    console.log(req.body);
    if (req.body) {
      const newRestaurant = restaurantController.addOne(req.body);
      res.json(newRestaurant);
    } else {
      res.sendStatus(404);
    }
  });

router.get('/restaurants/:id', (req, res) => {
  const restaurant = restaurantController.getOne(req.params.id);

  if (restaurant) {
    res.send(restaurant);
  } else {
    res.sendStatus(404);
  }
});

router.get("*", (req, res) => {
  res.render('404', { layout: 'index' });
});

module.exports = router;
