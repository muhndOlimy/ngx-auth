import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface RegisterData{
  email:string
  password:string
  phone:string
  username:string
  roleId:number
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  verifySetting:{
    defaultVerifyType:string
    verifyTypes:string[]
    verifyUser:string
  }

  constructor(private _http:HttpClient , @Inject("ngx-auth") private AuthConfig:{API_URL:string}) {
    this.getVerifySetting()
  }

  //Create promise to consumer resolve by register success message or reject by error.
  async register(data:RegisterData):Promise<string>{
    
    return new Promise(async (resolve, reject) => {

      try{
        await this.processRegister(data);
        resolve("user is registered successfully");
      }
      catch(err){
        reject(err)
      }
    })
  }

  //Request register as promise
  private processRegister(data:RegisterData):Promise<any>{
    return this._http.post(`${this.AuthConfig.API_URL}users` , data).toPromise();
  }

  //Create promise to consumer resolve by verify success message or reject by error.
  async verify(data:string):Promise<string>{
    return new Promise(async (resolve, reject) => {

      try{
        await this.processVerify(data);
        resolve("user account is verified successfully");
      }
      catch(err){
        reject(err)
      }
    })
  }

  //Request verify as promise
  private processVerify(data:string):Promise<any>{
    return this._http.post(`${this.AuthConfig.API_URL}users/register-verify` , {token:data}).toPromise();
  }

  //Handle a promise to consumer resolve by update VerifySetting property or reject by error.
  private async getVerifySetting():Promise<void>{
    try{
      let response = await this.processVerifySetting();
      this.verifySetting = response;
    }
    catch{
      //do nothing 
    }
  }

  //Request verify Setting as promise
  private processVerifySetting():Promise<any>{
    return this._http.get(`${this.AuthConfig.API_URL}verification-settings`).toPromise();
  }
}
