import { getAuth, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth();

window.login = async function(){

let email = prompt("Enter email")
let password = prompt("Enter password")

try{

let result = await signInWithEmailAndPassword(auth,email,password)

user = result.user

alert("Login successful")

}catch(e){

alert("Login failed")

}

}
