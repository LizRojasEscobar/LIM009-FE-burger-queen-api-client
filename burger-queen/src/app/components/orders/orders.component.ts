import { Component, OnInit } from "@angular/core";
import { OrdersService } from "src/app/services/orders.service";
import { product } from "src/app/services/products";
import { UserService } from "../../services/user.service";
import { Order } from "../../services/order";
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
  orderForBackend: OrderForBackend;

  constructor(
    private orderservice: OrdersService,
    private userservice: UserService
  ) {
    this.orderservice.productData.subscribe(resp => {
      this.orderProduct = resp; // se llena la data mediante el servicio
      //recorremos la lista de productos mostrados en el panel derecho
      // console.log(this.orderProduct);
      this.orderProduct.forEach(ele => {
        // Si la lista no tiene elementos se le agrega uno nuevo con cantidad por defecto
        if (this.lstPedido.length === 0) {
          this.order = {
            productId: ele.productId,
            qty: 1
          };
          console.log(this.order);
          this.lstPedido.push(this.order);
        } else {
          this.order = {
            productId: ele.productId,
            qty: 1
          };

          this.lstPedido.push(this.order);
        }
      });
    });
  }

  ngOnInit() {}

  sendToKitchen() {   // Función que captura el userId y el nombre de cliente para enviarlo a cocina
    this.userservice.getIdUsers().subscribe(resp => {
      this.orderForBackend = {
        userId: resp[0].userId,
        client: "",
        product: this.lstPedido
      };
      console.log(this.orderForBackend);
    });
  }

  deleteproduct(idx: number) {
    console.log(idx);
    this.orderservice.deleProduct(idx);
  }

  incrementQuantity(idx: number) {
    ++this.lstPedido[idx].qty;
  }

  decrementQuantity(idx: number) {
    if (this.lstPedido[idx].qty > 1) --this.lstPedido[idx].qty;
  }
}
