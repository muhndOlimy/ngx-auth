
# ngx-auth

ngx-auth is an angular package for authentication.

## Package entry points

### Login entry point

```http
  import { loginService } from "ngx-auth/login";
```

| Method    | Parameters     | Return                |
| :-------- | :-------       | :---------------------|
| `login`   | `{login:string , password:string}` | Promise |

Description
login method send request to login the user and return Promise either:

success: return a string "user has logged in"
failure: reutrn an error object from server with status code and statusText