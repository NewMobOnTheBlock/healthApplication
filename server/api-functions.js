const fetch = require('node-fetch');
require('dotenv').config();

const searchUrl = 'https://trackapi.nutritionix.com/v2/search/instant';
const appId = process.env.APP_ID;
const appKey = process.env.APP_KEY;

// helper function parsing data for general search
function parseData(data) {
  const common = data.common.map((food) => {
    return {
      foodName: food['food_name'],
      servingUnit: food['serving_unit'],
      servingQ: food['serving_qty'],
      photo: food.photo,
    }
  });

  const branded = data.branded.map((food) => {
    return {
      nixItemId: food['nix_item_id'],
      foodName: food['food_name'],
      brandName: food['brand_name'],
      servingUnit: food['serving_unit'],
      servingQ: food['serving_qty'],
      calories: food['nf_calories'],
      carbs: food['nf_total_carbohydrate'],
      photo: food.photo,
    }
  });

  return { common, branded };
}
//helper function parsing one common product data
function parseCommonItem(data) {
  const product = data.foods[0];
    return {
      foodName: product['food_name'],
      servingUnit: product['serving_unit'],
      servingQ: product['serving_qty'],
      gramsUnit: product['serving_weight_grams'],
      kcal: product['nf_calories'],
      carbs: product['nf_total_carbohydrate'],
      photo: product.photo['thumb']
    }
}
//helper function parsing one branded product data
function parseBrandedItem(data) {
  const product = data.foods[0];
    return {
      foodName: product['food_name'],
      servingUnit: product['serving_unit'],
      servingQ: product['serving_qty'],
      gramsUnit: product['serving_weight_grams'],
      kcal: product['nf_calories'],
      carbs: product['nf_total_carbohydrate'],
      photo: product.photo['thumb'],
      nixItemId: product['nix_item_id'],
      brandName: product['brand_name']
    }
}
// products search - returns list of products
function fetchSearch(req, res) {
  const query = req.params.query;
  const queryUrl = searchUrl + '?query=' + query;

  const fetchObj = {
    method: 'GET',
    headers: {
      'x-app-id': appId,
      'x-app-key': appKey
    }
  };
  
  fetch(queryUrl, fetchObj)
    .then((data) => data.json())
    .then((data) => res.json(parseData(data)));
}
// fetch for one product
function fetchItem(req, res) {
  const type = req.params.type;
  const query = req.params.name;

  const commonObj = {
    method: 'POST',
    headers: {
      'x-app-id': appId,
      'x-app-key': appKey,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ query })
  };

  const brandedObj = {
    method: 'GET',
    headers: {
      'x-app-id': appId,
      'x-app-key': appKey
    }
  }
  
  const commonUrl = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
  const brandedUrl = 'https://trackapi.nutritionix.com/v2/search/item';

  if (type === 'common') {
    fetch(commonUrl, commonObj)
      .then((data) => data.json())
      .then((data) => res.json(parseCommonItem(data)));
  } else {
    const idUrl = brandedUrl + '?nix_item_id=' + query;
    fetch(idUrl, brandedObj)
      .then((data) => data.json())
      .then((data) => res.json(parseBrandedItem(data)));
  }
}

module.exports = {
  fetchSearch,
  fetchItem
}