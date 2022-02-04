import { Component, OnInit, Input } from '@angular/core';
import { Chart, ChartType, registerables } from 'node_modules/chart.js';
Chart.register(...registerables);
import { GeneralServicesService } from '../general-services.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  @Input() selectedStock: any;
  constructor(    public _gs: GeneralServicesService  ) { }

  temp: any;
  isLoading: boolean = false;
  isInc: boolean = true;
  f_t : any[] = [];
  d_t = [];
  items: any;
  chart_index: boolean[] = [false,false,false,false];  
  times: number[] = [];
  charts: any[] = [];
  selectedIndex: number = 0;

  ngOnInit() {

    this.items = {
      "symbol" : "AAPL",
      "res" : 5,
      "from" : "1631022248",
      "to" : "1631627048"
    };

    this._gs.selectedStock
            .subscribe(data => { 
                                  if(data != null){
                                      this.selectedStock = data;
                                      console.log(data);
                                      this.items.symbol = this.selectedStock.symbol;
                                      console.log(this.items);
                                      this.setDates();
                                      this.getCandle(this.selectedIndex);
                                      this.charts.forEach((obj) => obj.destroy()); 
                                      this.chart_index = [false];
                                  }
                                })

    
    

  }

  setDates(){

        const today = new Date();
        const yesterday = new Date(today);
        const last_five_day = new Date(today);
        const one_month = new Date(today);
        const one_year = new Date(today);
    
        yesterday.setDate(yesterday.getDate() - 1)
        this.times[0] = Math.floor(yesterday.getTime() / 1000);
        console.log(Math.floor(yesterday.getTime() / 1000));
        console.log(Math.floor(today.getTime() / 1000));
        last_five_day.setDate(last_five_day.getDate() - 5)
        this.times[1] = Math.floor(last_five_day.getTime() / 1000);
        one_month.setMonth(one_month.getMonth() - 1)
        this.times[2] = Math.floor(one_month.getTime() / 1000);
        one_year.setFullYear(one_year.getFullYear() - 1)
        this.times[3] = Math.floor(one_year.getTime() / 1000);
        this.times[4] = Math.floor(today.getTime() / 1000); 
        console.log(this.times); 
    }

  getCandle(e:number)
  {
    console.log(e);
    this.isLoading = true;
    this.items.from = this.times[e];
    this.items.to = this.times[4];
    this._gs.getPriceChart(this.items)
            .subscribe(data => 
            { 
              this.temp = data; 
              if(this.temp != null)
              {
                this.temp["t"].forEach((obj:any,index:any) => {
                  let ua = new Date(obj * 1000);
                  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                  let year = ua.getFullYear();
                  let month = months[ua.getMonth()];
                  let date = ua.getDate();
                  let hours = ua.getHours();
                  let minutes = "0" + ua.getMinutes();
                  let seconds = "0" + ua.getSeconds();
                  this.f_t[index] = date + ' ' + month + ' ' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                });
                this.d_t = this.temp["c"];
                console.log(Number(this.temp["h"][0]));
                console.log( Number(this.temp["h"][this.temp["h"].length - 1]));
                console.log(Number(this.temp["h"][0]) > Number(this.temp["h"][this.temp["h"].length - 1]));
                if(Number(this.temp["h"][0]) > Number(this.temp["h"][this.temp["h"].length - 1]))
                {
                  this.createChart(e,0);
                }
                else
                {
                  console.log("Up");
                  this.createChart(e,1);
                }
                
              }  
    });
  }

  myTabSelectedIndexChange(index: number) {
    this.selectedIndex = index;
    switch(index){
      case 0 : this.items.res = 5; break;
      case 1 : this.items.res = 15; this.getCandle(1); break;
      case 2 : this.items.res = 60; this.getCandle(2); break;
      case 3 : this.items.res = 'D'; this.getCandle(3); break;
    }
  } 

  createChart(e:number,color:number)
  {

    let f = e + 1;
    if(!this.chart_index[e])
    { 
      if(color == 1)
      {
        this.chart_index[e] = true;
        const myChart = new Chart("myChart"+f, {
        type: 'line' as ChartType,
        data: {
            labels: this.f_t,
            datasets: [{
                label: 'Price',
                data: this.d_t,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(131, 250, 95, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                fill: false,
                cubicInterpolationMode: 'monotone',
                tension: 0.4
                  
            }]
        },
        options : {
          scales: {
              x: {
                  grid: {
                      display:false
                  }
              },
              y: {
                  grid: {
                      display:false
                  }   
              }
          }
        }

        });
        this.isLoading = false;
        this.charts[e] = myChart;
      }
      else
      {
        this.chart_index[e] = true;
        const myChart = new Chart("myChart"+f, {
        type: 'line' as ChartType,
        data: {
            labels: this.f_t,
            datasets: [{
                label: 'Price',
                data: this.d_t,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 80, 80, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                fill: false,
                cubicInterpolationMode: 'monotone',
                tension: 0.4
                  
            }]
        },
        options : {
          scales: {
              x: {
                  grid: {
                      display:false
                  }
              },
              y: {
                  grid: {
                      display:false
                  }   
              }
          }
        }

        });
        this.isLoading = false;
        this.charts[e] = myChart;
      }
    //myChart.destroy();
    }

    }


}
