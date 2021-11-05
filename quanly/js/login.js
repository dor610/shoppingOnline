const loginBtn = document.getElementById("login-btn");
const userName = document.getElementById("user-name");
const password = document.getElementById("password");


window.addEventListener("load", () =>{
   loginBtn.addEventListener("click", e =>{
       login(e);
   })
});

function login(event){
    event.preventDefault();
    let text = userName.value;

    sendPostRequest("../php/staff.php", "msnv="+text+"&type=login", res =>{
        if(res === ""){
            console.log("Chưa được");
        }else {
            console.log(res);
            //setUserInfor(JSON.parse(res));


            //location.href = "../html/dashboard.html";
        }
    });
}
