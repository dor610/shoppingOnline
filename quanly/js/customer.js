//Khai báo phần thông tin khách hàng

const customerInfoBox = {
    customerInfoBox: document.getElementById("customer-info-box"),
    closeBtn: document.getElementById("customer-info-close-btn"),
    mskh: document.getElementById("customer-info-mskh"),
    name: document.getElementById("customer-info-name"),
    phoneNumber: document.getElementById("customer-info-phone-number"),
    addressBox: document.getElementById("customer-info-address-box"),
    email: document.getElementById("customer-info-email"),
    status: document.getElementById("customer-info-account-status"),
}

let currentCustomer = {
    mskh: '',
    name: '',
    phoneNumber: '',
    address: {},
    email: '',
    orders: [],
    status: "",
}

//Khai báo phần danh sách khách hàng
let offset = 0;
const customerList = document.getElementById("customer-list");

//Khai báo phần danh sách đơn hàng
const orderBox = {
    orderBox: document.getElementById("customer-order-box"),
    closeBtn: document.getElementById("customer-order-close-btn"),
    orderList: document.getElementById("customer-order-list"),
}


//Khai báo phần xoá khách hàng

const deletingBox = {
    box: document.getElementById("deleting-customer-box"),
    confirmBtn: document.getElementById("deleting-box-confirm-btn"),
    cancelBtn: document.getElementById("deleting-box-cancel-btn"),
}

//Phần tìm kiếm
const searchBox={
    content: document.getElementById("search-content"),
    searchBtn: document.getElementById("search-btn"),
    keyWord: '',
}


/*-------------------------Kết thúc khai báo--------------------------------*/

window.addEventListener("load", () =>{
    /*----------------Tìm kiếm--------------------*/
    searchBox.searchBtn.addEventListener("click", search);
    /*------------------Danh sách khách hàng---------------*/
    customerList.addEventListener("scroll", loadData);
    getCustomers();

    /*------------------thông tin khách hàng---------------*/
    customerInfoBox.closeBtn.addEventListener("click", closeCustomerInfoBox);

    /*-----------------Danh sách đơn hàng-----------------*/
    orderBox.closeBtn.addEventListener("click", closeOrderBox);

    /*-----------------Xoá khách hàng--------------------*/
    deletingBox.confirmBtn.addEventListener("click", deleteCustomer);
    deletingBox.cancelBtn.addEventListener("click", closeDeletingBox)



});

/*--------------------phần dùng chung--------------------------*/


/*--------------------------Phần danh sách khách hàng-----------------------*/
function loadData(){
    if (customerList.offsetHeight + customerList.scrollTop >= customerList.scrollHeight) {
        customerList.removeEventListener("scroll", loadData);
        getCustomers();
    }
}

function getCustomers(){
    console.log("đang lấy");
    let content = "";
    if(searchBox.keyWord === '')
        content = "offset="+offset+"&soLuong="+15+"&type=getCustomers";
    else content = "offset="+offset+"&soLuong="+15+"&keyWord="+searchBox.keyWord+"&type=search";
    sendPostRequest("../php/customer.php", content, res =>{
        console.log(res);
        let data = JSON.parse(res);
        data.forEach(item =>{
            let customer = JSON.parse(item);
            console.log(customer);
            let child = createCustomerElement(customer);
            customerList.appendChild(child);
            customerList.addEventListener("scroll", loadData);
        });
    });
    offset +=15;
}

function reloadData(){
    customerList.innerHTML = "";
    offset = 0;
    searchBox.keyWord = '';
    getCustomers();
}

function createCustomerElement(data){
    let parent= document.createElement("div");
    let mskhDiv = document.createElement("div");
    let nameDiv = document.createElement("div");
    let statusDiv = document.createElement("div");
    let infoBtn = document.createElement("button");
    let orderBtn = document.createElement("button");
    let deleteBtn = document.createElement("button");

    mskhDiv.innerHTML = data.mskh;
    nameDiv.innerHTML = data.hoTenKh;
    if (data.xoa === 'true'){
        statusDiv.innerHTML = "Ngưng hoạt động";
        deleteBtn.disabled = true;
        deleteBtn.classList.add("disable-btn");
    }else statusDiv.innerHTML = "Đang hoạt động";

    infoBtn.id = "info_"+data.mskh;
    infoBtn.innerHTML = "Thông tin";
    infoBtn.classList.add("blue-btn");
    orderBtn.id = "order_"+data.mskh;
    orderBtn.innerHTML = "Đơn hàng"
    orderBtn.classList.add("blue-btn");
    deleteBtn.id = "delete_"+data.mskh;
    deleteBtn.innerHTML = "Xoá";
    deleteBtn.classList.add('pink-btn');

    infoBtn.onclick = function (){
        let id = this.id.substring(5);
        currentCustomer.mskh = id;
        customerList.removeEventListener("scroll", loadData);
        openCustomerInfoBox();
    }
    orderBtn.onclick = function (){
        let id = this.id.substring(6);
        currentCustomer.mskh = id;
        customerList.removeEventListener("scroll", loadData);
        openOrderBox();
    }
    deleteBtn.onclick = function (){
        let id = this.id.substring(7);
        currentCustomer.mskh = id;
        customerList.removeEventListener("scroll", loadData);
        openDeletingBox();
    }

    parent.appendChild(mskhDiv);
    parent.appendChild(nameDiv);
    parent.appendChild(statusDiv);
    parent.appendChild(infoBtn);
    parent.appendChild(orderBtn);
    parent.appendChild(deleteBtn);
    return parent;
}


/*---------------------phần thông tin khách hàng---------------------------*/

function openCustomerInfoBox(){
    getCustomerInfo();
    customerInfoBox.customerInfoBox.classList.remove("hiding-box");
}

function closeCustomerInfoBox(){
    customerInfoBox.customerInfoBox.classList.add("hiding-box");
    customerList.addEventListener("scroll", loadData);
    resetCustomerInfoBox();
}

function resetCustomerInfoBox(){
    customerInfoBox.name.innerHTML = "";
    customerInfoBox.mskh.innerHTML = "";
    customerInfoBox.phoneNumber.innerHTML = "";
    customerInfoBox.addressBox.innerHTML = "";
    customerInfoBox.email.innerHTML = "";
    currentCustomer = {
        mskh: '',
        name: '',
        phoneNumber: '',
        address: {},
        email: '',
        orders: [],
    }
}

function getCustomerInfo(){
    let data = "mskh="+currentCustomer.mskh+"&type=getInfo";
    sendPostRequest("../php/customer.php", data, res =>{
        console.log(res);
       let cusInfo = JSON.parse(res);
       currentCustomer.name = cusInfo.hoTenKh;
       currentCustomer.phoneNumber = cusInfo.soDienThoai;
       currentCustomer.email = cusInfo.email;
       if(cusInfo.xoa === 'true'){
           currentCustomer.status = "Ngưng hoạt động";
       }else currentCustomer.status = "Đang hoạt động";
       getCustomerAddresses();
       setCustomerInfo();
    });
}

function setCustomerInfo(){
    customerInfoBox.name.innerHTML = currentCustomer.name;
    customerInfoBox.mskh.innerHTML = currentCustomer.mskh;
    customerInfoBox.phoneNumber.innerHTML = currentCustomer.phoneNumber;
    customerInfoBox.email.innerHTML = currentCustomer.email;
    customerInfoBox.status.innerHTML = currentCustomer.status;
}

function getCustomerAddresses(){
    let data = "mskh="+currentCustomer.mskh+"&type=getAddresses";
    sendPostRequest("../php/customer.php", data, res =>{
        console.log(res);
       let addresses = JSON.parse(res);
       addresses.forEach(a => {
          address = JSON.parse(a);
          currentCustomer.address[address.madc] = address;
       });
       setCustomerAddresses();
    });
}

function setCustomerAddresses(){
    customerInfoBox.addressBox.innerHTML = "";
    for (let address in currentCustomer.address){
        console.log(address);
        let div = document.createElement("div");
        div.innerHTML = currentCustomer.address[address].diaChi;
        customerInfoBox.addressBox.appendChild(div);
    }
}



/*--------------------------phần đơn hàng----------------------------------*/

function openOrderBox() {
    orderBox.orderBox.classList.remove("hiding-box");
    getOrders();
}

function closeOrderBox(){
    resetOrderBox();
    orderBox.orderBox.classList.add("hiding-box");
    customerList.addEventListener("scroll", loadData);
}

function resetOrderBox(){
    orderBox.orderList.innerHTML = "";
    currentCustomer.orders = [];
}

function getOrders(){
    let data = "mskh="+currentCustomer.mskh+"&type=customerOrder";
    sendPostRequest("../php/customer.php", data, res =>{
        //console.log(res);
        let orders =JSON.parse(res);
        orders.forEach(o => {
            let order = JSON.parse(o);
            console.log(order);
            currentCustomer.orders.push(order);
        });
        setOrders();
    });
}

function setOrders(){
    orderBox.orderList.innerHTML = "";
    currentCustomer.orders.forEach(o =>{
       let div = createOrderElement(o);
       orderBox.orderList.appendChild(div);
    });
}


function createOrderElement(data){
    let parent = document.createElement("div");
    parent.classList.add("order-element");

    let div1 = document.createElement("div");
    let div1Title = document.createElement("div");
    div1Title.innerHTML = "Mã đơn hàng";
    let madh = document.createElement("div");
    madh.innerHTML = data.SoDonHH;
    div1.appendChild(div1Title);
    div1.appendChild(madh);

    let div2 = document.createElement("div");
    let div21 = document.createElement("div");
    let div2Title1 = document.createElement("div");
    div2Title1.innerHTML = "Nhân viên xác nhận";
    let staffName = document.createElement("div");
    if(data.msnv){
        let data = "msnv="+data.msnv+"&type=getStaff";
        sendPostRequest("../php/staff.php", data, res =>{
           staffName.innerHTML = JSON.parse(res).HoTenNV;
        });
    }else {
        staffName.innerHTML = "Chưa thiết lập";
    }


    div21.appendChild(div2Title1);
    div21.appendChild(staffName);
    let div22 = document.createElement("div");
    let div2Title2 = document.createElement("div");
    div2Title2.innerHTML = "Loại thanh toán";
    let paymentMethod = document.createElement("div");
    paymentMethod.innerHTML = data.thanhtoan;
    div22.appendChild(div2Title2);
    div22.appendChild(paymentMethod);
    div2.appendChild(div21);
    div2.appendChild(div22);

    let div3 = document.createElement("div");
    let div31 = document.createElement("div");
    let div32 = document.createElement("div");
    let div33 = document.createElement("div");

    let div31Title = document.createElement("div");
    div31Title.innerHTML = "Trạng thái";
    let status = document.createElement("div");
    status.innerHTML = data.tenTT;
    div31.appendChild(div31Title);
    div31.appendChild(status);

    let div32Title = document.createElement("div");
    div32Title.innerHTML = "Ngày đặt hàng";
    let orderDate = document.createElement("div");
    orderDate.innerHTML = data.ngayDH;
    div32.appendChild(div32Title);
    div32.appendChild(orderDate);

    let div33Title = document.createElement("div");
    div33Title.innerHTML = "Ngày giao hàng";
    let deliveryDate = document.createElement("div");
    if(data.ngayGH){
        deliveryDate.innerHTML = data.ngayGH;
    }else {
        deliveryDate.innerHTML = "Chưa thiết lập"
    }
    div33.appendChild(div33Title);
    div33.appendChild(deliveryDate);

    div3.appendChild(div31);
    div3.appendChild(div32);
    div3.appendChild(div33);

    let div4 = document.createElement("div");
    let div4Title = document.createElement("div");
    div4Title.innerHTML = "Địa chỉ nhận hàng";
    let address = document.createElement("div");
    address.innerHTML = data.DiaChi;
    div4.appendChild(div4Title);
    div4.appendChild(address);

    parent.appendChild(div1);
    parent.appendChild(div2);
    parent.appendChild(div3);
    parent.appendChild(div4);

    return parent;
}

/*--------------------------phần xoá khách hàng----------------------------*/

function openDeletingBox(){
    deletingBox.box.classList.remove("hiding-box");
}

function closeDeletingBox(){
    deletingBox.box.classList.add("hiding-box");
}

function deleteCustomer(){
    let data = "mskh="+currentCustomer.mskh+"&type=deleteCustomer";
    sendPostRequest("../php/customer.php", data, res =>{
       alert("Xoá khách hàng thành công!");
       reloadData();
       closeDeletingBox();
    });
}


/*-------------------------Phần tìm kiếm-------------------------------------*/

function search(){
    let keyWord = searchBox.content.value;
    searchBox.keyWord = keyWord;
    offset = 0;
    customerList.innerHTML = "";
    getCustomers();
}