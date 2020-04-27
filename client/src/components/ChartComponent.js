import React, { Component } from 'react';
import Chart from "chart.js"

class ChartComponent extends Component {

  constructor(props){
    super(props)
    this.state = { chart : null }
  }

chart = React.createRef();

  componentDidMount(){
    const myChartRef = this.chart.current.getContext("2d");
    // pass chartData to Chart below as this.props.chartData
    let theChart = new Chart(myChartRef, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "March"],
        datasets: [
          {
            data: this.state.chartData,
            backgroundColor: "#fff"
          }
        ]
      },
      options: {
        responsive: true,
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                color: "#535356"
              },
              ticks: {
                fontColor: "#87889C"
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                color: "#535356"
              },
              ticks: {
                fontColor: "#87889C"
              }
            }
          ]
        }
      }
    });
    // set chart to state
    this.setState({ chart: theChart })
  }

  componentWillReceiveProps(nextProps, nextContext) {
    // update chart according to prop change
      this.state.chart.data.datasets.forEach((dataset) => {
        dataset.data.push(nextProps.chartData);
      });
      this.state.chart.update();
  }

  render(){
    return (
        <canvas id="myChart" ref={this.chart} />
    );
  }

};

export default ChartComponent;