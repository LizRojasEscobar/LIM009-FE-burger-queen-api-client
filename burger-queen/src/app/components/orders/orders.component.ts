import { Component, OnInit } from "@angular/core";
import { OrdersService } from "src/app/services/orders.service";
import { product } from "src/app/interface/products";
import { UserService } from "../../services/user.service";
import { Order } from "../../interface/order";
import { OrderForBackend } from "../../interface/orderforbackend";


@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.css"]
})
export class OrdersComponent implements OnInit {
  orderProduct: product[] = []; //productos seleccionados mostrados en el panel derecho
  //userId: string;
 // cliente: string;
  lstPedido: Order[] = []; //lista con propiedades que seran enviados al backend - base de datos
  order: Order; // variable auxiliar para interfaz
  total :number; 
  orderForBackend: OrderForBackend;
//  nameClient : string;
  constructor(
    private orderservice: OrdersService,
    private userservice: UserService
  ) {
   
  }

  ngOnInit() {
    this.orderservice.productData.subscribe(resp => {
      this.total = 0
      this.orderProduct = resp; // se llena la data mediante el servicio
      //recorremos la lista de productos mostrados en el panel derecho
      // console.log(this.orderProduct);
      this.orderProduct.forEach((ele, index) => {
        // Si la lista no tiene elementos se le agrega uno nuevo con cantidad por defecto
        if (this.lstPedido.length === 0) {   
          this.order = {
            _id: ele._id,
            qty: 1,
          };
         // console.log(this.order);           
          this.lstPedido.push(this.order);
        //  this.total +=  parseInt(ele.price)
        } else {
          let objProduct = this.lstPedido.find(item=> item._id === ele._id);        
        if(objProduct===undefined){
          this.order = {
            _id: ele._id,
            qty: 1
          };
          this.lstPedido.push(this.order);     
        }
      }
      this.total +=  parseInt(ele.price) * this.lstPedido[index].qty
      });
     /*  this.orderProduct.forEach((ele, index) => {
        this.total +=  parseInt(ele.price) * this.lstPedido[index].qty
      }); */
      console.log(this.total)
    });
  }

  sendToKitchen(nameClient:string) {   // Función que captura el userId y el nombre de cliente para enviarlo a cocina
    this.userservice.getIdUsers().subscribe(resp => {
      this.orderForBackend = {
        userId: resp[0].userId,
        client: nameClient,
        product: this.lstPedido
       
     
      };
      console.log(this.orderForBackend);
      
    });
    this.userservice.getOrder(this.orderForBackend).subscribe(arg => console.log(arg));
    
    
  }

  deleteproduct(idx: number) {
    this.lstPedido.splice(idx,1)
    this.total -= parseInt(this.orderProduct[idx].price) 
   // console.log(this.total);
    
    this.orderservice.deleteProduct(idx);
  }

  incrementQuantity(idx: number) {
    this.total += parseInt(this.orderProduct[idx].price) 
    //console.log(this.total);
     ++this.lstPedido[idx].qty;
   
  }

  decrementQuantity(idx: number) {

    if (this.lstPedido[idx].qty > 1) {
      this.total -= parseInt(this.orderProduct[idx].price) 
     // console.log(this.total);
      --this.lstPedido[idx].qty;
  }
  }

}
