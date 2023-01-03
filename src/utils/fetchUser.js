import jwt_decode from "jwt-decode";

export const fetchUser = () => {
    const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear() ; 
    const decoded = jwt_decode(userInfo);
    // console.log(decoded);
    return decoded;
}

