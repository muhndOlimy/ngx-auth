import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService , API_URL} from 'ngx-auth';

interface LoginData{
  login:string
  password:string
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {


  constructor(private _http:HttpClient , private _user:UserService) {}

  //Create promise to consumer resolve by success message or reject by error.
  login(data:LoginData):Promise<string>{
    
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
  private handleLogin(data):void{
    localStorage.setItem("Token" , data.token)
    localStorage.setItem("RefreshToken" , data.refreshToken)   
    this._user.currentUser = {
      id:data.id,
      username:data.username,
      email:data.email,
      phone:data.phone,
      photoUrl:data.photoUrl,
      roles:data.roles,
      additionalData:data.additionalData,
    };
  }
  

}
