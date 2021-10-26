const Restaurant = require("../models/restaurants");

const restaurants = [
  { id: 1, name: "Catfish City", menu: ["Catfish Soup", "Beans & Toast"] }
];

module.exports.getAll = () => {
  return restaurants;
};

module.exports.getOne = async (id) => {
  let getRestaurant = await Restaurant.findById(id).exec();
  return getRestaurant;
};

module.exports.addOne = async (postRestaurant) => {
  let newRestaurant = await Restaurant.findOne({ name: postRestaurant.name }).exec();
  if(newRestaurant) return {};
  newRestaurant = new Restaurant({ name: postRestaurant.restaurantName });
  newRestaurant.location = { lat: postRestaurant.lat, lng: postRestaurant.lng }
  newRestaurant.menu = postRestaurant.menuItems.split(",");

  const savedRestaurant = await newRestaurant.save();
  
  if(savedRestaurant) {
    return savedRestaurant;
  }
  else {
    return {};
  }
};
