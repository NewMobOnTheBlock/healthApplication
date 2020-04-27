import React, { Component } from 'react';
const moment = require('moment');

class UserInfo extends Component {
  state = {
    users: []
  }
  componentDidMount() {
    fetch('/user/9')
      .then(res => res.json())
      .then((data) => {
        this.setState({ users: data })
      })
      .catch(console.log)
  }

  render() {

    return (
      <div className="userInfo">
        <h1>Meal Diary</h1>
        {this.state.users.map((user, index) => (
          <div className="userWrapper">
            <p className="userName">Name: {user.name}</p>
            <p className="userWeight">Weight: {user.kilograms} kg</p>
            <p className="userGoal">BMI: 22.3 kcal</p>
            <p className="userDate">Date: {moment(user.date).format('DD-MM-YYYY')}</p>
            <p className="userGoal">Daily Goal: {user.daily_goal} kcal</p>
          </div>
        ))}
      </div>
    );
  }
}

export default UserInfo;