import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  ChartConfiguration, ChartType,  } from 'chart.js';
import { IonicModule } from '@ionic/angular';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
export class BarChartComponent implements OnInit  {
 @ViewChild('barChart', { static: true }) barChart!: ElementRef;

  chart: any;

  // Datos de ejemplo para la gráfica
  chartData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [{
      label: 'Ventas 2024',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 205, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 205, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  };

  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'Reporte de Ventas Mensual'
    },
    legend: {
      display: true,
      position: 'top'
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: function(value: any) {
            // Puedes personalizar el formato aquí, por ejemplo agregar el símbolo $
            return '$' + value;
          }
        }
      }]
    }
  };

  constructor() { }

  ngOnInit() {
    this.createChart();
  }

  createChart() {
    const ctx = this.barChart.nativeElement.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: this.chartData,
      options: this.chartOptions
    });
  }

  // Método para actualizar los datos de la gráfica
  updateChartData() {
    // Ejemplo de datos aleatorios
    const newData = Array.from({length: 6}, () => Math.floor(Math.random() * 20));
    this.chart.data.datasets[0].data = newData;
    this.chart.update();
  }

  // Método para cambiar el tipo de gráfica
  changeChartType(type: string) {
    this.chart.config.type = type;
    this.chart.update();
  }
}
