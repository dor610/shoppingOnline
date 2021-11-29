
window.addEventListener("load", () =>{

});


let setUserInfor = (data) =>{
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('userInfor', JSON.stringify(data));
}

let removeUserInfor = () =>{
    localStorage.removeItem('userInfor');
    localStorage.loggedIn = 'false';
}

let getUserInfor = () =>{
    if(localStorage.loggedIn === 'true')
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
            res = await sendSyncRequest('POST', '../php/staff.php', 'type=isLogin');
            console.log(res);
            return res;
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

let uploadImage = function (url, data, func){
    const xhr = new XMLHttpRequest();

/*  let formData = new FormData();
    formData.append("file" , file);
    formData.append("idimg", "3");
    console.log(formData);*/

    xhr.open('POST', url, true);
    xhr.onload = function (){
        if(this.status === 200) {
            func(this.response);
        }
    }
    xhr.send(data);
}