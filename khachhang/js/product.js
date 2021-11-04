const col1 = document.getElementById('col-1');
const col2 = document.getElementById('col-2');
const col3 = document.getElementById('col-3');
const filterTab = {
    all: document.getElementById("all-btn"),
    man: document.getElementById("man-btn"),
    woman: document.getElementById("woman-btn"),
    manShirt: document.getElementById("man-s-btn"),
    manPant: document.getElementById("man-p-btn"),
    womanShirt: document.getElementById("woman-s-btn"),
    womanPant: document.getElementById("woman-p-btn"),
}

const itemTab = {
    itemTab: document.getElementById('item-tab'),
    backBtn: document.getElementById('back-Btn'),
    img: document.getElementById('item-img'),
    name: document.getElementById('item-name'),
    price: document.getElementById('item-price'),
    inStock: document.getElementById('in-stock'),
    quantity: document.getElementById('quantity'),
    buyBtn: document.getElementById('buy-btn'),
    addToCartBtn: document.getElementById('add-to-cart-btn'),
    inscBtn: document.getElementById('quantity-insc-btn'),
    descBtn: document.getElementById('quantity-desc-btn'),
}

const itemInfor = {
    mshh: '',
    mskc: '',
    name: '',
    price: 0,
    size: '',
    quantity: 0,
}

const sizeList = {
    m: '',
    s: '',
    l: '',
    xl: '',
    xxl: '',
    xxxl: '',
};

const sizeBtnList = {
    m: document.getElementById('m-size'),
    s: document.getElementById('l-size'),
    l: document.getElementById('s-size'),
    xl: document.getElementById('xl-size'),
    xxl: document.getElementById('xxl-size'),
    xxxl: document.getElementById('xxxl-size'),
}

const sortingTab = document.getElementById("sorting-tab");
const loadingIcon = document.getElementById("loading-icon");
const noti = document.getElementById("noti");
let curCol = 1;
const state = {
    sort: 'moi',
    fill: 'tatCa',
    offset: 0,
    activeBtn: filterTab.all,
}

//---------------------------------------------------------------------------//

window.addEventListener('load', ()=>{
    let page = getData('nextPage');
    switch (page){
        case 'nam':
                loadHangHoa('new', 'nam', filterTab.man);
                setData('nextPage', '');
            break;
        case 'nu':
                loadHangHoa('new', 'nu', filterTab.woman);
                setData('nextPage', '');
            break;
        default:
                loadHangHoa("new", "tatCa", filterTab.all);
            break;
    }

    window.addEventListener("scroll", loadData);
    filterTab.all.addEventListener('click', (event)=>{
        loadHangHoa(state.sort, "tatCa", event.target);
    });

    filterTab.man.addEventListener("click", event =>{
       loadHangHoa(state.sort, "nam", event.target);
    });

    filterTab.manPant.addEventListener("click", event =>{
        loadHangHoa(state.sort, "quanNam", event.target);
    });

    filterTab.manShirt.addEventListener("click", event =>{
        loadHangHoa(state.sort, "aoNam", event.target);
    });

    filterTab.woman.addEventListener("click", event =>{
        loadHangHoa(state.sort, "nu", event.target);
    });

    filterTab.womanPant.addEventListener("click", event =>{
        loadHangHoa(state.sort, "quanNu", event.target);
    });

    filterTab.womanShirt.addEventListener("click", event =>{
        loadHangHoa(state.sort, "aoNu", event.target);
    })

    sortingTab.addEventListener("change", ()=>{
      let value = sortingTab.value;
      let sort = '';
      switch (value){
          case 'insc': sort = "giaTang";
                break;
          case 'desc': sort = "giaGiam";
                break;
          default: sort = "moi";
      }
      loadHangHoa(sort, state.fill, state.activeBtn);
    });

    itemTab.backBtn.addEventListener("click", () =>{
       itemTab.itemTab.classList.add('hidden');
        sizeList.l = '';
        sizeList.m = '';
        sizeList.s = '';
        sizeList.xl = '';
        sizeList.xxl = '';
        sizeList.xxxl = '';

        if(itemInfor.size !== '') sizeBtnList[itemInfor.size].checked = false;

        itemInfor.name = '';
        itemInfor.size = '';
        itemInfor.quantity = 0;
        itemInfor.price = 0;
        itemInfor.mshh = '';
        itemInfor.mskc = '';

        itemTab.quantity.innerHTML = '0';
    });

    sizeBtnList.m.addEventListener("click", (event) => {
       selectSize(event.target);
    });
    sizeBtnList.l.addEventListener("click", (event) => {
        selectSize(event.target);
    });
    sizeBtnList.s.addEventListener("click", (event) => {
        selectSize(event.target);
    });
    sizeBtnList.xl.addEventListener("click", (event) => {
        selectSize(event.target);
    });
    sizeBtnList.xxl.addEventListener("click", (event) => {
        selectSize(event.target);
    });
    sizeBtnList.xxxl.addEventListener("click", (event) => {
        selectSize(event.target);
    });

    itemTab.inscBtn.addEventListener('click', inscreseQuantity);
    itemTab.descBtn.addEventListener("click", descreseQuantity);

    itemTab.addToCartBtn.addEventListener("click",() =>{
        addToCart(false);
    });
    itemTab.buyBtn.addEventListener("click", buy);

});

//-------------------------------------------------------------------------------//

function selectSize(target){
    console.log(target.value);
    itemInfor.size = target.value;
    itemInfor.mskc = sizeList[itemInfor.size].mskc;

    itemTab.inscBtn.disabled = false;
    itemTab.descBtn.disabled = false;
    itemTab.quantity.disabled = false;

    itemTab.inStock.innerHTML = 'Số lượng trong kho: '+ sizeList[itemInfor.size].soLuong;
}

function inscreseQuantity(){
    if(itemInfor.quantity < parseInt(sizeList[itemInfor.size].soLuong)){
        itemInfor.quantity++;
        itemTab.quantity.innerHTML = itemInfor.quantity;
    }
    if (itemInfor.quantity === 0){
        itemTab.buyBtn.disabled = true;
        itemTab.buyBtn.classList.add("btn-disabled");
        itemTab.addToCartBtn.disabled = true;
        itemTab.addToCartBtn.classList.add("btn-disabled");
    }else {
        itemTab.buyBtn.disabled = false;
        itemTab.buyBtn.classList.remove("btn-disabled");
        itemTab.addToCartBtn.disabled = false;
        itemTab.addToCartBtn.classList.remove("btn-disabled");
    }
}

function descreseQuantity(){
    if(itemInfor.quantity > 0){
        itemInfor.quantity --;
        itemTab.quantity.innerHTML = itemInfor.quantity;
    }
    if (itemInfor.quantity === 0){
        itemTab.buyBtn.disabled = true;
        itemTab.buyBtn.classList.add("btn-disabled");
        itemTab.addToCartBtn.disabled = true;
        itemTab.addToCartBtn.classList.add("btn-disabled");
    }else {
        itemTab.buyBtn.disabled = false;
        itemTab.buyBtn.classList.remove("btn-disabled");
        itemTab.addToCartBtn.disabled = false;
        itemTab.addToCartBtn.classList.remove("btn-disabled");
    }
}

function addToCart(isGoingToCart){

    if(getData('loggedIn') === 'true'){
        let mskh = JSON.parse(getData('userInfor')).mskh;
        let data = 'mshh='+itemInfor.mshh+'&mskc='+sizeList[itemInfor.size].mskc+'&mskh='+mskh+'&soLuong='+itemInfor.quantity+'&type=themGioHang';
        sendPostRequest('../php/product.php', data, response =>{
            //console.log('Thành công');
        });

    }else {
        let cart = JSON.parse(getData('cart'));
        console.log(cart);
        let isExist = false;
        if(cart){
            for (let count = 0; count < cart.length; count++){
                let item = JSON.parse(cart[count]);
                console.log(cart[count].mshh +"   "+ itemInfor.mshh +"     "+cart[count].mskc+"    "+ sizeList[itemInfor.size].mskc)
                if(item.mshh === itemInfor.mshh && item.mskc === sizeList[itemInfor.size].mskc){
                    isExist = true;
                    item.quantity = parseInt(itemInfor.quantity) + parseInt(item.quantity);
                    cart[count] = JSON.stringify(item);
                    break;
                }
            }
        }
        if(isExist){
            setData("cart", JSON.stringify(cart))
        }else {
            addItemToCart(itemInfor);
        }
    }
    notify("Thêm Thành Công");
    setTimeout(()=>{
        if(isGoingToCart) location.href = '../html/cart.html';
        else itemTab.backBtn.click();
    }, 2000);
}


function buy(){
    addToCart(true);
}

function loadData(){
    noti.classList.add("hidden");
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        window.removeEventListener("scroll", loadData);
        setPath();
        loadingIcon.classList.add("show-loading-icon");
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "../php/product.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onload = function (){
            loadingIcon.classList.remove("show-loading-icon");
            if(this.status === 200){
                let data = JSON.parse(this.response);
                //console.log(data[data.length -1])
                if(data[data.length -1] == 'true')
                    {console.log(data);
                    data.pop();
                    data.forEach((hangHoa) =>{
                        hangHoaOj = JSON.parse(hangHoa);
                        let child = createHangHoaElement(hangHoaOj);
                        appendToCol(child);
                        window.addEventListener("scroll", loadData);
                    });
                }else{
                    noti.innerHTML = "Không Còn Sản Phẩm Nữa Rồi :((!!"
                    noti.classList.remove("hidden");
                }
            }else {
                noti.innerHTML = "Lỗi Rồi :(((!!";
                noti.classList.remove("hidden");
            }
        }
        xhr.send("offset="+state.offset+"&soLuong="+15+"&sort="+state.sort+"&fill="+state.fill+'&type=get');
        state.offset +=15;
    }
}

function loadHangHoa(sort, fill, target){
    noti.classList.add("hidden");
    if(state.activeBtn.innerHTML !== target.innerHTML || sort !== state.sort){
        state.offset = 0;
        col1.innerHTML = '';
        col2.innerHTML = '';
        col3.innerHTML = '';
    };
    state.fill = fill;
    state.sort = sort
    state.activeBtn.classList.remove("active-btn");
    state.activeBtn = target;
    state.activeBtn.classList.add("active-btn");
    loadingIcon.classList.add("show-loading-icon");
    let content = "offset="+state.offset+"&soLuong="+15+"&sort="+sort+"&fill="+fill+'&type=get';
    sendPostRequest("../php/product.php", content, res =>{
        //console.log(res);
        let data = JSON.parse(res);
        //console.log(data[data.length -1])
        if(data[data.length -1] === 'true'){
            data.pop();
            //console.log(data);
            data.forEach(item =>{
                let hangHoa = JSON.parse(item);
                let child = createHangHoaElement(hangHoa);
                appendToCol(child);
                window.addEventListener("scroll", loadData);
            });
        }else{
            noti.innerHTML = "Không Còn Sản Phẩm Nữa Rồi!!"
            noti.classList.remove("hidden");
        }
    }, () =>{
        noti.innerHTML = "Lỗi Rồi!!";
        noti.classList.remove("hidden");
    });
    state.offset +=15;
}

function createHangHoaElement(data){
    let div = document.createElement("div");
    div.classList.add("product-item");
    div.addEventListener("click", event=>{
       openItemTab(event.target);
    }, {capture: true});

    let divChild = document.createElement("div");
    let img = document.createElement('img');
    img.src = "../img/product/"+data.mshh+".png";
    div.appendChild(img);
    div.appendChild(divChild);

    let name = document.createElement("p");
    name.innerHTML = data.tenHh;
    let price = document.createElement("p");
    price.innerHTML = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND'}).format(data.gia);

    divChild.appendChild(price);
    divChild.appendChild(name);

    let lastDiv = document.createElement('div');
    lastDiv.id = data.mshh;
    lastDiv.addEventListener("click", (event) =>{
        openItemTab(event.target);
    });

    div.appendChild(lastDiv);
    return div;
}

function openItemTab(target){
    let id = target.id;

    itemTab.itemTab.classList.remove('hidden');
    let content = "mshh="+id+"&type=getOne";
    sendPostRequest('../php/product.php', content, res =>{
        let data = JSON.parse(this.response);
        getItemSizeQuantity(data.mshh);
        itemTab.price.innerHTML = "Giá: "+new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND'}).format(data.gia);
        let img = document.createElement('img');
        sendPostRequest("../php/product.php", "mshh="+data.mshh+"&type=getImg", res =>{
            img.src = '../img/product/'+res+'.png';
        });
        itemTab.img.innerHTML = '';
        itemTab.img.appendChild(img);

        itemTab.name.innerHTML = data.tenHh;
        itemInfor.price = data.gia;
        itemInfor.name = data.tenHh;
        itemInfor.mshh = data.mshh;
    });
}

function  getItemSizeQuantity(mshh){
    sendPostRequest("../php/product.php", 'mshh='+mshh+'&type=kichCo', res =>{
        let data = JSON.parse(res);
        data.pop();
        //console.log(data);
        let soLuong = 0;
        data.forEach(sizeOJ =>{
            let size = JSON.parse(sizeOJ);
            sizeList[size.tenKichCo] = size;
            soLuong += parseInt(size.soLuong);
        });
        setItemSizeQuantity();
        //console.log(soLuong);
        itemTab.inStock.innerHTML = 'Số lượng trong kho: '+soLuong;
    });
}

function setItemSizeQuantity() {
    sizeBtnList.m.disabled = (sizeList.m === '');
    sizeBtnList.l.disabled = (sizeList.s === '');
    sizeBtnList.s.disabled = (sizeList.l === '');
    sizeBtnList.xl.disabled = (sizeList.xl === '');
    sizeBtnList.xxl.disabled = (sizeList.xxl === '');
    sizeBtnList.xxxl.disabled = (sizeList.xxxl === '');
}

function appendToCol(child){
    if(curCol === 1){
        col1.appendChild(child);
        curCol = 2;
    }else if (curCol === 2){
        col2.appendChild(child);
        curCol = 3;
    }else {
        col3.appendChild(child);
        curCol = 1;
    }
}