
# ngx-auth

ngx-auth is an angular package for authentication.

ngx-auth goal is to decouple the authentication logic from bussniess logic, Moving authentication logic into a seperate library, So it can be used on different projects.

## Installation

```
  $ npm install ./dist/ngx-auth; //locally
```
## Configuration

In your app.module.ts file add configurations as demonstrated below:
```css
  @NgModule({
    providers: [
      {provide: 'ngx-auth', useValue: {
        API_URL: // add here you Api url as a string
      }}
    ]
  })
  class AppModule {}
```
## Package entry points

### User entry point

#### Interfaces
```js
  import { User } from "ngx-auth";

  interface User {
    id:number
    username:string
    email:string
    phone:string
    photoUrl:string
    roles:string[]
    additionalData:object
    userId?:number
    token?:string
    refreshDate?:string
    refreshToken?:string
    expiryDate?:string
  }
```
#### Methods
```css
  import { UserService } from "ngx-auth";
```

| Method    | Parameters     | Return                |
| :-------- | :-------       | :---------------------|
| `getToken`| `none`         |    string or null      |

```
Description

getToken method return the access token as string

```

| Method    | Parameters     | Return                |
| :-------- | :-------       | :---------------------|
| `refreshToken`  | `none` | Promise<void> |

```
Description

refreshToken method used when access token is expired ethier send a request by refresh
token and generate a new access token or refresh token is also expired and then 
it's logout user.
```

| Property         | 
| :--------------- | 
| `currentUser`    | 

```
Description

currentUser property provide to the consumer the info about user either an object with user info
or a value of null means the user isn't logged in

Ex:

{
    "id": number,
    "username": "",
    "email": "",
    "roles": [
        "",
        ""
    ],
    "phone": "",
    "photoUrl": "",
    "additionalData": {}
}
```

### Login entry point


#### Interfaces
```js
  import { LoginData } from "ngx-auth/login";

  interface LoginData{
    login:string
    password:string
  }
```
#### Methods
```css
  import { loginService } from "ngx-auth/login";
```


| Method    | Parameters     | Return                |
| :-------- | :-------       | :---------------------|
| `login`   | `object:LoginData` | Promise           |

```
Description

login method send a request to login the user and return Promise either:

success: return a string "user has logged in".

failure: reutrn an error object from backend.
```


### Register entry point

#### Interfaces
```js
  import { RegisterData } from "ngx-auth/register";

  interface RegisterData{
    email:string
    password:string
    phone:string
    username:string
    roleId:number
  }
```
#### Methods
```css
  import { RegisterService } from "ngx-auth/register";
```

| Method    | Parameters     | Return                |
| :-------- | :-------       | :---------------------|
| `register`| `object:RegisterData` | Promise |

```
Description

register method send request to register the user and return Promise either:

success: return a string "user is registered successfully".

failure: reutrn an error object from server with status code and statusText.

```

| Method    | Parameters     | Return                |
| :-------- | :-------       | :---------------------|
| `verify`  | `verifyToken:string` | Promise |

```
Description

verify method send request with token send earlier to user email or phone to 
verify the user account and return Promise either:

success: return a string "user account is verified successfully".

failure: reutrn an error object from server with status code and statusText.
```

| Property         | 
| :--------------- | 
| `verifySetting`  | 

```
Description

verifySetting property provide to the consumer setting of verification

Ex:

{
    "defaultVerifyType": "email",
    "verifyTypes": [
        "phone",
        "email"
    ],
    "verifyUser": true
}
```
