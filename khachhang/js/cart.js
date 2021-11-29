const cartItem = document.getElementById('cart-item');
const totalCost = {
    element: document.getElementById('total-cost'),
    cost: 0,
}
const buyBtn = document.getElementById('buy-btn');
let items = [];
let chosenItem = [];
const container = document.getElementById("container");
const noti = document.getElementById("noti");
const toProductTabBtn = document.getElementById("to-product-tab-btn");

const orderBox = document.getElementById("order-box");
const orderCustomerInfoBox = {
    box: document.getElementById("order-customer-info"),
    nextState: document.getElementById("next-state"),
    backBtn: document.getElementById("back-btn"),
}
const orderConfirmingBox = {
    box: document.getElementById("order-confirming-box"),
    itemBox: document.getElementById("order-item-box"),
    orderBtn: document.getElementById("order-btn"),
    totalCost: document.getElementById("order-total-cost"),
    cancelBtn: document.getElementById("cancel-btn"),
}
//Thông tin khách hàng khi chưa đăng nhập
const guestInfoForm = {
    form: document.getElementById("guest-info"),
    name: document.getElementById("guest-name"),
    tel: document.getElementById("guest-tel"),
    address: document.getElementById("guest-address"),
    loginBtn: document.getElementById("login-btn"),
}

//Thông tin khách hàng nếu đã đăng nhập
const customerInfoTab = {
    infoTab: document.getElementById("cus-info"),
    name: document.getElementById("cus-name"),
    tel: document.getElementById("cus-tel"),
    addressBox: {
        box: document.getElementById("cus-address-box"),
        arrow: document.getElementById('down-arrow'),
        label: document.getElementById("cus-address-label"),
    },
}

const paymentMethod = {
    cod: document.getElementById('cod'),
    bankTransfer: document.getElementById("bank-transfer"),
}

//Thông tin đặt hàng
const customerOrderInfo = {
    madc: '',
    sdhh: '',
    paymentMethod: 'COD',
}
const guestOrderInfo =  {
  name: '',
  address: '',
  tel: '',
  sdhh: '',
}

window.addEventListener("load", () =>{
    getCartItem();
    buyBtn.addEventListener("click", buy);
    guestInfoForm.loginBtn.addEventListener("click", toLoginForm);
    toProductTabBtn.addEventListener("click", function (){
       location.href = '../html/product.html';
    });
    customerInfoTab.addressBox.arrow.addEventListener("click", () =>{
        customerInfoTab.addressBox.arrow.classList.toggle('up-arrow');
        customerInfoTab.addressBox.box.classList.toggle('hiding-box');
    });

    paymentMethod.cod.onclick = function (){
        customerOrderInfo.paymentMethod = 'COD';
    }
    paymentMethod.bankTransfer.onclick = function (){
        customerOrderInfo.paymentMethod = "Chuyển khoản ngân hàng";
    }

    orderCustomerInfoBox.nextState.onclick = openOrderTab;
    orderConfirmingBox.orderBtn.onclick = order;

    orderCustomerInfoBox.backBtn.onclick = cancel;
    orderConfirmingBox.cancelBtn.onclick = cancel;
});

//Hiển thị các phần tử của giỏ hàng
function setCartItem(){
    buyBtn.removeEventListener("click", buy);
    cartItem.innerHTML = '';
    if(items.length !== 0){
        for(let count = 0; count < items.length; count++ ){
            let div = generateItemElement(count, items[count], "cart");
            cartItem.appendChild(div);
        }
    }
    buyBtn.addEventListener("click", buy);
    totalCost.element.innerHTML = new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(totalCost.cost);
}


//Tạo phần tử giỏ hàng
function generateItemElement(id ,item, type){
    let divParent = document.createElement('div');

    let name = document.createElement('div');
    name.innerHTML = item.tenHh;
    let img = document.createElement('img');
    let div1 = document.createElement('div');

    setImg(img, item.mshh);
    div1.appendChild(img);
    div1.appendChild(name);

    let price = document.createElement('div');
    price.innerHTML = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND'}).format(item.gia);
    let quantity = document.createElement('div');
    quantity.innerHTML = item.soLuong;
    let size = document.createElement('div');
    size.innerHTML = item.kichCo;
    let total = document.createElement('div');
    total.innerHTML = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND'}).format(parseInt(item.gia) * parseInt(item.soLuong));

    if(type === 'cart'){
        let input = document.createElement("input");
        input.type = 'checkbox';
        input.id = 'c_'+id;

        input.onclick = function (){
            let id = this.id.substring(2);

            if (this.checked === true){
                chosenItem.push(id);
                totalCost.cost += items[id].soLuong * parseInt(items[id].gia);
                totalCost.element.innerHTML = new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(totalCost.cost);
            }else {
                chosenItem.splice(chosenItem.indexOf(parseInt(id)), 1);
                totalCost.cost -= items[id].soLuong * parseInt(items[id].gia);
                totalCost.element.innerHTML = new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(totalCost.cost);
            }

            if(chosenItem.length === 0) {
                buyBtn.disabled = true;
                buyBtn.classList.add('disable-btn');
            }else {
                buyBtn.disabled = false;
                buyBtn.classList.remove("disable-btn");
            }
        }
        divParent.appendChild(input);
    }

    divParent.appendChild(div1);
    divParent.appendChild(price);
    divParent.appendChild(quantity);
    divParent.appendChild(size);
    divParent.appendChild(total);

    if(type === 'cart'){
        let deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = 'Xoá';
        deleteBtn.id = "d_"+id;
        deleteBtn.onclick = xoaHangHoa;
        divParent.appendChild(deleteBtn);
    }

    return divParent
}

function setImg(img, mshh){
    let data = 'mshh='+mshh+'&type=getItemImage';
    sendPostRequest('../php/product.php', data, res =>{
        let image = JSON.parse(res);
        img.src = '../img/product/'+image.tenHinh+'.png';
    });
}

//Lấy hàng hoá trong giỏ hàng
function getCartItem(){
    if(JSON.parse(getData('loggedIn'))){
        let mskh = getUserInfor().mskh;
        let data = 'mskh='+mskh+'&type=layGioHang';
        sendPostRequest('../php/product.php', data, response =>{
            //console.log(response);
            let arr = JSON.parse(response);
            //console.log(arr);
            items = [];
            for (let count = 0; count < arr.length; count++){
                //console.log(arr[count]);
                let data = JSON.parse(arr[count]);
                //console.log(data);
                let item = {};
                item.mshh = data.mshh;
                item.mskh = data.mskh;
                item.mskc = data.mskc;
                item.soLuong = data.SoLuong;
                item.gia = data.Gia;
                item.kichCo = data.TenKichCo;
                item.tenHh = data.Tenhh;

                items[count] = item;
            }

            if(items.length === 0) {
                noti.style.display = "block";
            }else {
                noti.style.display = "none";
            }

            setCartItem();
        });
    }else {
        if(getData('cart')){
            let cart = JSON.parse(getData('cart'));
            //console.log(JSON.parse(cart[0]));
            items = [];
            for (let count = 0; count < cart.length; count++){
                //console.log(cart[count]);
                let data = JSON.parse(cart[count]);
                console.log(data);
                let item = {};
                item.mshh = data.mshh;
                item.mskc = data.mskc;
                item.soLuong = data.soLuong;
                item.gia = data.gia;
                item.kichCo = data.kichCo;
                item.tenHh = data.tenHh;

                items[count] = item;
            }

        }

        if(items.length === 0) {
            noti.style.display = "block";
        }else {
            noti.style.display = "none";
        }

        setCartItem();
    }
}

function xoaHangHoa(){
    let id = this.id.substring(2);
    if(JSON.parse(getData('loggedIn'))){
        let data = 'mshh='+items[id].mshh+'&mskc='+items[id].mskc+'&mskh='+items[id].mskh+'&type=xoaGioHang';
        sendPostRequest('../php/product.php', data, response =>{
            console.log(response);
            getCartItem();
        });
    }else {
        items.splice(parseInt(id), 1);
        setCart(items);
        getCartItem();
    }
}

//Xử lý chức năng nút mua hàng
function buy(){
    //Nếu người dùng đã đăng nhập
    orderBox.classList.remove("hiding-box");
    orderCustomerInfoBox.box.classList.remove("hiding-box");
    if(JSON.parse(getData("loggedIn"))){
        customerInfoTab.infoTab.classList.remove("hiding-box");
        let userInfo = JSON.parse(getData('userInfor'));

        customerInfoTab.name.innerHTML = userInfo.hoTen;
        customerInfoTab.tel.innerHTML = userInfo.sdt;

        let data = 'mskh='+userInfo.mskh+"&type=getAddresses";

        sendPostRequest('../php/account.php', data, response =>{
            let addresses = JSON.parse(response);
            console.log(response);
            customerInfoTab.addressBox.box.innerHTML = '';
            addresses.forEach(a =>{
                let address = JSON.parse(a);
                //console.log(address)
                let div = document.createElement('div');
                div.innerHTML = address.diaChi;
                div.id = address.madc;
                div.onclick = function (){
                    customerInfoTab.addressBox.label.innerHTML = this.innerHTML;
                    //console.log(this.id);
                    customerOrderInfo.madc = this.id;
                    customerInfoTab.addressBox.arrow.click();
                }
                customerInfoTab.addressBox.box.appendChild(div);
            });
            let addr = JSON.parse(addresses[0]);
            //console.log(addr.maDc);
            customerInfoTab.addressBox.label.innerHTML = addr.diaChi;
            customerOrderInfo.madc = addr.madc;
        });

    }else {
        guestInfoForm.form.classList.remove("hiding-box");
    }
}

//Xử lý chức năng nút đặt hàng
function openOrderTab(){
    let isValid = true;
    if(!JSON.parse(getData("loggedIn"))){
        if(guestInfoForm.name.value === '') isValid = false;
        else guestOrderInfo.name = guestInfoForm.name.value;
        if(guestInfoForm.address.value === '') isValid = false;
        else guestOrderInfo.address = guestInfoForm.address.value;
        if(guestInfoForm.tel.value === '' || guestInfoForm.tel.value.match("\\D+")) isValid = false;
        else guestOrderInfo.tel = guestInfoForm.tel.value;
    }
    if(isValid){
        orderCustomerInfoBox.box.classList.add("hiding-box");
        orderConfirmingBox.box.classList.remove('hiding-box');
        orderConfirmingBox.totalCost.innerHTML = new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(totalCost.cost);
        orderConfirmingBox.itemBox.innerHTML = '';
        chosenItem.forEach(i =>{
            let div = generateItemElement(1,items[i], 'order');
            orderConfirmingBox.itemBox.appendChild(div);
        });
    }else {
        alert("Vui lòng điền đủ thông tin!");
    }
}

function order(){
    if(JSON.parse(getData('loggedIn'))){
        let userInfo = getUserInfor();
        let data = "mskh="+userInfo.mskh+"&madc="+customerOrderInfo.madc+"&thanhToan="+customerOrderInfo.paymentMethod+"&type=datHang";
        sendPostRequest('../php/product.php', data, response =>{
            if(response){
                customerOrderInfo.sdhh = response;
                //console.log(response);
                setOrderDetail(customerOrderInfo.sdhh,getUserInfor().mskh);
            }
        });
    }else{
        let data = "name="+guestOrderInfo.name+"&tel="+guestOrderInfo.tel+"&address="+guestOrderInfo.address+"&type=guestAccount";
        sendPostRequest("../php/account.php", data, res => {
           let guest = JSON.parse(res);
           let data = "mskh="+guest.mskh+"&madc="+guest.madc+"&thanhToan="+customerOrderInfo.paymentMethod+"&type=datHang";
           sendPostRequest("../php/product.php", data, res =>{
              if(res){
                  guestOrderInfo.sdhh = res;
                  setOrderDetail(guestOrderInfo.sdhh ,guest.mskh);
              }
           });
        });
    }
}

//Lập mảng chi tiết hoá đơn
function setOrderDetail(sdhh, mskh){
    let arr = [];
    chosenItem.forEach(i =>{
        let item = {
            soDonHH: sdhh,
            mshh: items[i].mshh,
            mskc: items[i].mskc,
            soLuong: items[i].soLuong,
            gia: items[i].gia,
        }
        arr.push(item);
    });
    sendOrderDetail(mskh, arr);
}

//Gửi chi tiết hoá đơn
function sendOrderDetail(mskh, itemList){
    let data = JSON.stringify(itemList);
    console.log(data);
    sendPostRequest('../php/product.php', "chiTiet="+data+"&mskh="+mskh+"&type=chiTietDatHang", response =>{
        if(!JSON.parse(getData('loggedIn'))) {
            chosenItem.forEach(i => {
                console.log("trước: ");
                console.log(items);
                items.splice(parseInt(i), 1);
                console.log("sau");
                console.log(items);
            });
            setCart(items);
        }

        alert("Đặt Hàng Thành Công!!");
        location.href = "../html/cart.html"
    })
}

function cancel(){
    guestInfoForm.form.classList.add("hiding-box");
    guestInfoForm.name.value = '';
    guestInfoForm.tel.value = '';
    guestInfoForm.address.value = '';

    customerInfoTab.infoTab.classList.add('hiding-box');

    orderCustomerInfoBox.box.classList.add("hiding-box");
    orderConfirmingBox.itemBox.innerHTML = '';
    orderConfirmingBox.totalCost.innerHTML = "0";
    orderConfirmingBox.box.classList.add('hiding-box');

    customerOrderInfo.madc = '';
    customerOrderInfo.sdhh = '';
    customerOrderInfo.paymentMethod = 'COD';

    guestOrderInfo.sdhh = '';
    guestOrderInfo.tel = '';
    guestOrderInfo.name = '';
    guestOrderInfo.address = '';
    orderBox.classList.add("hiding-box");
}

function toLoginForm(event){
    event.preventDefault();
    setData('nextPage', 'login');
    setData("nextTarget", "cart");
    location.href = "../html/login.html";
}
