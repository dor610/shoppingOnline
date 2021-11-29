const tabBtnContainer = document.getElementById("tab-btn-container");

const orderList = document.getElementById("order-list");
let offset = 0;
let orderStatus = '';
let currentOrder = '';
let itemList = [];
let statusList = {};

const searchBox = {
    searchBtn: document.getElementById("search-btn"),
    searchContent: document.getElementById("search-content"),
    keyWord: '',
}

const orderDetailBox = {
    box: document.getElementById("order-detail-box"),
    backBtn: document.getElementById("back-btn"),
    titleId: document.getElementById("detail-box-title"),
    status: document.getElementById("detail-box-current-status"),
    nextStatusBtn: document.getElementById("order-next-status-btn"),
    cancelOrderBtn: document.getElementById("cancel-order-btn"),
    orderInfo: {
        id: document.getElementById("order-detail-order-id"),
        paymentMethod: document.getElementById("order-detail-payment-method"),
        orderDate: document.getElementById("order-detail-order-date"),
        deliveryDate: document.getElementById("order-detail-delivery-date")
    },
    customerInfo: {
        id: document.getElementById("order-detail-customer-id"),
        name: document.getElementById("order-detail-customer-name"),
        tel: document.getElementById("order-detail-customer-tel"),
        address: document.getElementById("order-detail-customer-address"),
    },
    staffInfo: {
        id: document.getElementById("order-detail-staff-id"),
        name: document.getElementById("order-detail-staff-name"),
    },
    orderItem: {
        box: document.getElementById("order-item-box"),
        totalCost: document.getElementById("total-cost"),
    },
    editDeliveryDateBtn: document.getElementById("edit-delivery-date-btn"),
    editDeliveryDateBox:{
        box: document.getElementById("edit-delivery-date-box"),
        submitBtn: document.getElementById("edit-delivery-date-submit-btn"),
        cancelBtn: document.getElementById("edit-delivery-date-cancel-btn"),
        editValue: document.getElementById("edit-delivery-date-input"),
        titleId: document.getElementById("edit-delivery-date-title"),
    },
    totalCost: 0,
    update: {
        isValid: true,
        message: '',
    }

}

window.addEventListener("load", () =>{
    getOrderStatus();

    searchBox.searchBtn.onclick = search;

    orderDetailBox.backBtn.onclick = closeOrderDetail;
    orderDetailBox.nextStatusBtn.onclick = setStatus;
    orderDetailBox.cancelOrderBtn.onclick = cancelOrder;

    orderDetailBox.editDeliveryDateBtn.onclick = showEditDeliveryDateBox;
    orderDetailBox.editDeliveryDateBox.cancelBtn.onclick = closeEditDeliveryDateBox;
    orderDetailBox.editDeliveryDateBox.submitBtn.onclick = submitEditDeliveryDate;

    orderList.addEventListener("scroll", loadOrders);
});


function getOrderStatus(){
    statusList = {};
    let data = "type=getStatus";
    sendPostRequest("../php/order.php", data, res =>{
       console.log(res);
       let arr = JSON.parse(res);
       arr.forEach(o =>{
            let os = JSON.parse(o);
            statusList[os.mstt] = os;
       });
       setTabBtn();
    });
}

function setTabBtn(){
    tabBtnContainer.innerHTML = "";
    for(let os in statusList){
        let div = document.createElement("div");
        div.innerHTML = statusList[os].tentt;
        div.id = "s_"+statusList[os].mstt;
        div.onclick = openOrderTab;
        tabBtnContainer.appendChild(div);
    }
    document.getElementById("s_" + Object.keys(statusList)[0]).click();
}

function openOrderTab(){
    searchBox.keyWord = "";
    searchBox.searchContent.value = "";
    let id = this.id.substring(2);
    if(orderStatus !== '')
        document.getElementById("s_"+orderStatus).classList.remove("active-btn");
    resetOrderList();
    document.getElementById("s_"+id).classList.add("active-btn");
    orderStatus = id;
    getOrders();
}

function loadOrders(){
    if (orderList.offsetHeight + orderList.scrollTop >= orderList.scrollHeight) {
        orderList.removeEventListener("scroll", loadOrders);
        getOrders();
    }
}

function reloadOrders(){
    orderList.innerHTML = '';
    offset = 0;
    getOrders();
}

function getOrders(){
    let data ='';
    if(searchBox.keyWord){
        data = "madh="+searchBox.keyWord+"&offset="+offset+"&type=search";
    }else {
        data = "mstt="+orderStatus+"&offset="+offset+"&type=getOrderBasicDetail";
    }

    sendPostRequest("../php/order.php", data, res =>{
        console.log(res+"          "+ data);
        let orders = JSON.parse(res);
        orders.forEach(o =>{
            let order = JSON.parse(o);
            let div = createOrderElement(order);
            orderList.appendChild(div);
        });
    });

    offset += 15;
}

function resetOrderList(){
    orderList.innerHTML = "";
    offset = 0;
}

function createOrderElement(data){
    let parent = document.createElement("div");
    let madh = document.createElement("div");
    madh.innerHTML = data.SoDonHH;

    let customerName = document.createElement("div");
    customerName.innerHTML = data.HoTenKH;

    let staffName = document.createElement("div");
    if(data.msnv){
        sendPostRequest("../php/staff.php", "msnv="+data.msnv+"&type=getStaff", res=>{
            let s = JSON.parse(res);
            staffName.innerHTML = s.hoTenNV;
        })
    }else staffName.innerHTML = "Chưa thiết lập";

    let status = document.createElement("div");
    status.innerHTML = statusList[data.trangthai].tentt;

    let btn = document.createElement("button");
    btn.innerHTML = "Chi tiết";
    btn.id = data.SoDonHH;
    btn.classList.add("blue-btn");
    btn.onclick = getOrderDetail;

    parent.appendChild(madh);
    parent.appendChild(customerName);
    parent.appendChild(staffName);
    parent.appendChild(status);
    parent.appendChild(btn);
    parent.classList.add("order-element");
    return parent;
}

function showOrderDetail(){
    orderDetailBox.box.classList.remove("hiding-box");
    orderList.removeEventListener("scroll", loadOrders);
}

function closeOrderDetail(){
    orderDetailBox.box.classList.add('hiding-box');
    orderList.addEventListener("scroll", loadOrders);
    resetOrderDetailBox();
}

function resetOrderDetailBox(){

}

function getOrderDetail(){
    let id = this.id;
    let data = "soDonHH="+id+"&type=getOrderDetail";
    sendPostRequest("../php/order.php", data, res =>{
        //console.log(res);
       currentOrder = JSON.parse(res);
       setOrderDetail();
    });
    showOrderDetail();
}

function setOrderDetail(){
    orderDetailBox.titleId.innerHTML = currentOrder.madh;
    orderDetailBox.status.innerHTML = statusList[currentOrder.trangThai].tentt;
    if(Object.keys(statusList).indexOf(currentOrder.trangThai) + 1 < Object.keys(statusList).length - 1){
        orderDetailBox.nextStatusBtn.innerHTML = statusList[Object.keys(statusList)[Object.keys(statusList).indexOf(currentOrder.trangThai) + 1]].tentt;
        currentOrder.nextState = statusList[Object.keys(statusList)[Object.keys(statusList).indexOf(currentOrder.trangThai) + 1]].mstt;
    }
    else{
        orderDetailBox.nextStatusBtn.style.visibility = "hidden";
        orderDetailBox.cancelOrderBtn.style.visibility = "hidden";
    }

    orderDetailBox.orderInfo.id.innerHTML = currentOrder.madh;
    orderDetailBox.orderInfo.paymentMethod.innerHTML = currentOrder.thanhToan;
    orderDetailBox.orderInfo.orderDate.innerHTML = currentOrder.ngayDatHang.substring(0, currentOrder.ngayDatHang.indexOf(" "));
    if(currentOrder.ngayGiaoHang) orderDetailBox.orderInfo.deliveryDate.innerHTML = currentOrder.ngayGiaoHang.substring(0, currentOrder.ngayGiaoHang.indexOf(" "));
    else orderDetailBox.orderInfo.deliveryDate.innerHTML = "Chưa thiết lập";
    setCustomerDetail();
    setStaffDetail();
    setOrderItems();
}

function setCustomerDetail(){
    let data = "mskh="+currentOrder.mskh+"&type=getInfo";
    sendPostRequest("../php/customer.php", data, res =>{
       // console.log(res);
       let customer = JSON.parse(res);
       orderDetailBox.customerInfo.name.innerHTML = customer.hoTenKh;
       orderDetailBox.customerInfo.id.innerHTML = customer.mskh;
       orderDetailBox.customerInfo.tel.innerHTML = customer.soDienThoai;
       let data = "madc="+currentOrder.madc+"&type=getAddress";
       sendPostRequest("../php/customer.php", data, res =>{
          let address = JSON.parse(res);
          orderDetailBox.customerInfo.address.innerHTML = address.diaChi;
       });
    });
}

function setStaffDetail(){
    if(currentOrder.msnv){
        let data = "msnv="+currentOrder.msnv+"&type=getStaff";
        sendPostRequest("../php/staff.php", data, res =>{
            let staff = JSON.parse(res);
            orderDetailBox.staffInfo.id.innerHTML = staff.msnv;
            orderDetailBox.staffInfo.name.innerHTML = staff.hoTenNV;
        });
    }else {
        orderDetailBox.staffInfo.id.innerHTML = "Chưa thiết lập";
        orderDetailBox.staffInfo.name.innerHTML = "Chưa thiết lập";
    }
}

function setOrderItems(){
    let data = "madh="+currentOrder.madh+"&type=getOrderItems";
    console.log(data);
    sendPostRequest("../php/order.php", data, res =>{
        console.log(res)
        let arr = JSON.parse(res);
        orderDetailBox.orderItem.box.innerHTML = "";
        itemList = [];
        arr.forEach(i => {
           let item = JSON.parse(i);
           itemList.push(item);
           let div = createOrderItemElement(item);
           orderDetailBox.orderItem.box.appendChild(div);
           orderDetailBox.totalCost = orderDetailBox.totalCost + parseInt(item.gia)*parseInt(item.soLuong);
        });

        orderDetailBox.orderItem.totalCost.innerHTML = new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(orderDetailBox.totalCost);
    })
}

function createOrderItemElement(data){
    let parent = document.createElement("div");
    parent.classList.add("order-item-element");

    let imgBox = document.createElement("div");
    let img = document.createElement("img");
    imgBox.appendChild(img);
    let content = "mshh="+data.mshh+"&type=getItemImage";
    sendPostRequest("../php/product.php", content, res => {
        console.log(content);
        console.log(res);
       let image = JSON.parse(res);
       img.src = "../../khachhang/img/product/"+image.tenHinh+".png";
    });

    let name = document.createElement("div");
    let div = document.createElement("div");
    let size = document.createElement("div");
    let notification = document.createElement("div");

    sendPostRequest("../php/product.php", "mshh="+data.mshh+"&type=getItem", res => {
       let product = JSON.parse(res);
       name.innerHTML = product.tenHh;
    });

    sendPostRequest("../php/product.php", "mskc="+data.mskc+"&mshh="+data.mshh+"&type=getItemSize", res =>{
        console.log(res);
       let kichCo = JSON.parse(res);
       size.innerHTML = "Kích cỡ: "+kichCo.tenKichCo;
       if(parseInt(data.soLuong) > parseInt(kichCo.soLuong)){
           orderDetailBox.update.isValid = false;
           orderDetailBox.update.message = "Số lượng trong kho không đủ!";
           notification.innerHTML = "Số lượng hàng hoá trong kho không đủ!!";
       }
    });

    let quantity = document.createElement("div");
    quantity.innerHTML ="Số lượng: " + data.soLuong;
    let price = document.createElement("div");
    price.innerHTML = "Đơn giá: " + new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(data.gia);
    let itemTotalCost = document.createElement("div");
    itemTotalCost.innerHTML = "Thành tiền: " + new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format((parseInt(data.soLuong)*parseInt(data.gia))+"");

    div.appendChild(size);
    div.appendChild(quantity);
    div.appendChild(price);
    div.appendChild(itemTotalCost);

    parent.appendChild(imgBox);
    parent.appendChild(name);
    parent.appendChild(div);
    parent.appendChild(notification);

    return parent;
}


function showEditDeliveryDateBox(){
    orderDetailBox.editDeliveryDateBox.box.classList.remove("hiding-box");
    orderDetailBox.editDeliveryDateBox.titleId.innerHTML = currentOrder.madh;
    orderDetailBox.editDeliveryDateBox.editValue.min = currentOrder.ngayDatHang.substring(0, currentOrder.ngayDatHang.indexOf(" "));
    if(currentOrder.ngayGiaoHang)
        orderDetailBox.editDeliveryDateBox.editValue.value = currentOrder.ngayGiaoHang.substring(0, currentOrder.ngayGiaoHang.indexOf(" "));
}

function closeEditDeliveryDateBox(){
    orderDetailBox.editDeliveryDateBox.box.classList.add("hiding-box");
    orderDetailBox.editDeliveryDateBox.titleId.innerHTML = "";
    orderDetailBox.editDeliveryDateBox.editValue.value = "";
}

function submitEditDeliveryDate(){
    let value = orderDetailBox.editDeliveryDateBox.editValue.value;
    console.log(value);
    if(value){
        let data = "ngayGH="+value+"&madh="+currentOrder.madh+"&type=updateDeliveryDate";
        console.log(data);
        sendPostRequest("../php/order.php", data, res =>{
            console.log(res);
            orderDetailBox.orderInfo.deliveryDate.innerHTML = value;
            closeEditDeliveryDateBox();
        });
    }
}

function setStatus(){
    let data = "trangThai="+currentOrder.nextState +"&madh="+currentOrder.madh+"&type=updateOrderStatus";
    sendPostRequest("../php/order.php", data, res =>{

        if(!currentOrder.msnv){
            let msnv = getUserInfor().msnv;
            sendPostRequest("../php/order.php", "msnv="+msnv+"&madh="+currentOrder.madh+"&type=updateStaffInfo", res => {
            });
        }
        if(statusList[currentOrder.trangThai].tentt === "Chờ xác nhận"){
            itemList.forEach(item => {
               let data = `mskc=${item.mskc}&mshh=${item.mshh}&soLuong=${-item.soLuong}&type=updateItemQuantity`;
               sendPostRequest("../php/order.php", data, res =>{});
            });
        }

       document.getElementById("s_"+orderStatus).click();
       orderDetailBox.backBtn.click();
       alert("Cập nhật trạng thái thành công");
    });
}


function cancelOrder(){
    let trangthai = statusList[Object.keys(statusList)[Object.keys(statusList).length-1]].mstt;
    let data = "trangThai="+trangthai +"&madh="+currentOrder.madh+"&type=updateOrderStatus";
    sendPostRequest("../php/order.php", data, res =>{
        itemList.forEach(item => {
            let data = `mskc=${item.mskc}&mshh=${item.mshh}&soLuong=${item.soLuong}&type=updateItemQuantity`;
            sendPostRequest("../php/order.php", data, res =>{});
        });
        document.getElementById("s_"+orderStatus).click();
        orderDetailBox.backBtn.click();
        alert("Huỷ đơn hàng thành công");
    });
}


function search(){
    let keyWord = searchBox.searchContent.value;
    if(keyWord){
        searchBox.keyWord = keyWord;
        resetOrderList();
        getOrders();
        document.getElementById("s_"+orderStatus).classList.remove("active-btn");
    }
}


