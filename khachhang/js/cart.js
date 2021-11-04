const cartItem = document.getElementById('cart-item');
const totalCost = document.getElementById('total-cost');
const buyBtn = document.getElementById('buy-btn');
let items = [];
const container = document.getElementById("container");
const noti = document.getElementById("noti");
const toProductTabBtn = document.getElementById("to-product-tab-btn");
//Thông tin khách hàng khi chưa đăng nhập
const customerInfoForm = {
    formTab: document.getElementById("customer-information-form"),
    name: document.getElementById("form-name"),
    phoneNumber: document.getElementById("form-phone-number"),
    address: document.getElementById("form-address"),
    loginBtn: document.getElementById("login-btn"),
}

//Thông tin khách hàng nếu đã đăng nhập
const customerInfo = {
    infoTab: document.getElementById("customer-information"),
    name: document.getElementById("cus-name"),
    phoneNumber: document.getElementById("cus-phone-number"),
    addressBox: {
        addressBox: document.getElementById("cus-address-box"),
        arrow: document.getElementById('down-arrow'),
        label: document.getElementById("cus-address-label"),
    },
}

//Thông tin đặt hàng
const customerOrderInfo = {
    madc: '',
    sdhh: '',
    paymentMethod: 'COD',
}

window.addEventListener("load", () =>{
    getCartItem();
    buyBtn.addEventListener("click", buy);
    customerInfoForm.loginBtn.addEventListener("click", toLoginForm);
    toProductTabBtn.addEventListener("click", function (){
       location.href = '../html/product.html';
    });
    customerInfo.addressBox.arrow.addEventListener("click", () =>{
        customerInfo.addressBox.arrow.classList.toggle('up-arrow');
        customerInfo.addressBox.addressBox.classList.toggle('show-cus-address-box');
    });
});

//Hiển thị các phần tử của giỏ hàng
function setCartItem(){
    buyBtn.removeEventListener("click", buy);
    let cost = 0;
    cartItem.innerHTML = '';
    if(items.length !== 0){
        for(let count = 0; count < items.length; count++ ){
            cost += parseInt(items[count].gia) * parseInt(items[count].soLuong);
            let div = generateItemElement(count, items[count]);
            cartItem.appendChild(div);
        }

        totalCost.innerHTML = new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(cost);
    }
    buyBtn.addEventListener("click", buy);
}


//Tạo phần tử giỏ hàng
function generateItemElement(id ,item){
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

    let deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = 'Xoá';
    deleteBtn.id = id+'';
    deleteBtn.addEventListener("click", event =>{
        xoaHangHoa(event.target);
    });

    divParent.appendChild(div1);
    divParent.appendChild(price);
    divParent.appendChild(quantity);
    divParent.appendChild(size);
    divParent.appendChild(total);
    divParent.appendChild(deleteBtn)

    return divParent
}

function setImg(img, mshh){
    let data = 'mshh='+mshh+'&type=getImg';
    sendPostRequest('../php/product.php', data, response =>{
        img.src = '../img/product/'+response+'.png';
    });
}

//Lấy hàng hoá trong giỏ hàng
function getCartItem(){
    cartItem.innerHTML = ''
    if(JSON.parse(getData('loggedIn'))){
        let mskh = getUserInfor().mskh;
        let data = 'mskh='+mskh+'&type=layGioHang';
        sendPostRequest('../php/product.php', data, response =>{
            console.log(response);
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
        });
    }else {
        if(getData('cart')){
            let cart = JSON.parse(getData('cart'));
            items = [];
            for (let count = 0; count < cart.length; count++){
                console.log(cart[count]);
                let data = JSON.parse(cart[count]);
                //console.log(data);
                let item = {};
                item.mshh = data.mshh;
                item.mskc = data.mskc;
                item.soLuong = data.quantity;
                item.gia = data.price;
                item.kichCo = data.size;
                item.tenHh = data.name;

                items[count] = item;
            }

        }
    }
    if(items.length === 0) {
        buyBtn.disabled = true;
        noti.style.display = "block";
    }else {
        noti.style.display = "none";
        buyBtn.disabled = false;
    }

    setCartItem();
}

function xoaHangHoa(target){
    // id = p_id
    let id = target.id;
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

    container.classList.add("buying");
    this.innerHTML = "Đặt Hàng";
    this.removeEventListener("click", buy);
    this.addEventListener('click', order);

    //Nếu người dùng đã đăng nhập
    if(JSON.parse(getData("loggedIn"))){
        customerInfoForm.formTab.style.display = "none";
        customerInfo.infoTab.style.display = "block";

        let userInfo = JSON.parse(getData('userInfor'));

        customerInfo.name.innerHTML = userInfo.hoTen;
        customerInfo.phoneNumber.innerHTML = userInfo.sdt;

        let data = 'mskh='+userInfo.mskh+"&type=getAddresses";

        sendPostRequest('../php/account.php', data, response =>{
            let addresses = JSON.parse(response);
            customerInfo.addressBox.addressBox.innerHTML = '';
            addresses.forEach(a =>{
                let address = JSON.parse(a);
                console.log(address)
                let div = document.createElement('div');
                div.innerHTML = address.diaChi;
                div.id = address.maDc;
                div.onclick = function (){
                    customerInfo.addressBox.label.innerHTML = this.innerHTML;
                    console.log(this.id);
                    customerOrderInfo.madc = this.id;
                    customerInfo.addressBox.arrow.click();
                }
                customerInfo.addressBox.addressBox.appendChild(div);
            });
            let addr = JSON.parse(addresses[0]);
            console.log(addr.maDc);
            customerInfo.addressBox.label.innerHTML = addr.diaChi;
            customerOrderInfo.madc = addr.maDc;
        });

    }else {
        customerInfoForm.formTab.style.display = "block";
        customerInfo.infoTab.style.display = "none";
    }
}

//Xử lý chức năng nút đặt hàng
function order(){
    if(JSON.parse(getData('loggedIn'))){
        let userInfo = getUserInfor();
        let data = "mskh="+userInfo.mskh+"&madc="+customerOrderInfo.madc+"&thanhToan="+customerOrderInfo.paymentMethod+"&type=datHang";
        sendPostRequest('../php/product.php', data, response =>{
            if(response){
                customerOrderInfo.sdhh = response;
                console.log(response);
                setOrderDetail(getUserInfor().mskh, items);
            }
        });
    }else{

    }
}

//Lập mảng chi tiết hoá đơn
function setOrderDetail(mskh, itemList){
    let arr = [];
    itemList.forEach( i =>{
        let item = {
            soDonHH: customerOrderInfo.sdhh,
            mshh: i.mshh,
            mskc: i.mskc,
            soLuong: i.soLuong,
            gia: i.gia,
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
        notify("Đặt Hàng Thành Công!!");
        setTimeout(()=>{
            location.href = "../html/cart.html"
        }, 2000);
    })
}

function toLoginForm(event){
    event.preventDefault();
    setData('nextPage', 'login');
    setData("nextTarget", "cart");
    location.href = "../html/login.html";
}