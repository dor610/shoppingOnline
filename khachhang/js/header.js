const homeBtn = document.getElementById("nav-home");
const productBtn = document.getElementById("nav-product");
const contactBtn = document.getElementById("nav-contact");

const account = {
    account: document.getElementById("nav-account"),
    loginBtn: document.getElementById("account-login"),
    regBtn: document.getElementById("account-reg"),
    inforBtn: document.getElementById("account-infor"),
    logoutBtn: document.getElementById("account-logout"),
}

const cartBtn = document.getElementById("nav-cart");

window.addEventListener('load', () =>{
    (async () =>{
        let is = await isLoggedIn();
        console.log(is)
        if(is){
            console.log("đã login");
            setData("loggedIn", true);
            account.regBtn.style.display = 'none';
            account.loginBtn.style.display = 'none';

            account.inforBtn.style.display = 'block';
            account.logoutBtn.style.display = 'block';
        }else {
            console.log("chưa login")
            setData("loggedIn", false);
            account.inforBtn.style.display = 'none';
            account.logoutBtn.style.display = 'none';

            account.loginBtn.style.display = 'block';
            account.regBtn.style.display = 'block';
        }
    })();

    cartBtn.addEventListener("click", ()=>{
       location.href = '../html/cart.html';
    });

    account.logoutBtn.addEventListener("click", () =>{
        logout();
    });

    account.regBtn.addEventListener("click", ()=>{
       localStorage.setItem('nextPage', 'register');
    });

    account.loginBtn.addEventListener('click', () =>{
        localStorage.setItem('nextPage', 'login');
    })
});


let logout = () =>{
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../php/account.php", true);

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if(this.readyState === XMLHttpRequest.DONE && this.status === 200){
            console.log(this.response);
            let data = JSON.parse(this.response);
            if(data.isSuccess == true){
                console.log(data);
                removeData('cart');
                removeUserInfor();
                window.location.href = '../html/home.html';
            }
        }
    }

    xhr.send("type=logout");
}
