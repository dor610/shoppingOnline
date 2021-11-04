const notification = {
    notiBox: document.getElementById("notification-box"),
    notiContent: document.getElementById("noti-content"),
}

function notify(content){
    notification.notiContent.innerHTML = content;
    notification.notiBox.classList.add("show-noti-box");
    setTimeout(() =>{
        notification.notiBox.classList.remove("show-noti-box");
    }, 2000)
}