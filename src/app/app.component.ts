import { Component, Inject } from '@angular/core';
var W3CWebSocket = require('websocket').w3cwebsocket;

import { GeneralServicesService } from './general-services.service';

import { LocalStorageService } from 'ngx-webstorage';

import { WebsocketsService } from './websockets.service';

import { BehaviorSubject, Observable } from 'rxjs';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'stockList';
  
  constructor(	public dialog: MatDialog,
  							public _gs: GeneralServicesService,
  							public _store: LocalStorageService,
  							public _web: WebsocketsService		) {  }
  temp: any;
  l_p :any[] = [];
  stock_list: any[] = [];
  chart_stock: any;
  subject: any;
  socket_packet: any[] = [];

	ngOnInit()
	{
		this.stock_list = this._store.retrieve('#List');
		if(this.stock_list == null)
		{
			this.stock_list = [];
		}
		else
		{
			this._gs.selectStockForChart(this.stock_list[0]);
			this.stock_list.forEach((obj:any,index:any) => {
				console.log(obj);
				this._gs.getPrice(obj.symbol).subscribe(data => {
																													this.l_p.push(data);
																													console.log(this.l_p);
																												})

			})
			
		}
		
		const subject = new W3CWebSocket('wss://ws.finnhub.io?token=c7qf3kaad3i9it6670ng');
    //var subscribe = {'type':'subscribe', 'symbol': "BINANCE:BTCUSDT"};
    this.stock_list.forEach((obj:any,index:any) => {
    // 		this.ManageSockets(obj.symbol,1);
    		let subscribe = {'type':'subscribe', 'symbol': "BINANCE:BTCUSDT"};

    		subject.onopen = function() {
    			console.log('WebSocket Client Connected');
    			console.log(subscribe);
    			subject.send(JSON.stringify(subscribe));
    		//subject.send(JSON.stringify({'type':'subscribe','symbol':'AAPL'}));
				};
      
    		subject.onmessage = function(e:any) {
      		let temp = JSON.parse(e.data);
      		let i = temp["data"][0].s;

      		console.log(i);
      		//this.socket_packet.append(temp["data"][0]);
      	}
      	console.log(this.socket_packet);

    })




    

    // this.stock_list.forEach((obj:any,index:any) => {
    // 		this.ManageSockets(obj.symbol,1);
    // }) 

		//this._gs.getPrice("AAPL").subscribe(data => console.log(data));
		
		
		
			
	}	

	selectForChart(stock:any) {
		console.log(stock);
		this._gs.selectStockForChart(stock);
	}

	openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '600px',
      data: { selectedItems : this.stock_list },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
     	let temp = this._store.retrieve('#List');
     	temp.forEach((obj:any) => this.ManageSockets(obj.symbol,0))
      this.stock_list = result;
      this.stock_list.forEach((obj:any) => this.ManageSockets(obj.symbol,1))
      this._store.store('#List', this.stock_list);
    });
  }

  ManageSockets(symbol:string,action:number)
  {
  // 	if(action == 1){
  // 		var subscribe = {'type':'subscribe', 'symbol': "BINANCE:BTCUSDT"};	
  // 	}
  // 	else
  // 	{
  // 		var subscribe = {'type':'unsubscribe', 'symbol': symbol};
  // 	}
  	

  //   this.subject.onopen = function() {
  //   		console.log('WebSocket Client Connected');
  //   		console.log(subscribe);
  //   		this.subject.send(JSON.stringify(subscribe));
  //   		//subject.send(JSON.stringify({'type':'subscribe','symbol':'AAPL'}));
		// };
      
  //   this.subject.onmessage = function(e:any) {
  //     	let temp = JSON.parse(e.data);
  //     	// console.log(temp);
  //     	console.log(temp);
  //   }
  }







  
		
	
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'add_form.html',
})
export class DialogOverviewExampleDialog {
	temp: any;
	results: any[] = [];
	isRet: boolean = false;
	removable: boolean = true;
  selectable: boolean = true;
  selectedItems : any[] = [];
  selectedSB : any = "";
  constructor(	public _gs: GeneralServicesService, 
  							@Inject(MAT_DIALOG_DATA) public data: any,
    						public dialogRef: MatDialogRef<DialogOverviewExampleDialog>  ) {}
  ngOnInit()
  {
  	this.selectedItems = this.data.selectedItems;
  }
  onNoClick(): void {
    this.dialogRef.close(this.selectedItems);
  }

  submit()
  {
  	console.log(this.selectedItems);
  	this.dialogRef.close(this.selectedItems);
  }

  callSearch(e:any)
  {
  	console.log(e);
  	this._gs.searchSymbols(e).subscribe(data => { this.temp = data; console.log(this.temp.result); this.results = this.temp.result; this.isRet = true;} );
  }

  removeStock(stock:any)
  {
  	this.selectedItems.forEach((obj, index) =>{
          console.log(obj);

          if(obj == stock)
          {
              console.log(index);
              this.selectedItems.splice(index,1);
              
              if(this.selectedItems.length == 0){
              	this.selectedItems = [];
              }
          }

    });
  }

  addStock(stock:any)
  {
  	this.selectedItems.push(stock)
  }
}