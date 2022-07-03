import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { User } from './User';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  
  public currentUser:User = null;


  constructor(private _http:HttpClient , @Inject("ngx-auth") private AuthConfig:{API_URL:string}) {
    this.initUserData()
  }

  //initialize user value if it's logged in
  private async initUserData():Promise<void>{
    const dateNow = new Date().toISOString();
    const expireDate = this.getExpiryDate();
    const isExpired = dateNow > expireDate;
    const hasToken = this.getToken();


    if(hasToken && !isExpired){

      await this.getUserData();
    
    } else if(hasToken && isExpired) {

      try{
        await this.refreshToken();
        await this.getUserData();
      }
      catch{
        this.logout()
      }

    } else{
      this.logout()
    }  
    
  }

  //send request by token to get user data
  async getUserData():Promise<void>{
    const data:any = await this._http.get(`${this.AuthConfig.API_URL}users/me` , {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`,
      })
    }).toPromise();
    this.currentUser = {
      id:data.id,
      username:data.username,
      email:data.email,
      phone:data.phone,
      photoUrl:data.photoUrl,
      roles:data.roles,
      additionalData:data.additionalData,
    }; 
  }

  //send with saved refresh token to get new acces token
  private async refreshToken():Promise<void>{
    try{
      const data:any = await this._http.post(`${this.AuthConfig.API_URL}users/refresh-token` , {refreshToken:this.getRefreshToken()}).toPromise();
      this.setToken(data.token);
      this.setRefreshToken(data.refreshToken)
      this.setExpiryDate(data.expiryDate)
    }
    catch{
      this.logout()
    }
  }

  //getters
  getToken():string|null{
    return localStorage.getItem("Token") || null;
  }

  private getExpiryDate():string|null{
    return localStorage.getItem("ExpiryDate") || null;
  }

  private getRefreshToken():string|null{
    return localStorage.getItem("RefreshToken") || null;
  }

  //setters
  private setRefreshToken(token:string):void{
    localStorage.setItem("RefreshToken",token)
  }

  private setToken(token:string):void{
    localStorage.setItem("Token",token)
  }

  private setExpiryDate(date:string):void{
    return localStorage.setItem("ExpiryDate" , date)
  }

  //logout
  logout():void{
    localStorage.removeItem("Token");
    localStorage.removeItem("RefreshToken");
    localStorage.removeItem("ExpiryDate");
    this.currentUser = null;
  }

}




    