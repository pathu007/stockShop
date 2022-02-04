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
  id: any;
  l_p :any[] = [];
  stock_list: any[] = [];
  chart_stock: any;
  subject: any[] = [];
  //socket_packet: any[] = [];
  socket_packets = new Map<string, any>();

	ngOnInit()
	{
		this.stock_list = this._store.retrieve('#List');
		if(this.stock_list == null)
		{
			this.stock_list = [];
			this.l_p = [];
		}
		else
		{
			this._gs.selectStockForChart(this.stock_list[0]);
			this.getFixed();
			
		}
		
		
    //var subscribe = {'type':'subscribe', 'symbol': "BINANCE:BTCUSDT"};
    
    		this.ManageSockets("",0);
    		


      	
      	this.updatePrices();
      	this.id = setInterval(() => {
    								this.updatePrices(); 
  								}, 5000);
    






    

    // this.stock_list.forEach((obj:any,index:any) => {
    // 		this.ManageSockets(obj.symbol,1);
    // }) 

		//this._gs.getPrice("AAPL").subscribe(data => console.log(data));
		
		
		
			
	}	

	updatePrices()
	{
		console.log("e");
		this.stock_list.forEach((obj:any,index:any) => {
			let key = this.socket_packets.get(obj.symbol);
			if(key != null)
			{
				this.l_p[index].c = key.p;
			}
		})

	}

	getFixed()
	{
		this.stock_list.forEach((obj:any,index:any) => {
				console.log(obj);
				this._gs.getPrice(obj.symbol).subscribe(data => {
																													this.l_p.push(data);
																													console.log(this.l_p);
																												})

			})
	}

	selectForChart(stock:any) {
		console.log(stock);
		this._gs.selectStockForChart(stock);
	}

	openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '600px',
      data: { selectedItems : this.stock_list, last_price: this.l_p },
    });

    dialogRef.afterClosed().subscribe(result => {
    	if(result != null)
    	{
	      console.log('The dialog was closed');
	      console.log(result);
	     	let temp = this._store.retrieve('#List');
	     	this.ManageSockets("",4);
	      this.stock_list = result;
	      this.selectForChart(this.stock_list[0]);
	      this.getFixed();
	      this.ManageSockets("",0);
	      this._store.store('#List', this.stock_list);
	    }  
    });
  }

  ngOnDestroy(): void {
  	if (this.id) {
    	clearInterval(this.id);
  	}
  }

  ManageSockets(symbol:string,action:number)
  {
  
  	const subject = new W3CWebSocket('wss://ws.finnhub.io?token=c7qf3kaad3i9it6670ng');
	    		
	  	if(action==0){  		
	    		subject.onopen = () => {
	    			console.log('WebSocket Client Connected');
	    			this.stock_list.forEach((obj:any,index:any) => {
	    				let subscribe = {'type':'subscribe', 'symbol': obj.symbol };		
	    				console.log(subscribe);
	    				subject.send(JSON.stringify(subscribe));
	    			});
	    		//subject.send(JSON.stringify({'type':'subscribe','symbol':'AAPL'}));
					};
	    }
	    else if(action==1)
	  	{
	  			subject.onopen = () => {
	    			console.log('WebSocket Client Connected');
	    			
	    				let subscribe = {'type':'subscribe', 'symbol': symbol };		
	    				console.log(subscribe);
	    				subject.send(JSON.stringify(subscribe));
	    			
	    		//subject.send(JSON.stringify({'type':'subscribe','symbol':'AAPL'}));
					};		
	  	}
	  	else if(action==2)
	  	{
	  			subject.onopen = () => {
	    			console.log('WebSocket Client Connected');
	    			
	    				let subscribe = {'type':'unsubscribe', 'symbol': symbol };		
	    				console.log(subscribe);
	    				subject.send(JSON.stringify(subscribe));
	    			
	    		//subject.send(JSON.stringify({'type':'subscribe','symbol':'AAPL'}));
					};
	  	}
	  	else
	  	{
	  			subject.onopen = () => {
	    			console.log('WebSocket Client Connected');
	    			this.stock_list.forEach((obj:any,index:any) => {
	    				let subscribe = {'type':'unsubscribe', 'symbol': obj.symbol };		
	    				console.log(subscribe);
	    				subject.send(JSON.stringify(subscribe));
	    			});
	    			
	    		//subject.send(JSON.stringify({'type':'subscribe','symbol':'AAPL'}));
					};		
	  	}  
	    		subject.onmessage = (e:any) => {
	    			console.log(e);
	      		let temp = JSON.parse(e.data);
	      		let i = temp["data"][0].s;
	      		
	      		this.socket_packets.set(i,temp["data"][0])
	      		console.log(this.socket_packets);
	      		//this.socket_packet.append(temp["data"][0]);
	      	}
	  
	      	
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
  l_p : any[] = [];

  constructor(	public _gs: GeneralServicesService, 
  							@Inject(MAT_DIALOG_DATA) public data: any,
    						public dialogRef: MatDialogRef<DialogOverviewExampleDialog>  ) {}
  ngOnInit()
  {
  	this.selectedItems = this.data.selectedItems;
  	this.l_p = this.data.last_price;
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
  	this._gs.getPrice(stock.symbol).subscribe(data => this.l_p.push(data))
  	this.selectedItems.push(stock)
  }
}
