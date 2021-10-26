const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const User = require('../models/user');

const recipeController = require('../controllers/recipe-controller');
const restaurantController = require('../controllers/restaurants-controller');
const googleMapsSource = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_KEY}&libraries=places&callback=initMap`

router.get('/', (req, res) => {
  res.render('home', {layout: 'index'});
});

router
  .route('/login')
  .get((req, res) => {
    if(req.isAuthenticated()) {
      res.redirect('/' + req.user.username + '/profile');
    }
    else {
      res.render('login', {layout: 'index'});
    }
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
    User.register(new User({username: req.body.username, premium: false}), req.body.password, function(err) {
      if (err) {
        console.log('error while resgistering user!', err);
        return next(err);
      }
      
    });
    console.log('user registered!');
    res.redirect('/' +req.body.username + '/profile');
  });

router
  .route('/:username/profile')
  .get((req, res) => {
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
  .route('/app')
  .get((req, res) => {
    if(req.isAuthenticated()) {
      const hideControls = req.user.premium ? "display:inline;" : "display:none;";
      res.render('app', {layout: 'index', mapSource: googleMapsSource, hidePremiumControls: hideControls});
    }
    else {
      res.redirect('login');
    }
  })
  .post(async (req, res) => {
    if(req.body.type === "MenuItem") {
      const menuItems = await recipeController.getMenuItems(req.body.params);
      res.json(menuItems);
    }
    else if(req.body.type === "Recipes") {
      const recipeItems = await recipeController.getRecipeItems(req.body.params);
      res.json(recipeItems);
    }
    else {
      res.send({});
    }
  })
  .put(async (req, res) => {
    if(req.isAuthenticated()) {
      if(req.body) {
        await recipeController.addRecipe(req.user, req.body);
        res.sendStatus(200);
      }
      else {
        res.sendStatus(502);
      };
    }
    else {
      res.redirect('login');
    }
  });

router
  .route('/editrestaurant/(:restaurantID)?')
  .get((req, res) => {
    if(req.isAuthenticated() && req.user.premium) {
      //TODO: load restaurant from param
      let restaurantEdit = { restaurantName: '', location: { lat: '', lng: '' } };
      if(req.params.restaurantID)
      res.render('editRestaurant', {layout: 'index', mapSource: googleMapsSource});  
    }
    else {
      res.redirect('/login');
    }
  })
  .post(async (req, res) => {
    if (req.body) {
      const newRestaurant = await restaurantController.addOne(req.body);
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
