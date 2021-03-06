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
    const isExpired = dateNow > expireDate; // check whether token is expired or not
    const hasToken = this.getToken(); //check is local storage have token


    if(hasToken && !isExpired){ //token is available at local storage and not expired.

      try{
        //get user data.
        await this.getUserData();
      }
      catch{
        //in case user has manipulate the token data in the local storage then it's logout.
        await this.logout();
      }
    
    } else if(hasToken && isExpired) { //token is available at local storage but expired.

      try{
        //refresh access token then get user data.
        await this.refreshToken();
        await this.getUserData();        
      }
      catch{
        //in case of the refresh token is also expired.
        this.logout();
      }

    } else{ // in case there isn't token at local storage.

      this.logout();

    }  

    
  }

  //send request by token to get user data
  private async getUserData():Promise<void>{
    let data:any;
    data = await this._http.get(`${this.AuthConfig.API_URL}users/me` , {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`,
      })
    }).toPromise();

    //setting the current user with the response
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
  async refreshToken():Promise<void>{
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




    