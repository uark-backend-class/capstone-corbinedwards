const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const User = require('../models/user');
const Restaurant = require('../models/restaurants');

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
      res.redirect('/login');
    }
  })
  .post(async (req, res) => {
    if(req.body.type === "Restaurants") {
      const restaurants = await restaurantController.getAll();
      res.json(restaurants);
    }
    else if(req.body.type === "MenuItem") {
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
  .route('/editrestaurant(/:restaurantID)?')
  .get(async (req, res) => {
    if(req.isAuthenticated() && req.user.premium) {
      let restaurantEdit = new Restaurant({ name: '', location: { lat: '', lng: '' }, menu: [] });
      
      if(req.params.restaurantID) {
        const restaurantGet = await restaurantController.getOne(req.params.restaurantID);
        if (restaurantGet) restaurantEdit = restaurantGet;
      }
      
      res.render('editRestaurant', { layout: 'index', mapSource: googleMapsSource, restaurantEdit: restaurantEdit });  
    }
    else {
      res.redirect('/login');
    }
  })
  .post(async (req, res) => {
    if (req.body) {
      const newRestaurant = await restaurantController.addOne(req.body);
      
      if(newRestaurant) {
        res.redirect('/success');
      }
      else {
        res.sendStatus(404);
      }

    } else {
      res.sendStatus(404);
    }
  });

router.get('/success', (req, res) => {
  res.render('success', { layout: 'index' });  
});

router.get("*", (req, res) => {
  res.render('404', { layout: 'index' });
});

module.exports = router;
