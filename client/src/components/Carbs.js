import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import moment from 'moment';

function CarbGraph(props) {
  const [data,setData] = useState([])
  const id = props.id;
  //id added on line 8 and 11
  useEffect(()=> {
    axios.get(`/carb/${id}`).then(res => {
      const nutritionalValue = res.data;
      let labels = [];
      let data = [];
      nutritionalValue.forEach(element => {
        labels.push(moment(element.date).format('DD-MM-YYYY'))
        data.push(element.sum)
      })

      setData({
        Data: {
          labels: labels,
          datasets: [
            {
              label: "Carb intake",
              data: data,
              pointRadius: 4,
            pointBorderColor: 'rgba(54, 162, 235, 1)',
            pointHoverBackgroundColor: 'rgba(54, 162, 235, 1)',
            pointHoverRadius: 8,
            backgroundColor: [
              'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 2
            }]
        },
      })
    })
  },[])

    return (
      <div className="graphAnalytics">
        <Line data={data.Data}
          options={{
            title: {
              display: true,
              text: 'Carb intake per day',
              fontSize: 20
            },
            legend: {
              display: true,
              position: 'right'
            },
            scales: {
              xAxes: [{
                type: 'time',
                time: {
                  parser: 'DD-MM-YYYY',
                  unit: 'day',
                  unitStepSize: 1,
                  displayFormats: {
                    day: 'DD-MM-YYYY'
                  },
                },
                ticks: {
                  source: 'data',
                  autoSkip: false,
                  minRotation: 45,
                  fontSize: 14,
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Day',
                  fontSize: 20,
                }
              }],
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  fontSize: 14,
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Number of carbs',
                  fontSize: 20
                }
              }]
            }
          }} />
      </div>
    )
}

export default CarbGraph;
