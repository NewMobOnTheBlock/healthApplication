import React from 'react';
import Goalcal from './Goalcal';
import MealSection from './MealSection';

function Dashboard() {
  return (
    <main className="dashboard">
      <header className="date-header">
        <div className="back">{'<'}</div>
        <h1>Today</h1>
        <div className="next">{'>'}</div>
      </header>
      <Goalcal userId='9' date="2020-04-25"/>
      <MealSection meal="breakfast" userId="9" date="2020-04-25"/>
      <MealSection meal="lunch" userId="9" date="2020-04-25"/>
      <MealSection meal="dinner" userId="9" date="2020-04-25"/>
    </main>
  )
}

export default Dashboard;