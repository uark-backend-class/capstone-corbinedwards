const restaurants = [
  { id: 1, name: "Catfish City", menu: ["Catfish Soup", "Beans & Toast"] }
];

module.exports.getAll = () => {
  return restaurants;
};

module.exports.getOne = id => {
  let getRestaurant;
  for (r of restaurants) {
    if (r.id == id) {
      getRestaurant = r;
    }
  }
  return getRestaurant;
};

module.exports.addOne = postRestaurant => {
  let newID = 0;
  let newRestaurant = {
    id: 0,
    name: "",
    menu: []
  };

  if (postRestaurant) {
    for (r of restaurants) {
      if (r.id > newID) newID = r.id;
    }
    newID += 1;

    newRestaurant.id = newID;
    newRestaurant.name = postRestaurant.name;
    newRestaurant.menu = [];

    restaurants.push(newRestaurant);

    return restaurants;
  }
};
