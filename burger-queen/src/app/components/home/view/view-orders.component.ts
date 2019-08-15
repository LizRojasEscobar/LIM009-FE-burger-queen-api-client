import {
  Component,
  OnInit,
} from "@angular/core";
import { OrdersService } from "../../../services/orders.service";
import { orderResponse } from "../../../interface/orderResponse";
import { element } from 'protractor';

@Component({
  selector: "app-view-orders",
  templateUrl: "./view-orders.component.html",
  styleUrls: ["./view-orders.component.css"]
})
export class ViewOrdersComponent implements OnInit {
  orders: orderResponse[];
  timers = {};
  chef : any;
  waiter : any;
  show:boolean= true;
  optionForChef:string[] = ['delivered', 'canceled', 'pending'];
  optionForWaiter:string[] = ['delivering', 'canceled','delivered'];

  constructor(private orderService: OrdersService) {}

  statesGeneralForChefs =(item)=>{
   return this.optionForChef.filter(element => element != item.status);
  }
  statesGeneralForWaiter =(item)=>{
  return this.optionForWaiter.filter(element=>element != item.status);
  }
  ngOnInit(){
 
    this.orderService.getOrders().subscribe((respon: orderResponse[]) => {
      this.orders = respon; // Obtener todos las ordenes
      this.waiter = this.orders.filter(element => {
       return element.status =="delivering" || element.status =="delivered" || element.status === "canceled" 
      })
   
     this.chef = this.orders.filter(element => {
      return element.status ==="pending" || element.status === "canceled" 
      })

      this.chef.forEach(order=>{
        this.timeForOrders(order);
      });
      this.waiter.forEach(order=>{
        this.timeForOrders(order)
      });

    });
  };

  timeForOrders(item: any) {
    const obj: object = {
      ...item
    };
    let realTimeOfOrders: number;
    let interval:Object;
    if (obj["status"] === "delivered" || obj["status"] === "canceled") {
      realTimeOfOrders = (Date.parse(obj["dateProcessed"]) - Date.parse(obj["dateEntry"])) / 1000;      
    } else {
      const newDate =new Date(Date.now()).toString();
      realTimeOfOrders =( Date.parse(newDate) - Date.parse(obj["dateEntry"])) / 1000;
          } // esta en segundos
          console.log(realTimeOfOrders, Date.parse(obj["dateEntry"]))
    let totalSeconds = Math.trunc(realTimeOfOrders % 60);
    let totalMinutes = Math.trunc(realTimeOfOrders / 60);
    let hours = Math.trunc(totalMinutes / 60);
    let min = Math.trunc(totalMinutes % 60);
    console.log(min);
    
    if (obj["status"] === "pending") {
      interval = setInterval(() => {
        totalSeconds++;
        if (totalSeconds > 59) {
          totalSeconds = 0;
          min++;
        }
        if (min > 59) {
          min = 0;
     
        }


        this.timers[obj["_id"]] = {
          hours,
          min,
          sec: totalSeconds,
          interval //he ingresado el setInterval en una propiedad del obj timers para detenerlo
        };
      }, 1000);
    } else {
      this.timers[obj["_id"]] = {
        hours,
        min,
        sec: totalSeconds
      };

    }
    
  }

  captureData(item: any, state) {
 
   const obj: object = {
      ...item,
      status: state
    };
    if (state === "delivered" || state === "canceled") {     
      clearInterval(this.timers[obj["_id"]].interval);
    }

    this.orderService.putStatus({status:state}, item._id).subscribe(resp => {
    });
  }
}
