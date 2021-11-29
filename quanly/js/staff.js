
//Khai báo chung

//Khai báo phần tìm kiếm
const searchBox = {
    content: document.getElementById("search-content"),
    searchBtn: document.getElementById("search-btn"),
    keyWord:'',
}

//Khai báo danh sách nhân viên
const staffList = document.getElementById("staff-list");
//Khai báo phần thêm nhân viên

const addingBox = {
    box: document.getElementById("adding-staff-box"),
    name: document.getElementById("adding-staff-name"),
    msnv: document.getElementById("adding-staff-msnv"),
    position: document.getElementById("adding-staff-position"),
    phoneNumber: document.getElementById("adding-staff-phone-number"),
    address: document.getElementById("adding-staff-address"),
    cancelBtn: document.getElementById("adding-staff-cancel-btn"),
    submitBtn: document.getElementById("adding-staff-submit-btn"),
    addBtn: document.getElementById("staff-adding-btn"),
}

//Khai báo phần sửa thông tin nhân viên
const editingBox = {
    box: document.getElementById("editing-staff-box"),
    name: document.getElementById("editing-staff-name"),
    msnv: document.getElementById("editing-staff-msnv"),
    position: document.getElementById("editing-staff-position"),
    phoneNumber: document.getElementById("editing-staff-phone-number"),
    address: document.getElementById("editing-staff-address"),
    cancelBtn: document.getElementById("editing-staff-cancel-btn"),
    submitBtn: document.getElementById("editing-staff-submit-btn"),
}
let currentStaff = {
    msnv: '',
    name: '',
    position: '',
    phoneNumber: '',
    address: '',
    status: '',
}

//Khai báo phần xoá nhân viên
const deletingBox = {
    box: document.getElementById("deleting-staff-box"),
    confirmBtn: document.getElementById("deleting-staff-confirm-btn"),
    cancelBtn: document.getElementById("deleting-staff-cancel-btn"),
}

/*---------------------------Kết thúc khai báo------------------------------------*/

window.addEventListener("load", () =>{
    getStaffs();
    /*-------Tìm kiếm--------*/
    searchBox.searchBtn.addEventListener("click", search);

    /*------Thêm------------*/
    addingBox.addBtn.addEventListener("click", openAddingBox);
    addingBox.submitBtn.addEventListener("click", add);
    addingBox.cancelBtn.addEventListener("click", closeAddingBox);

    /*-------Xoá-----------*/
    deletingBox.confirmBtn.addEventListener("click", deleteStaff);
    deletingBox.cancelBtn.addEventListener("click", closeDeletingBox);

    /*-----Chỉnh sửa-------*/

    editingBox.submitBtn.addEventListener("click", update);
    editingBox.cancelBtn.addEventListener("click", closeEditingBox);

});

/*----------------------------------Phần chung---------------------------*/


/*-------------------------------Phần danh sách nhân viên--------------------------*/

function getStaffs(){
    let data = "";
    if(searchBox.keyWord === ''){
        data = "type=getStaffs";
    }else {
        data = "keyWord="+searchBox.keyWord+"&type=search";
    }
    //console.log(data);
    sendPostRequest("../php/staff.php", data, res => {
        console.log(res);
        let staffs = JSON.parse(res);
        staffs.forEach(s =>{
            staff = JSON.parse(s);
            let div = createStaffElement(staff);
            staffList.appendChild(div);
        });
    });
}

function reloadStaffs(){
    staffList.innerHTML = "";
    getStaffs();
}

function createStaffElement(data){
    let parent = document.createElement("div");
    parent.classList.add("staff-element");

    let div1 = document.createElement("div");
    let div1Title = document.createElement("div");
    div1Title.innerHTML = "Mã nhân viên";
    let msnvDiv = document.createElement("div");
    msnvDiv.innerHTML = data.msnv;
    div1.appendChild(div1Title);
    div1.appendChild(msnvDiv);

    let div2 = document.createElement("div");
    let div2Title = document.createElement("div");
    div2Title.innerHTML = "Tên nhân viên";
    let name = document.createElement("div");
    name.innerHTML = data.hoTenNV;
    div2.appendChild(div2Title);
    div2.appendChild(name);

    let div3 = document.createElement("div");
    let div3Title = document.createElement("div");
    div3Title.innerHTML = "Chức vụ";
    let position = document.createElement("div");
    position.innerHTML = data.chucVu;
    div3.appendChild(div3Title);
    div3.appendChild(position);

    let div7 = document.createElement("div");
    let editBtn = document.createElement("button");
    editBtn.innerHTML = "Chỉnh sửa";
    editBtn.id = "edit_"+data.msnv;
    editBtn.classList.add("blue-btn");
    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "Xoá";
    deleteBtn.id = "delete_"+data.msnv;
    deleteBtn.classList.add('pink-btn');
    editBtn.onclick = function (){
        let id = this.id.substring(5);
        currentStaff.msnv = id;
        openEditingBox();
    };
    deleteBtn.onclick = function (){
        let id = this.id.substring(7);
        currentStaff.msnv = id;
        openDeletingBox();
    };
    div7.appendChild(editBtn);
    div7.appendChild(deleteBtn);

    let div5 = document.createElement("div");
    let div5Title = document.createElement("div");
    div5Title.innerHTML = "Trạng thái";
    let status = document.createElement("div");
    if(data.xoa === 'true'){
        status.innerHTML = "Ngưng hoạt động";
        status.style.color = "pink";
        deleteBtn.classList.add("disable-btn");
        deleteBtn.disabled = true;
    }else {
        status.innerHTML = "Đang hoạt động";
        status.style.color = "deepskyblue";
    }
    div5.appendChild(div5Title);
    div5.appendChild(status);

    let div4 = document.createElement("div");
    let div4Title = document.createElement("div");
    div4Title.innerHTML = "Số điện thoại";
    let phoneNumber = document.createElement("div");;
    phoneNumber.innerHTML = data.soDienThoai;
    div4.appendChild(div4Title);
    div4.appendChild(phoneNumber);

    let div6 = document.createElement("div");
    let div6Title = document.createElement("div");
    div6Title.innerHTML = "Địa chỉ";
    let address = document.createElement("div");
    address.innerHTML = data.diaChi;
    div6.appendChild(div6Title);
    div6.appendChild(address);

    parent.appendChild(div1);
    parent.appendChild(div2);
    parent.appendChild(div3);
    parent.appendChild(div4);
    parent.appendChild(div5);
    parent.appendChild(div6);
    parent.appendChild(div7);

    return parent;
}

/*-------------------------------------Phần thêm nhân viên------------------------------*/
function openAddingBox(){
    addingBox.box.classList.remove("hiding-box");
}

function closeAddingBox(){
    addingBox.box.classList.add("hiding-box");
    resetAddingBox();
}

function resetAddingBox(){
    addingBox.name.value = '';
    addingBox.msnv.value = '';
    addingBox.phoneNumber.value = '';
    addingBox.address.value = '';
    addingBox.position.value = '';
}

function add(){
    let checkingResult = addingCheck();
    console.log(checkingResult)
    if(checkingResult.result){
        let name = addingBox.name.value;
        let msnv = addingBox.msnv.value;
        let phoneNumber = addingBox.phoneNumber.value;
        let address = addingBox.address.value;
        let position = addingBox.position.value;

        let data = "msnv="+msnv+"&type=getStaff";
        sendPostRequest("../php/staff.php", data, res => {
            if(res === '""'){
                let data = `name=${name}&msnv=${msnv}&phoneNumber=${phoneNumber}&address=${address}&position=${position}&type=addStaff`;
                sendPostRequest("../php/staff.php", data, res =>{
                    alert("Thêm nhân viên thành công!");
                    closeAddingBox();
                    reloadStaffs();
                });
            }else {
                alert("Vui lòng chọn mã nhân viên khác");
            }
        });
    }else {
        alert(checkingResult.message);
    }
}

function addingCheck(){
    let checkingResult = {
        result: true,
        message: ''
    }

    let msnv = addingBox.msnv.value;
    if(msnv === ''){
        checkingResult.result = false;
        checkingResult.message = "Vui lòng điền mã số nhân viên";
        return checkingResult;
    }

    if(addingBox.name.value === ''){
        checkingResult.message = "Vui lòng nhập tên nhân viên";
        checkingResult.result = false;
        return checkingResult;
    }

    if(addingBox.position.value === ''){
        checkingResult.message = "Vui lòng điền tên chức vụ";
        checkingResult.result = false;
        return checkingResult;
    }

    if(addingBox.address.value === ''){
        checkingResult.message = "Vui lòng nhập thông tin địa chỉ";
        checkingResult.result = false;
        return checkingResult;
    }

    if(addingBox.phoneNumber.value === '' || addingBox.phoneNumber.value.match("\\D+")){
        checkingResult.message = "Số điện thoại không hợp lệ";
        checkingResult.result = false;
        return checkingResult;
    }

    return checkingResult;
}

/*--------------------------------------Phần chỉnh sửa thông tin--------------------------*/
function openEditingBox(){
    editingBox.box.classList.remove("hiding-box");
    getStaffInfo();
}

function getStaffInfo(){
    let data = `msnv=${currentStaff.msnv}&type=getStaff`;
    sendPostRequest("../php/staff.php", data, res =>{
       let staff = JSON.parse(res);
       currentStaff.name = staff.hoTenNV;
       currentStaff.position = staff.chucVu;
       currentStaff.phoneNumber = staff.soDienThoai;
       currentStaff.address = staff.diaChi;
       currentStaff.status = staff.xoa;
       setStaffInfo();
    });
}

function setStaffInfo(){
    editingBox.name.value = currentStaff.name;
    editingBox.msnv.value = currentStaff.msnv;
    editingBox.position.value = currentStaff.position;
    editingBox.address.value = currentStaff.address;
    editingBox.phoneNumber.value = currentStaff.phoneNumber;
}

function closeEditingBox(){
    resetEditingBox();
    editingBox.box.classList.add("hiding-box");
}

function update(){
    let checkingResult = editingCheck();
    console.log(checkingResult)
    if(checkingResult.result){
        let name = editingBox.name.value;
        let msnv = currentStaff.msnv;
        let phoneNumber = editingBox.phoneNumber.value;
        let address = editingBox.address.value;
        let position = editingBox.position.value;

        let data = `name=${name}&msnv=${msnv}&phoneNumber=${phoneNumber}&address=${address}&position=${position}&type=updateStaff`;
        console.log(data);
        sendPostRequest("../php/staff.php", data, res =>{
            alert("Sửa thông tin nhân viên thành công!");
            closeEditingBox();
            reloadStaffs();
        });
    }else {
        alert(checkingResult.message);
    }
}

function editingCheck(){
    let checkingResult = {
        result: true,
        message: ''
    }
    if(editingBox.name.value === ''){
        checkingResult.message = "Vui lòng nhập tên nhân viên";
        checkingResult.result = false;
        return checkingResult;
    }

    if(editingBox.position.value === ''){
        checkingResult.message = "Vui lòng điền tên chức vụ";
        checkingResult.result = false;
        return checkingResult;
    }

    if(editingBox.address.value === ''){
        checkingResult.message = "Vui lòng nhập thông tin địa chỉ";
        checkingResult.result = false;
        return checkingResult;
    }

    if(editingBox.phoneNumber.value === '' || editingBox.phoneNumber.value.match("\\D+")){
        checkingResult.message = "Số điện thoại không hợp lệ";
        checkingResult.result = false;
        return checkingResult;
    }

    return checkingResult;
}

function resetEditingBox(){
    editingBox.name.value = '';
    editingBox.msnv.value = '';
    editingBox.phoneNumber.value = '';
    editingBox.address.value = '';
    editingBox.position.value = '';
}

/*--------------------------------------Phần xoá nhân viên----------------------------*/
function openDeletingBox(){
    deletingBox.box.classList.remove("hiding-box");
}

function closeDeletingBox(){
    deletingBox.box.classList.add("hiding-box");
}

function deleteStaff(){
    let data = "msnv="+currentStaff.msnv+"&type=deleteStaff";
    sendPostRequest("../php/staff.php", data, res =>{
       closeDeletingBox();
       reloadStaffs();
       alert("Xoá nhân viên thành công");
    });
}

/*----------------------------------------phần tìm kiếm---------------------------*/
function search(){
    searchBox.keyWord = searchBox.content.value;
    staffList.innerHTML = "";
    getStaffs();
}