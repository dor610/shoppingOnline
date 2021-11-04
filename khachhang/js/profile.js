const profileAccount = {
    profileAccountBtn : document.getElementById("profile-account-btn"),
    profile: document.getElementById("profile-account"),
    userName: document.getElementById("userName"),
    name: document.getElementById("name"),
    address: document.getElementById("address"),
    phoneNumber: document.getElementById("phone-number"),
    email: document.getElementById("email"),
}

const profileEdit = {
    profileEditBtn: document.getElementById("profile-edit-btn"),
    profileEdit: document.getElementById("profile-edit"),
    name: document.getElementById("edit-name"),
    address: document.getElementById("edit-address"),
    phoneNumber: document.getElementById("edit-pn"),
    email: document.getElementById("edit-email"),
}

const profileOrder = {
    orderBtn: document.getElementById("profile-order-btn"),
    profileOrder: document.getElementById("profile-order"),

}

let currentTab = profileAccount;

window.addEventListener('load', (e) =>{
    profileAccount.profileAccountBtn.addEventListener('click', () =>{
        openProfileAccount();
    });

    profileEdit.profileEditBtn.addEventListener('click', () =>{
        openProfileEdit();
    });

    profileOrder.orderBtn.addEventListener('click', () =>{
        openProfileOrder();
    });


    if(isLoggedIn()) {
        setUserProfile();
    }
});

let openProfileAccount = () =>{
    if(profileAccount.profileAccountBtn.classList.contains("profile-active-btn") == false){
        profileAccount.profileAccountBtn.classList.add("profile-active-btn");

        let keys = Object.keys(currentTab);

        currentTab[keys[0]].classList.remove("profile-active-btn");
        currentTab[keys[1]].classList.add("hidden");

        profileAccount.profile.classList.remove("hidden");

        currentTab = profileAccount;
    }
}

let openProfileEdit = () =>{
    if(profileEdit.profileEditBtn.classList.contains("profile-active-btn") == false){
        profileEdit.profileEditBtn.classList.add("profile-active-btn");

        let keys = Object.keys(currentTab);

        currentTab[keys[0]].classList.remove("profile-active-btn");
        currentTab[keys[1]].classList.add("hidden");

        profileEdit.profileEdit.classList.remove("hidden");

        currentTab = profileEdit;
    }
}

let openProfileOrder = () =>{
    if(profileOrder.orderBtn.classList.contains("profile-active-btn") == false){
        profileOrder.orderBtn.classList.add("profile-active-btn");

        let keys = Object.keys(currentTab);

        currentTab[keys[0]].classList.remove("profile-active-btn");
        currentTab[keys[1]].classList.add("hidden");

        profileOrder.profileOrder.classList.remove("hidden");

        currentTab = profileOrder;
    }
}

let setUserProfile = () =>{
    let data = getUserInfor();
    console.log(data);
    if(data != null){
        profileAccount.userName.innerText = data.mskh;
        profileAccount.name.innerText = data.hoTen;
        profileAccount.email.innerText = data.email;
        profileAccount.phoneNumber.innerText = data.sdt;
        profileAccount.address.innerText = data.diaChi;
    }
}