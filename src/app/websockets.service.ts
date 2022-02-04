import { Injectable } from '@angular/core';
import { webSocket } from "rxjs/webSocket";

@Injectable({
  providedIn: 'root'
})
export class WebsocketsService {

    constructor() { }

    getWebSocketConnected(data='AAPL')
    {
      const subject = webSocket('wss://ws.finnhub.io?token=c7qf3kaad3i9it6670ng');
      var subscribe = {'type':'subscribe', 'symbol': 'BINANCE:BTCUSDT'}
      subject.next(JSON.stringify(subscribe));
      subject.subscribe(msg => {
                                console.log(msg);
                                
                              });
      //subject.next({message: 'some message'});    
    }
  
}
