import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from "../demo-config";


interface LoginData{
  login:string
  password:string
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http:HttpClient ) { }

  //Create promise to consumer resolve by success message or reject by error.
  login(data:LoginData):Promise<any>{
    
    return new Promise((resolve, reject) => {

      this.processLogin(data)
      .then(data=>{
        this.handleLogin(data)
        resolve("User is logged in")
      })
      .catch(err=>{
        reject(err)
      })
 
    })
  }

  //Request login as promise
  private processLogin(data:LoginData):Promise<any>{
    return this._http.post(`${API_URL}users/login` , data).toPromise();
  }

  //Handle success login
  private handleLogin(data){
    localStorage.setItem("Token" , data.token)
    localStorage.setItem("RefreshToken" , data.refreshToken)    
  }
  

}
