const navBar = {
    profile: document.getElementById("profile-btn"),
    order: document.getElementById("order-btn"),
}

const profileTab = {
    tab: document.getElementById("profile-tab"),
    userName: document.getElementById("user-name"),
    name: document.getElementById("name"),
    tel: document.getElementById("tel"),
    email: document.getElementById("email"),
    addressBox: {
        addBtn: document.getElementById("add-address-btn"),
        box: document.getElementById("address-box"),
    }
}

const profileEditBtn = {
    name: document.getElementById("edit-name"),
    tel: document.getElementById("edit-tel"),
    email: document.getElementById("edit-email")
}

const editBox = {
    box: document.getElementById("edit-box"),
    title: document.getElementById("edit-box-title"),
    input: document.getElementById("edit-box-input"),
    submitBtn: document.getElementById("edit-box-submit-btn"),
    cancelBtn: document.getElementById("edit-box-cancel-btn"),
}

let user = '';
let userAddress = {};
let statusList = {};
let offset = 0;


const orderTab = {
    tab: document.getElementById("order-tab"),
    orderBox: document.getElementById("order-box"),
}

const orderDetailBox = {
    box: document.getElementById("order-detail-box"),
    title: {
        id: document.getElementById("detail-box-title"),
        backBtn: document.getElementById("back-btn"),
    },
    status: {
        title: document.getElementById("detail-box-current-status"),
        cancelBtn: document.getElementById("cancel-order-btn"),
    },
    detail: {
        id: document.getElementById("order-detail-order-id"),
        payment: document.getElementById("order-detail-payment-method"),
        orderDate: document.getElementById("order-detail-order-date"),
        deliveryDate: document.getElementById("order-detail-delivery-date"),
    },
    address: document.getElementById("delivery-address"),
    itemBox: {
        box: document.getElementById("order-item-box"),
        cost: document.getElementById("total-cost"),
    }
}

let currentOrder = {};





window.addEventListener("load", () =>{
   navBar.profile.onclick = openProfileTab;
   navBar.order.onclick = openOrderTab;
   getOrderStatus();

   profileTab.addressBox.addBtn.addEventListener("click", () =>{
      openEditBox("address", "Thêm địa chỉ mới", "Thêm", "Nhập địa chỉ", 'addAddress');
   });

   profileEditBtn.name.addEventListener("click", () => {
       openEditBox("hoTen", "Cập nhật tên", "Cập nhật", "Nhập tên mới", "update");
   })
    profileEditBtn.email.addEventListener("click", () =>{
        openEditBox("email", "Cập nhật email", "Cập nhật", "Nhập email", "update");
    })
    profileEditBtn.tel.addEventListener("click", () =>{
       openEditBox("sdt", "Cập nhật số điện thoại", "Cập nhật", "Nhập Số điện thoại", "update");
    });

   navBar.profile.click();

   orderDetailBox.status.cancelBtn.onclick = cancelOrder;
});

function getOrderStatus(){
    statusList = {};
    let data = "type=getStatus";
    sendPostRequest("../php/product.php", data, res =>{
        //console.log(res);
        let arr = JSON.parse(res);
        arr.forEach(o =>{
            let os = JSON.parse(o);
            statusList[os.mstt] = os;
        });
    });
}


function openProfileTab(){
    this.classList.add("active-nav-btn");
    navBar.order.classList.remove("active-nav-btn");
    orderTab.tab.classList.add("hiding-box");

    profileTab.tab.classList.remove("hiding-box");
    setUserProfile();
}

function setUserProfile(){
    user = getUserInfor();
    profileTab.userName.innerHTML = user.mskh;
    profileTab.name.innerHTML = user.hoTen;
    profileTab.tel.innerHTML = user.sdt;
    if(user.email) profileTab.email.innerHTML = user.email;
    else profileTab.email.innerHTML = "Chưa thiết lập";
    setUserAddress();
}

function setUserAddress(){
    let data = "mskh="+user.mskh+"&type=getAddresses";
    profileTab.addressBox.box.innerHTML = '';
    userAddress = {};
    sendPostRequest("../php/account.php", data, res => {
        //console.log(res);
        let addresses = JSON.parse(res);
        if(addresses.length === 1){
            userAddress[address.madc] = address;
            let parent = document.createElement("div");
            let div = document.createElement("div");
            div.innerHTML = addresses[0].diaChi;
            parent.appendChild(div);
            profileTab.addressBox.box.appendChild(parent);
        }else {
            addresses.forEach(a =>{
                let address = JSON.parse(a);
                userAddress[address.madc] = address;
                let div = createAddressElement(address);
                profileTab.addressBox.box.appendChild(div);
            });
        }
    });
}

function createAddressElement(address){
    let parent = document.createElement("div");
    let div = document.createElement("div");
    div.innerHTML = address.diaChi;
    let btn = document.createElement("button");
    btn.innerHTML = "Xoá";
    btn.classList.add('pink-btn');
    btn.id = address.madc;
    btn.onclick = function (){
        let id = this.id;
        let result = confirm("Bạn chắc chắn muốn xoá");
        if(result){
            let data = "madc="+id+"&type=removeAddress";
            sendPostRequest("../php/account.php", data, res=>{
               setUserAddress();
            });
        }
    }
    parent.appendChild(div);
    parent.appendChild(btn);
    return parent;
}

function openEditBox(id, title, submitBtnLabel, placeHolder, type){
    editBox.box.classList.remove("hiding-box");
    editBox.title.innerHTML = title;
    editBox.submitBtn.innerHTML = submitBtnLabel;
    editBox.input.placeholder = placeHolder;
    if(type === "update")
        editBox.submitBtn.onclick = function (){
            console.log("hihi ");
            updateProfile(id, editBox.input.value);
        };
    else if(type === "addAddress")
        editBox.submitBtn.onclick = function (){
            console.log("hihi");
            addAddress(editBox.input.value);
        };
    editBox.cancelBtn.onclick = function (){
        editBox.box.classList.add('hiding-box');
        editBox.input.value = '';
    }
}

function updateProfile(id, value){
    if(!value) alert("Giá trị không hợp lệ!");
    else {
        let data = "mskh="+user.mskh+"&value="+value+"&type=update"+id;
        console.log(data);
        sendPostRequest("../php/account.php", data, res =>{
           user[id] = value;
           setUserInfor(user);
           navBar.profile.click();
           editBox.cancelBtn.click();
           alert("Cập nhật thành công!");
        });
    }
}

function addAddress(value){
    if(!value) alert("Giá trị không hợp lệ!");
    else {
        let data = "mskh="+user.mskh+"&address="+value+"&type=addAddress";
        sendPostRequest("../php/account.php", data, res =>{
           console.log(res);
           setUserAddress();
           editBox.cancelBtn.click();
           alert("Thêm địa chỉ thành công!");
        });
    }
}
/*--------------------------------------------------------------------*/

function openOrderTab(){
    this.classList.add("active-nav-btn");
    navBar.profile.classList.remove("active-nav-btn");
    profileTab.tab.classList.add("hiding-box");
    orderTab.tab.classList.remove('hiding-box');
    orderTab.orderBox.addEventListener('scroll', loadOrders);
    getOrders();
}

function loadOrders(){
    if (orderTab.orderBox.offsetHeight + orderTab.orderBox.scrollTop >= orderTab.orderBox.scrollHeight) {
        orderTab.orderBox.removeEventListener("scroll", loadOrders);
        getOrders();
    }
}

function reloadOrders(){
    orderTab.orderBox.innerHTML = '';
    offset = 0;
    getOrders();
}

function getOrders(){
    let data = "mskh="+user.mskh+"&offset="+offset+"&type=getOrders";
    console.log(data);
    sendPostRequest("../php/product.php", data, res =>{
        //console.log(res);
        let orders = JSON.parse(res);
        orders.forEach(o =>{
           let order = JSON.parse(o);
           let div = createOrderElement(order);
            orderTab.orderBox.appendChild(div);
        });

        offset+=15;
    });
}

function createOrderElement(data){
    let parent = document.createElement("div");
    let div1 = document.createElement("div");
    div1.innerHTML = data.soDonHH;

    let div2 = document.createElement("div");
    div2.innerHTML = statusList[data.trangThai].tentt;

    if(data.trangThai === '00005') div2.style.color = 'pink';
    else div2.style.color = "skyblue";

    let div3 = document.createElement("div");
    div3.innerHTML = data.ngayDatHang.substring(0, data.ngayDatHang.indexOf(" "));

    let div4 = document.createElement("div");
    if(data.ngayGiaoHang) div4.innerHTML = data.ngayGiaoHang.substring(0, data.ngayGiaoHang.indexOf(" "));
    else div4.innerHTML = "Chưa thiết lập";

    let btn = document.createElement("button");
    btn.id = data.soDonHH;
    btn.classList.add("blue-btn");
    btn.innerHTML = "Chi tiết";
    btn.onclick = openOrderDetailBox;

    parent.appendChild(div1);
    parent.appendChild(div2);
    parent.appendChild(div3);
    parent.appendChild(div4);
    parent.appendChild(btn);
    return parent;
}


function openOrderDetailBox(){
    orderTab.orderBox.removeEventListener('scroll', loadOrders);
    orderDetailBox.box.classList.remove("hiding-box");
    let id = this.id;
    currentOrder.madh = id;
    getOrder();
}

function getOrder(){
    let data = "madh="+currentOrder.madh+"&type=getOrder";
    sendPostRequest("../php/product.php", data, res =>{
       let order = JSON.parse(res);
       currentOrder = order;
       setOrderDetail();
    });
}

function setOrderDetail(){
    orderDetailBox.title.id.innerHTML = currentOrder.soDonHH;
    orderDetailBox.title.backBtn.onclick = closeOrderDetailBox;

    orderDetailBox.status.title.innerHTML = statusList[currentOrder.trangThai].tentt;
    if(currentOrder.trangThai !== '00001')
        orderDetailBox.status.cancelBtn.style.display = "none";

    orderDetailBox.detail.id.innerHTML = currentOrder.soDonHH;
    orderDetailBox.detail.payment.innerHTML = currentOrder.thanhToan;
    orderDetailBox.detail.orderDate.innerHTML = currentOrder.ngayDatHang.substring(0, currentOrder.ngayDatHang.indexOf(" "));
    if(currentOrder.ngayGiaoHang) orderDetailBox.detail.deliveryDate.innerHTML = currentOrder.ngayGiaoHang.substring(0, currentOrder.ngayGiaoHang.indexOf(" "));
    else orderDetailBox.detail.deliveryDate.innerHTML = "Chưa thiết lập";

    setOrderDeliveryAddress();
    getOrderItems();
}

function setOrderDeliveryAddress(){
    let data = "type=getAddress&madc="+currentOrder.madc;
    sendPostRequest("../php/account.php", data, res=>{
        console.log(res);
       let address = JSON.parse(res);
        orderDetailBox.address.innerHTML = address.diaChi;
    });
}


function getOrderItems(){
    let data = "type=getOrderItems&madh="+currentOrder.soDonHH;
    let cost = 0;
    sendPostRequest("../php/product.php", data, res =>{
        console.log(res);
       let items = JSON.parse(res);
       orderDetailBox.itemBox.box.innerHTML = '';
       items.forEach(i =>{
          let item = JSON.parse(i);
          let div = createOrderItemElement(item);
          cost += parseInt(item.SoLuong)*parseInt(item.GiaDatHang);
          orderDetailBox.itemBox.box.appendChild(div);
       });
       orderDetailBox.itemBox.cost.innerHTML = new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(cost);
    });
}

function createOrderItemElement(data){
    let parent = document.createElement("div");
    parent.classList.add("order-item-element");

    let imgBox = document.createElement("div");
    let img = document.createElement("img");
    imgBox.appendChild(img);
    setImg(img, data.mshh);

    let name = document.createElement("div");
    name.innerHTML = data.Tenhh;

    let div = document.createElement("div");
    let size = document.createElement("div");
    size.innerHTML = "Kích cỡ: "+ data.TenKichCo;

    let quantity = document.createElement("div");
    quantity.innerHTML = "Số lượng: "+ data.SoLuong;

    let price = document.createElement("div");
    price.innerHTML ="Đơn giá: "+ new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(parseInt(data.GiaDatHang));

    let totalCost = document.createElement("div");
    let cost = 0;
    cost += parseInt(data.SoLuong)*parseInt(data.GiaDatHang);
    totalCost.innerHTML ="Thành tiền: " + new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(cost);

    div.appendChild(size);
    div.appendChild(quantity);
    div.appendChild(price);
    div.appendChild(totalCost);

    parent.appendChild(imgBox);
    parent.appendChild(name);
    parent.appendChild(div);
    return parent;
}

function setImg(img, mshh){
    let data = 'mshh='+mshh+'&type=getItemImage';
    sendPostRequest('../php/product.php', data, res =>{
        let image = JSON.parse(res);
        img.src = '../img/product/'+image.tenHinh+'.png';
    });
}

function cancelOrder(){
    let result = confirm("Bạn có chắc chắn muốn huỷ đơn hàng này?");
    if(result){
        let data = "type=cancelOrder&madh="+currentOrder.soDonHH;
        sendPostRequest("../php/product.php", data, res =>{
            alert("Đơn hàng đã huỷ thành công!");
            reloadOrders();
            closeOrderDetailBox();
        });
    }
}

function closeOrderDetailBox(){
    orderTab.orderBox.addEventListener('scroll', loadOrders);
    orderDetailBox.box.classList.add("hiding-box");
}