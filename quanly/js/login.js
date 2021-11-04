const loginBtn = document.getElementById("login-btn");
const userName = document.getElementById("user-name");
const password = document.getElementById("password");


function login(event){
    event.preventDefault();
    let text = userName.value;

    sendPostRequest("../php/staff.php", "msnv="+text+"&type=login", res =>{
        if(res === ""){

        }else {
            setUserInfor(JSON.parse(res));


            location.href = "../html/dashboard.html";
        }
    });
}
