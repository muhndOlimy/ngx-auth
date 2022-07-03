import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService , User} from 'ngx-auth';

export interface LoginData{
  login:string
  password:string
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {


  constructor(private _http:HttpClient , private _user:UserService , @Inject("ngx-auth") private AuthConfig:{API_URL:string}) {}

  //Create promise to consumer resolve by success message or reject by error.
  async login(data:LoginData):Promise<string>{
    
    return new Promise(async (resolve, reject) => {

      try{
        let response = await this.processLogin(data);
        this.handleLogin(response);
        resolve("User is logged in");
      }
      catch(err){
        reject(err)
      }
    })
  }

  //Request login as promise
  private processLogin(data:LoginData):Promise<any>{
    return this._http.post(`${this.AuthConfig.API_URL}users/login` , data).toPromise();
  }

  //Handle success login
  private handleLogin(data:User):void{
    localStorage.setItem("Token" , data.token)
    localStorage.setItem("RefreshToken" , data.refreshToken)
    localStorage.setItem("ExpiryDate" , data.expiryDate)
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
