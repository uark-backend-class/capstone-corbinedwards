const Restaurant = require("../models/restaurants");

const restaurants = [
  { id: 1, name: "Catfish City", menu: ["Catfish Soup", "Beans & Toast"] }
];

module.exports.getAll = async () => {
  return await Restaurant.find({});
};

module.exports.getOne = async (id) => {
  let getRestaurant = await Restaurant.findById(id).exec();
  return getRestaurant;
};

module.exports.addOne = async (postRestaurant) => {
  const getRestaurant = await Restaurant.findOne({ name: postRestaurant.restaurantName }).exec();
  let newRestaurant = (getRestaurant) ? getRestaurant : new Restaurant();
  
  console.log(getRestaurant);

  newRestaurant.name = postRestaurant.restaurantName ;
  newRestaurant.location = { lat: postRestaurant.lat, lng: postRestaurant.lng };
  newRestaurant.menu = postRestaurant.menuItems.split(",");

  console.log(newRestaurant);

  const savedRestaurant = await newRestaurant.save();
  
  if(savedRestaurant) {
    return savedRestaurant;
  }
  else {
    return {};
  }
};
