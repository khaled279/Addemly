console.log("linked");
const signupButton = document.getElementById("signup"); 
const url = "http://localhost:4000/users/signup" ; 
const loginUrl = "http://localhost:4000/users/login"
let res="" ; 
const inputName = document.getElementById("name"); 
const inputPassword = document.getElementById("password");
const inputEmail = document.getElementById("email"); 
signupButton.addEventListener('click',async (event)=>{
    event.preventDefault();
    if(inputName==null){
        let postData = {
            "email": inputEmail.value ,
            "password": inputPassword.value
        }
        res = await fetch(loginUrl , {
            method: 'POST', 
            credentials: 'same-origin', 
            headers: {
                'Content-type' : 'application/json',
                'Accept' : '*/*', 
                'Connection': 'keep-alive'
            },
            body : JSON.stringify(postData)
        }
        )
        console.log("request output" , `${ await res.json()}`)
    }
    else{
   
    let postData = {
        "name": inputName.value,
         "email": inputEmail.value ,
        "password": inputPassword.value
    }
    res = await fetch(url , {
        method: 'POST', 
        credentials: 'same-origin', 
        headers: {
            'Content-type' : 'application/json',
            'Accept' : '*/*', 
            'Connection': 'keep-alive'
        },
        body : JSON.stringify(postData)
    }
    )
    console.log("request output" , `${res.json()}`)
}
}) ; 


