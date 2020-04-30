const { pool } = require('./config');

function userDataParse(data) {
  if (data.length) {
    return {
      isAuthenticated: true,
      id: data[0].id,
      goal: data[0].daily_goal
    }
  } else {
    return {
      isAuthenticated: false,
      message: "Wrong email or password, please try again"
    }
  }
}

const getUsers = (request, response) => {
  const email = request.params.email;
  const pass = request.params.pass;

  pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, pass], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(userDataParse(results.rows))
  })
};

const getUser = (request, response) => {
  const id = request.params.id;
  pool.query('SELECT date, name, daily_goal, height, kilograms FROM users INNER JOIN weight on users.id = weight.users_id WHERE users.id = $1 ORDER BY date DESC LIMIT 1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json((results.rows))
  })
};

const addUser = (request, response) => {
  const { password, email, height, goal, name, diet, username, weight } = request.body;
  // console.log(username, password);
  // const info = [ 'newuser', 'newpass'];
  pool.query('INSERT INTO users (password, email, height, daily_goal, name, diet, username) VALUES ($1, $2, $3, $4, $5, $6, $7)', 
  [password, email, height, goal, name, diet, username], error => {
    pool.query('INSERT INTO weight (kilograms, date, users_id) VALUES ($1, $2, (select id from users where email = $3))', 
    [weight, new Date(), email], error => {
      if (error) {
        throw error
      }
      response.status(201).json({ status: 'success', message: 'User added.' })
    })
  })
};
//'INSERT INTO weight (users_id, date, kilograms) VALUES ($1, $2, $3)'
const addWeight = (request, response) => {
  const { userId, kilograms  } = request.body;
  pool.query('INSERT INTO weight (users_id, date, kilograms) VALUES ($1, $2, $3) ON CONFLICT ON CONSTRAINT weightdateconstraint DO UPDATE SET kilograms = $3', 
  [userId, new Date(), kilograms], error => {
    if (error) {
      throw error
    }
    response.status(201).json({ status: 'success', message: 'Weight added.' })
  })
};

const addMeals = (request, response) => {
  const { foodName, kcal, servingQ, servingUnit, gramsUnit, carbs, userId, meal, units, kcalIntake, carbIntake, date, fat, fatIntake, proteins, proteinIntake } = request.body;
  pool.query('INSERT INTO ingredients (food_name, kcal, serving_q, serving_unit, grams_unit, carbs, fat, proteins) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT ON CONSTRAINT constraintname DO NOTHING', [foodName, kcal, servingQ, servingUnit, gramsUnit, carbs, fat, proteins], error => {

    pool.query('INSERT INTO meals (meal, units, kcal_intake, carb_intake, date, users_id, ingredients_id, fat_intake, protein_intake) VALUES ($1, $2, $3, $4, $5, $6, (select id from ingredients where food_name = $7), $8, $9)', 
    [meal, units, kcalIntake, carbIntake, date, userId, foodName, fatIntake, proteinIntake], error => {
      if (error) {
        throw error
      }
      response.status(201).json({ status: 'success', message: 'Ingredient and meal added'})
    });
  });
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

const deleteMeal = (request, response) => {
  const id = request.params.id;
  pool.query('DELETE from meals where id = $1', [id], (error, results) => {
    if(error) {
      throw error
    }
    response.status(200).json({message: 'Meal deleted'})
  });
}

const getDailyCalories = (request, response) => {
  const id = request.params.id;
  const date = request.params.date
  pool.query('SELECT * from meals INNER JOIN ingredients on meals.ingredients_id = ingredients.id WHERE meals.users_id = $1 AND meals.date = $2', [id, date], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(calculateIntakes(results.rows))
  })
};
// .map(a => a.kcal_intake).reduce((a, b) => a + b, 0))
function calculateIntakes(results) {
  let kcal = 0;
  let fat = 0;
  let proteins = 0;
  let carbs = 0;
  for (let i=0; i<results.length; i+=1) {
    kcal += results[i]["kcal_intake"];
    fat += results[i]["fat_intake"];
    carbs += results[i]["carb_intake"];
    proteins += results[i]["protein_intake"];
  }
  return { kcal, carbs, fat, proteins};
}
// .map(a => a.kcal_intake).reduce((a, b) => a + b, 0))
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

const getUserCarbs = (request, response) => {
  const id = request.params.id;
  const date = request.params.date
  pool.query('SELECT date, sum(carb_intake) FROM meals GROUP BY date, users_id HAVING users_id= $1 ORDER BY date ASC', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json((results.rows))
  })
};
const getUserFat = (request, response) => {
  const id = request.params.id;
  const date = request.params.date
  pool.query('SELECT date, sum(fat_intake) FROM meals GROUP BY date, users_id HAVING users_id= $1 ORDER BY date ASC', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json((results.rows))
  })
};

const getUserProteins = (request, response) => {
  const id = request.params.id;
  const date = request.params.date
  pool.query('SELECT date, sum(protein_intake) FROM meals GROUP BY date, users_id HAVING users_id= $1 ORDER BY date ASC', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json((results.rows))
  })
};

const getUserWeight = (request, response) => {
  const id = request.params.id;
  const date = request.params.date
  pool.query('SELECT date, sum(kilograms) FROM weight GROUP BY date, users_id HAVING users_id= $1 ORDER BY date ASC', [id], (error, results) => {
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
  
  pool.query('SELECT meals.id, meals.meal, meals.ingredients_id, ingredients.food_name, meals.units, meals.kcal_intake, meals.users_id, meals.date, meals.fat_intake, meals.protein_intake, meals.carb_intake, ingredients.kcal, ingredients.serving_q, ingredients.serving_unit, ingredients.grams_unit from meals INNER JOIN ingredients on meals.ingredients_id = ingredients.id WHERE meals.users_id = $1 AND meals.date = $2 AND meals.meal = $3', [id, date, meal], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
};


module.exports = {
  getUsers,
  getUser,
  addUser,
  addWeight,
  addMeals, 
  getAllMeals,
  deleteMeal, 
  getDailyCalories,
  getUserCalories,
  getUserCarbs,
  getUserProteins,
  getUserFat,
  getUserWeight,
  getMeals
}
