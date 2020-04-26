const { pool } = require('./config');

const addMeals = (request, response) => {
  const { foodName, kcal, servingQ, servingUnit, gramsUnit, userId, meal, units, kcalIntake, date } = request.body;

  pool.query('INSERT INTO ingredients (food_name, kcal, serving_q, serving_unit, grams_unit) VALUES ($1, $2, $3, $4, $5) ON CONFLICT ON CONSTRAINT foodNameConstraint DO NOTHING', [foodName, kcal, servingQ, servingUnit, gramsUnit], error => {

    pool.query('INSERT INTO meals (meal, units, kcal_intake, date, users_id, ingredients_id) VALUES ($1, $2, $3, $4, $5, (select id from ingredients where food_name = $6))', 
    [meal, units, kcalIntake, date, userId, foodName], error => {
      if (error) {
        throw error
      }
      response.status(201).json({ status: 'success', message: 'Ingredient and meal added'})
    });
  });
};

const getUsers = (request, response) => {
  const id = request.params.id;
  pool.query('SELECT date, name, daily_goal, kilograms FROM users INNER JOIN weight on users.id = weight.users_id WHERE users.id = $1 ORDER BY date DESC LIMIT 1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json((results.rows))
  })
};

const addUser = (request, response) => {
  const { username, password, email, height, daily_goal, name, diet  } = request.body;
  console.log(username, password);
  // const info = [ 'newuser', 'newpass'];
  pool.query('INSERT INTO users (username, password, email, height, daily_goal, name, diet) VALUES ($1, $2, $3, $4, $5, $6, $7)', 
  [username, password, email, height, daily_goal, name, diet], error => {
    if (error) {
      throw error
    }
    response.status(201).json({ status: 'success', message: 'User added.' })
  })
};



const getAllMeals = (request, response) => {
  const { userId, date } = request.body;
  pool.query('SELECT * from meals INNER JOIN ingredients on meals.ingredients_id = ingredients.id WHERE meals.users_id = $1 AND meals.date = $2', [userId, date], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
};

const getDailyCalories = (request, response) => {
  const id = request.params.id;
  const date = request.params.date
  pool.query('SELECT * from meals INNER JOIN ingredients on meals.ingredients_id = ingredients.id WHERE meals.users_id = $1 AND meals.date = $2', [id, date], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json((results.rows).map(a => a.kcal_intake).reduce((a, b) => a + b, 0))
  })
};

const getUserCalories = (request, response) => {
  const id = request.params.id;
  const date = request.params.date
  pool.query('SELECT date, sum(kcal_intake) FROM meals GROUP BY date, users_id HAVING users_id= $1 ORDER BY date ASC', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json((results.rows))
  })
};

const getMeals = (request, response) => {
  const id = request.params.id;
  const meal = request.params.meal;
  const date = request.params.date;
  
  pool.query('SELECT * from meals INNER JOIN ingredients on meals.ingredients_id = ingredients.id WHERE meals.users_id = $1 AND meals.date = $2 AND meals.meal = $3', [id, date, meal], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
};

module.exports = {
  getUsers,
  addUser,
  addMeals, 
  getAllMeals, 
  getDailyCalories,
  getUserCalories,
  getMeals
}
