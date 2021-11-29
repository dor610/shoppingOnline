const loginForm = {
    loginForm : document.getElementById("login-form"),
    loginFromSubmitBtn : document.getElementById("login-submit-btn"),
    toRegFormBtn : document.getElementById("to-reg-form"),
    name : document.getElementById("login-name"),
    password : document.getElementById("login-pw"),
    submitBtn: document.getElementById("login-submit-btn"),
}

const regForm = {
    regForm : document.getElementById("register-form"),
    regFormSubmitBtn : document.getElementById("register-submit-btn"),
    toLoginFormBtn : document.getElementById("to-login-form"),
    userName: document.getElementById("reg-user-name"),
    name: document.getElementById("reg-name"),
    password: document.getElementById("reg-pw"),
    phoneNumber: document.getElementById("reg-pn"),
    address: document.getElementById("reg-address"),
    email: document.getElementById("reg-email"),
    submitBtn: document.getElementById("register-submit-btn"),
}

//----------------------------------------

window.addEventListener('load', () =>{

    let page = getData('nextPage');
    switch (page){
        case 'register': openRegform();
            document.title = "Đăng Ký - Website Bán hàng";
            break;
        default: openLoginForm();
            document.title = "Đăng Nhập - Website Bán hàng";
            break;
    }
    regForm.toLoginFormBtn.addEventListener('click', () =>{
       openLoginForm();
    });

    loginForm.toRegFormBtn.addEventListener('click', () =>{
        openRegform();
    });

    loginForm.submitBtn.addEventListener('click', event =>{
        //console.log("dang nhap")
        submitLoginForm(event);
    });

    regForm.submitBtn.addEventListener('click', event =>{
        submitRegForm(event);
    })
});

let openLoginForm = () =>{
    regForm.regForm.classList.add("hidden-opacity");
    loginForm.loginForm.classList.remove("hidden");
    setTimeout(()=>{
        regForm.regForm.classList.add("hidden");
        loginForm.loginForm.classList.remove("hidden-opacity");
    },600)
}

let openRegform = () =>{
    loginForm.loginForm.classList.add("hidden-opacity");
    regForm.regForm.classList.remove("hidden");
    setTimeout(()=>{
        loginForm.loginForm.classList.add("hidden");
        regForm.regForm.classList.remove("hidden-opacity");
    },600)
}

let submitLoginForm = (event) =>{
    event.preventDefault();

    let userName = loginForm.name.value;
    let password = loginForm.password.value;
    let data = "userName="+userName+"&password="+password+"&type=login";
    sendPostRequest('../php/account.php', data, res =>{
        let response = JSON.parse(res);
        if(response.isSuccess === true){
            setUserInfor(response);
            let cart = getData("cart");
            console.log(cart);
            if(cart){
                console.log(cart);
                cart = JSON.parse(cart);
                cart.forEach(async  c =>{
                    let item = JSON.parse(c);
                    console.log(item);
                    let str = 'mshh='+item.mshh+'&mskc='+item.mskc+'&mskh='+response.mskh+'&soLuong='+item.quantity+'&type=themGioHang';
                    await sendSyncRequest('POST', '../php/product.php', str);
                });
            }
            let nextTarget = getData("nextTarget");
            removeData('cart');
            alert("Đăng Nhập Thành Công!");
            if(nextTarget){
                location.href = "../html/"+nextTarget+".html";
            }else location.href = "../html/home.html";
        }
    });
}

let submitRegForm = (event) =>{
    event.preventDefault();

    let userName = regForm.userName.value;
    let name = regForm.name.value;
    let password = regForm.password.value;
    let sdt = regForm.phoneNumber.value;
    let diaChi = regForm.address.value;
    let email = regForm.email.value;
    let data = "userName="+userName+"&password="+password+"&name="+name+"&sdt="+sdt+"&diaChi="+diaChi+"&email="+email+"&type=register";

    sendPostRequest('../php/account.php', data, response=>{
        //console.log(response);
        let res = JSON.parse(response);

        if (res.isSuccess === true){
            setData('nextPage', 'login');
            alert("Đăng Ký Thành Công");
            window.location.href = 'login.html';
        }
    });
}
