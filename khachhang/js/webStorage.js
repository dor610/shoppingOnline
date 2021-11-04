
window.addEventListener("load", () =>{

});


let addItemToCart = data =>{
    //console.log(data);
    if(getData('cart')){
        let cart = JSON.parse(getData('cart'));
        console.log(cart);
        cart[cart.length] = JSON.stringify(data);
        setData('cart', JSON.stringify(cart));
    }else {
        let cart = [];
        cart[0] = JSON.stringify(data);
        console.log(cart);
        setData('cart', JSON.stringify(cart));
    }
}

let setCart = data =>{
    let cart = [];
    data.forEach(item =>{
        cart.push(JSON.stringify(item));
    })
    setData('cart', JSON.stringify(cart));
}

let setUserInfor = (data) =>{
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('userInfor', JSON.stringify(data));
}

let removeUserInfor = () =>{
    localStorage.removeItem('userInfor');
    localStorage.loggedIn = 'false';
}

let getUserInfor = () =>{
    if(isLoggedIn())
        return JSON.parse(localStorage.userInfor);

    return null;
}

let removeData = (key) =>{
    localStorage.removeItem(key);
}

let setData = (key, data) => {
    localStorage.setItem(key, data);
}

let getData = (key) => {
    return localStorage.getItem(key);
}

let isLoggedIn = async function(){
        let res = 'hihi';
            res = await sendSyncRequest('POST', '../php/account.php', 'type=isLoggedIn');
    console.log(res);
            let data = JSON.parse(res);
            return data.result;
}

let sendSyncRequest = function (method, url, data) {
    //console.log("chuẩn bị gửi nè" + data);
    return new Promise(function (resolve, reject){
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send(data);
    });
}

let sendPostRequest = function(url, data, func){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function (){
        if(this.status === 200){
            func(this.response);
        }
    }
    xhr.send(data);
}