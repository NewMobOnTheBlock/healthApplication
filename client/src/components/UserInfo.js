import React, { useState, useEffect, useCallback } from 'react';
import '../styles/UserInfo.css';

function showNotification() {
  document.querySelector('.added').style.display = 'inline';
  document.querySelector('.added').classList.add('slide-in');
  setTimeout(() => {
    document.querySelector('.added').classList.remove('slide-in');
    document.querySelector('.added').style.display = 'none';
  }, 2000);
}

function showInputField() {
  let userInputField = document.getElementById("userInputField");
  if (userInputField.style.display === "none") {
    userInputField.style.display = "block";
  } else {
    userInputField.style.display = "none";
  }
}

function UserInfo(props) {
  const { userId } = props;
  const [users, setUsers] = useState([]);

  const fetchUserInfo = useCallback(() => {
    fetch(`/user/${userId}`)
      .then(res => res.json())
      .then((users) => setUsers(users))
      .catch((err) => console.log(err));
  }, [userId]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo])

  function addWeightToDb() {
    const kilograms = document.getElementById("weight").value;
    const itemObject = {
      userId,
      date: new Date(),
      kilograms
    };

    const fetchObj = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(itemObject)
    };
  
    fetch('/weight', fetchObj)
      .then(() => fetchUserInfo());
    showNotification();
  }

  return (
    <div>
      {users.map((user, index) => (
        <>
        <p className="welcome">
          Hello, <span className="name">{user.name}</span>
        </p>
        <div className="userinfo" key={index}>
          <p className="userHeight">
            <strong>Height:</strong> {user.height}
          </p>
          <p className="userWeight">
            <strong>Weight:</strong> {user.kilograms} kg
            <input type="image" className="adjust-btn" onClick={() => showInputField()}
              src="https://img.icons8.com/ios/50/000000/pencil-tip.png" alt="edit weight" />
          </p>
          <div id="userInputField" style={{ display: "none" }}>
            <input type="text" id="weight" className="weight-input" placeholder="0" />
            <button type="button" className="add-weight-btn" onClick={() => addWeightToDb()}>Submit</button>
            <span className="added slide-in">Added!</span>
          </div>
          <p className="userBMI">
            <strong>BMI:</strong> {((user.kilograms) / (((user.height / 100)) * (user.height / 100))).toFixed(1)}
          </p>
          <p className="userGoal">
            <strong>Daily Goal:</strong> {user.daily_goal} kcal
            {/* <input type="image" className="adjust-btn" onClick={() => console.log('change goal')}
              src="https://img.icons8.com/ios/50/000000/pencil-tip.png" alt="edit goal" /> */}
          </p>
        </div>
        </>
      ))}
    </div>
  );
}

export default UserInfo;
