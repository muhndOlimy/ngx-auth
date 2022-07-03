export interface User {
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