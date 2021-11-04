


window.addEventListener("load", ()=>{
    if(!getData('isLoggedin')){
        location.href = "../html/login.html";
    }
});

function getStaffInfo(){
    let staff = getUserInfor();
    sendPostRequest("../php/staff.php", "msnv="+staff.msnv+"&type=getInfo", res =>{
        // set thông tin nhân viên
    });
}