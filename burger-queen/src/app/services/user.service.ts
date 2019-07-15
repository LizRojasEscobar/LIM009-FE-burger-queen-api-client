import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators'
import { User } from './user'
import { product } from './products';



@Injectable()
export class UserService {

  Usertoken: string
  url = 'http://localhost:3000/login';
  //url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyAYStI_9JZ-YBOhz5hnnFxIHEFz17Rc4wI'


  constructor(private http: HttpClient) {
   this.readToken()
   }
  /*   getToken (user : User ){
      const headers = {
        email: user.email,
        password : user.password,
        returnSecureToken :true
        };
      return this.http.post(this.url,headers)
    } */
    
  getToken(user: User) {
    return this.http.post(this.url, user).pipe(map(resp => {
      this.saveToken(resp['accessToken'])
      return resp;
    }))
  }
 // obtener links de los productos
  getProducts() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.Usertoken
    });
    return this.http.get<product[]>("http://localhost:3000/660/products", { headers: headers })
      .pipe(map(response => response)
      )
  }
  getIdUsers (){
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.Usertoken
    });
    return this.http.get<User>("http://localhost:3000/660/users", { headers: headers })
      .pipe(map(response => response)
      )
  }

  // *****
  //definir como observable
  // tener el suscribe en el componente que lo va a usar (product, order)

//Guardar y leer token en el LocalStorage
  saveToken(Token: string) {
    this.Usertoken = Token
    localStorage.setItem('token', Token);
  }

  readToken() {
    if (localStorage.getItem('token')) {
      this.Usertoken = localStorage.getItem('token');
    } else {
      this.Usertoken = '';
    }
    return this.Usertoken;
  }

  // Usuario Autenticado 
  authUser() : boolean{
    return this.Usertoken.length > 2;
  }


}