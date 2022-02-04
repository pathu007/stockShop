import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders ,HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})


export class GeneralServicesService {
    private url = 'https://finnhub.io/api/v1';

    private selectedStocks = new BehaviorSubject<any>(null);
    selectedStock = this.selectedStocks.asObservable();

    constructor( private _http:HttpClient ) { }

    selectStockForChart(stock:any)
    {
      this.selectedStocks.next(stock);
    }

    searchSymbols(data:any)
    {
      let queryParams = new HttpParams();
      queryParams = queryParams.append("q",data);
      queryParams = queryParams.append("token","c7qf3kaad3i9it6670ng");
      return this._http.get(this.url+'/search',{params:queryParams});
    }

    getPrice(data:any)
    {
      let queryParams = new HttpParams();
      queryParams = queryParams.append("symbol",data);
      queryParams = queryParams.append("token","c7qf3kaad3i9it6670ng");
      console.log(queryParams);
      return this._http.get(this.url+'/quote',{params:queryParams}); 
    }

    getPriceChart(data:any)
    {
      let queryParams = new HttpParams();

      queryParams = queryParams.append("symbol",data.symbol);
      queryParams = queryParams.append("resolution",data.res);
      queryParams = queryParams.append("from",data.from);
      queryParams = queryParams.append("to",data.to);
      queryParams = queryParams.append("token","c7qf3kaad3i9it6670ng");
      console.log(queryParams);
      return this._http.get(this.url+'/stock/candle', {params:queryParams});
      //return this._http.get("https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=60&from=1631022248&to=1631627048&token=c7qf3kaad3i9it6670ng");  
    }

}
