import React, { Component } from 'react';
import * as Tone from 'tone';
import { createChartJS } from './helpers';
import data from './data/increasingTrend.json';
import sonifier, { resetSonifier } from '../../dist';

import './Graph.css';

class Graph extends Component {
  constructor(props) {
    super(props);
    this.settings = {
      fillColor: 'steelblue',
      chartType: 'line',
      data,
      title: 'Vegetables Eaten By Ather Per Year',
      xKey: 'year',
      yKey: 'value',
    };
    this.data = {
      x: data.map((d) => d[this.settings.xKey]),
      y: data.map((d) => d[this.settings.yKey]),
    };
    this.oscillations = [];
  }

  componentDidMount() {
    this.createChart();
  }

  createChart = () => {
    const chartContainer = document.getElementById('chart');

    if (chartContainer) {
      chartContainer.innerHTML = '';

      return createChartJS(this.settings);
    } else {
      this.createChart();
    }
  };

  playSonification = () => {
    resetSonifier(Tone, this.oscillations);

    const settings = {
      soundType: 'OmniOscillator',
      oscillator: {
        sourceType: 'am',
        baseType: 'square',
        partialCount: 8,
      },
    };

    this.oscillations = sonifier(Tone, this.data, settings);
  };

  render() {
    return (
      <div id="graph">
        <h1>{this.settings.title}</h1>
        <canvas id="chart" tabIndex="0" role="img" />
        <button onClick={this.playSonification}>Play Sonification</button>
      </div>
    );
  }
}

export default Graph;
