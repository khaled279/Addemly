console.log("linked");
const signupButton = document.getElementById("signup"); 
const url = "users/signup" ; 
const loginUrl = "users/login"
const baseUrl = "http://localhost:4000/"
let res="" ; 
let confirmationRes = "" ; 
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
        res = await fetch(baseUrl+loginUrl , {
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
    res = await fetch(baseUrl +url , {
        method: 'POST', 
        credentials: 'same-origin', 
        headers: {
            'Content-type' : 'application/json',
            'Accept' : '*/*', 
            'Connection': 'keep-alive'
        },
        body : JSON.stringify(postData)
    }
    ).then(async (res)=>{
        jsonRes = await res.json(); 
        confirmationRes = await fetch(baseUrl+"confirm" ,{
            method: 'POST', 
            credentials: 'same-origin', 
            headers: {
                'Content-type' : 'application/json',
                'Accept' : '*/*', 
                'Connection': 'keep-alive'
            },
            body : JSON.stringify({"confirmationCode": jsonRes.user.confirmationCode})
        })
    })
        console.log(await confirmationRes.json())    

}
}) ; 


