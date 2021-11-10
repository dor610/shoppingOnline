


window.addEventListener("load", ()=>{

    //console.log(getData('loggedIn'));
    if(!getData('loggedIn')){
        location.href = "../html/login.html";
    }
});

function getStaffInfo(){
    let staff = getUserInfor();
    sendPostRequest("../php/staff.php", "msnv="+staff.msnv+"&type=getInfo", res =>{
        // set thông tin nhân viên
    });
}