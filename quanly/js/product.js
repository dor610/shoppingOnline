//Khai báo phần dùng chung
let sizes = {};
let types = {};
let mainContainer = document.getElementById("main-container");

//Khai báo phần tìm kiếm
const searchBox = {
    searchBtn: document.getElementById("search-btn"),
    searchContent: document.getElementById("search-content"),
    keyWord: '',
}

//Khai báo phần thêm sản phẩm
const addBtn = document.getElementById("add-btn");
const addingBox = {
    addingBox: document.getElementById('adding-item-box'),
    cancelBtn: document.getElementById("adding-form-cancel-btn"),
    submitBtn: document.getElementById("adding-form-submit-btn"),
    productImg: document.getElementById("item-img"),
    productImgLabel: document.getElementById("item-img-label"),
    productDescription: document.getElementById("product-description"),
    itemType: {
        label: document.getElementById("adding-form-item-type-label"),
        typeList: document.getElementById("item-type-list"),
        downArrow: document.getElementById("down-arrow"),
    },
    name: document.getElementById("adding-box-item-name"),
    price: document.getElementById("adding-box-item-price"),
    decription: document.getElementById("product-description"),
    itemInfo:{
        mshh: '',
        name: '',
        price: '',
        type: "",
        decription: "",
        size: [],
        quantity: {},
    },
    sizeBox: document.getElementById("size-box"),
    typeList: document.getElementById("item-type-list"),
    typeLabel: document.getElementById("adding-form-item-type-label"),
}

//Khai báo phần chỉnh sửa sản phẩm
const editingBox = {
    editingBox: document.getElementById("editing-item-box"),
    cancelBtn: document.getElementById("editing-box-cancel-btn"),
    submitBtn: document.getElementById("editing-box-submit-btn"),
    name: document.getElementById("editing-box-item-name"),
    price: document.getElementById("editing-box-item-price"),
    description: document.getElementById("editing-box-item-description"),
    type:{
        typeBox: document.getElementById("editing-item-type-box"),
        typeLabel: document.getElementById("editing-item-type-label"),
    },
    itemImg: {
        imgBox: document.getElementById("editing-box-item-img-box"),
        imgLabel: document.getElementById("editing-box-item-img-label"),
        img: document.getElementById("editing-box-item-img"),
    },
    sizeBox: document.getElementById("editing-box-item-size-box"),
    typeBox:{
        downArrow: document.getElementById("editing-box-down-arrow"),
        typeList: document.getElementById("editing-box-item-type-list"),
        label: document.getElementById("editing-form-item-type-label"),
    },
}
let currentItem ={
    mshh: '',
    name: '',
    price: '',
    description: '',
    type: '',
    typeName: '',
    sizes: {},
    newSizes: {},
    newSizeQuantity: {},
    img: {},
}

//Khai báo phần xoá sản phẩm
const deletingBox = {
    deletingBox: document.getElementById("deleting-item-box"),
    submitBtn: document.getElementById("deleting-form-submit-btn"),
    cancelBtn: document.getElementById("deleting-form-cancel-btn"),
}

//Khai báo phần danh sách sản phẩm
const itemListBox = document.getElementById("item-list-box");
let offset = 0;
/*Kết thúc phần khai báo*/


window.addEventListener("load", () =>{
    itemListBox.addEventListener("scroll", loadData);
    itemListBox.innerHTML = '';
    getItems();
    searchBox.searchBtn.addEventListener("click", search);
    addBtn.addEventListener("click", openAddingBox);

/*--------------------------------------------------------------------------------------------------*/
    addingBox.cancelBtn.addEventListener("click", closeAddingBox)
    addingBox.submitBtn.addEventListener("click", add);
    addingBox.itemType.downArrow.addEventListener("click", () =>{
        addingBox.itemType.typeList.classList.toggle("show-item-type-list");
        addingBox.itemType.downArrow.classList.toggle("up-arrow");
    });
    addingBox.itemType.label.addEventListener("click", () =>{
        addingBox.itemType.downArrow.click();
    })
    addingBox.productImg.onchange = function (){
        //console.log("changing");
        if(this.files.length > 0){
            addingBox.productImgLabel.innerHTML = this.files.length + " file đã được chọn";
        }else {
            addingBox.productImgLabel.innerHTML = "Chọn ảnh sản phẩm";
        }
    }
/*-----------------------------------------------------------------------------------------------*/
    editingBox.cancelBtn.addEventListener("click", closeEditingBox);
    editingBox.submitBtn.addEventListener("click", update);
    editingBox.typeBox.downArrow.addEventListener("click", () =>{
       editingBox.typeBox.typeList.classList.toggle("show-item-type-list");
       editingBox.typeBox.downArrow.classList.toggle("up-arrow");
    });
    editingBox.typeBox.label.addEventListener("click", () =>{
       editingBox.typeBox.downArrow.click();
    });

    editingBox.itemImg.img.onchange = function (){
        console.log(this.files.length > 0);
        if(this.files.length > 0){
            editingBox.itemImg.imgLabel.innerHTML = this.files.length + " file đã được chọn";
        }else {
            editingBox.itemImg.imgLabel.innerHTML = "Chọn ảnh sản phẩm";
        }
    }
/*------------------------------------------------------------------------------------------------*/

    deletingBox.submitBtn.onclick = deleteItem;
    deletingBox.cancelBtn.onclick = closeDeletingBox;


/*-----------------------------------------------------------------------------------------------*/
    getAllSizes();
    getAllTypes();
});

/*--------------------------Phần danh sách sản phẩm-------------------------------------*/

function getItems(){
    console.log("đang lấy");
    let content = "";
    if(searchBox.keyWord === '')
        content = "offset="+offset+"&soLuong="+15+"&sort=&fill=&type=getItems";
    else content = "offset="+offset+"&soLuong="+15+"&keyWord="+searchBox.keyWord+"&type=search";
    sendPostRequest("../php/product.php", content, res =>{
        //console.log(res);
        let data = JSON.parse(res);
        //console.log(data);
        data.forEach(item =>{
            let hangHoa = JSON.parse(item);
            let child = createItemElement(hangHoa);
            itemListBox.appendChild(child);
            itemListBox.addEventListener("scroll", loadData);
        });
    });
    offset +=15;
}
function reloadItems(){
    itemListBox.innerHTML = "";
    offset = 0;
    searchBox.keyWord = '';
    getItems();
}

function createItemElement(data){
    let parent = document.createElement("div");
    parent.id = "item_"+data.mshh;

    let nameContainer = document.createElement("div");
    let img = document.createElement("img");
    getItemImage(img, data.mshh);
    let name = document.createElement("div");
    name.innerHTML = data.tenHh;
    nameContainer.appendChild(img);
    nameContainer.appendChild(name);

    let price = document.createElement("div");
    price.innerHTML = data.gia;

    let quantity = document.createElement("div");
    getTotalQuantity(quantity, data.mshh);

    let editDiv = document.createElement("div");
    let deleteDiv = document.createElement("div");
    let editButton = document.createElement("button");
    let deleteButton = document.createElement("button");
    editButton.innerHTML = "Chỉnh sửa";
    deleteButton.innerHTML = "Xoá";
    editButton.id = "edit_"+data.mshh;
    deleteButton.id = "delete_"+data.mshh;
    editButton.onclick = function (){
        currentItem.mshh = this.id.substring(5);
        getItemInformation();
        itemListBox.removeEventListener("scroll", loadData);
    };
    deleteButton.onclick = function (){
        currentItem.mshh = this.id.substring(7);
        openDeletingBox();
        itemListBox.removeEventListener("scroll", loadData);
    };
    editDiv.appendChild(editButton);
    deleteDiv.appendChild(deleteButton);

    parent.appendChild(nameContainer);
    parent.appendChild(price);
    parent.appendChild(quantity);
    parent.appendChild(editDiv);
    parent.appendChild(deleteButton);

    return parent;
}

function getItemImage(img ,mshh){
    let data = "mshh="+mshh+"&type=getItemImages";
    sendPostRequest("../php/product.php", data, res =>{
       // console.log(res);
        JSON.parse(res).forEach(i =>{
            img.src = "../../khachhang/img/product/"+JSON.parse(i).tenHinh+".png";
        });
    });
}

function loadData(){
    //console.log("scrolling");
    if (itemListBox.offsetHeight + itemListBox.scrollTop >= itemListBox.scrollHeight) {
        itemListBox.removeEventListener("scroll", loadData);
        getItems();
    }
}

function getTotalQuantity(quantity, mshh){
    let data = "mshh="+mshh+"&type=getTotalQuantity";
    sendPostRequest("../php/product.php", data, res =>{
       quantity.innerHTML = res;
    });
}



/*-----------------------Phần thêm sản phẩm--------------------------*/
function openAddingBox(){
    mainContainer.style.overflow = "hidden";
    itemListBox.removeEventListener("scroll", loadData);
    addingBox.addingBox.classList.remove("hiding-box");
    addingBox.sizeBox.innerHTML = "";
    for(const size in sizes){
     //   console.log(size);
        let div = document.createElement("div");
        let nameSpan = document.createElement("span");
        let quantitySpan = document.createElement("span");
        let radioInput = document.createElement("input");
        radioInput.type = "radio";
        let quantityInput = document.createElement("input");
        quantityInput.type = "text";

        quantityInput.disabled = true;
        quantitySpan.innerHTML = "Số lượng:";
        nameSpan.innerText = sizes[size].tenKichCo;
        radioInput.id = sizes[size].tenKichCo;
        radioInput.onclick = function (){
            if(this.checked === true){
                document.getElementById(this.id+"newQuantity").disabled = false;
                addingBox.itemInfo.size.push(this.id);
            }else{
                addingBox.itemInfo.size.splice(addingBox.itemInfo.size.indexOf(this.id), 1);
            }
        }
        quantityInput.id = sizes[size].tenKichCo+"newQuantity";

        div.appendChild(radioInput);
        div.appendChild(nameSpan);
        div.appendChild(quantitySpan);
        div.appendChild(quantityInput);

        addingBox.sizeBox.appendChild(div);
    }

    addingBox.typeList.innerHTML = "";
    for (const type in types) {
        let div = document.createElement("div");
        div.innerText = types[type].tenLoaiHang;
        div.id = types[type].maLoaiHang;
        div.onclick = function (){
            addingBox.typeLabel.innerHTML = this.innerText;
            addingBox.itemInfo.type = this.id;
            addingBox.itemType.downArrow.click();
        }
        addingBox.typeList.appendChild(div);
    }


}

function closeAddingBox(){
    itemListBox.addEventListener("scroll", loadData);
    resetAddingBox();
    addingBox.addingBox.classList.add('hiding-box');
}

function add(){
    let checkingResult = addingFormCheck();
    console.log(checkingResult);
    if(checkingResult.result){
        let name = addingBox.name.value;
        let price = addingBox.price.value;
        let description = addingBox.decription.value;
        let productType = addingBox.itemInfo.type;

        let data = "name="+name+"&price="+price+"&description="+description+"&productType="+productType+"&type=add";
        console.log(data);
        sendPostRequest("../php/product.php", data, res =>{
            console.log(res);
            addingBox.itemInfo.mshh = res;
            sendProductSizeAndQuantity();
            uploadProductImage();
        });
    }else {
        alert(checkingResult.message);
    }

}

function sendProductSizeAndQuantity(){
    addingBox.itemInfo.size.forEach(s =>{
       let data = "mskc="+sizes[s].mskc+"&mshh="+addingBox.itemInfo.mshh+"&quantity="+addingBox.itemInfo.quantity[s]+"&type=setProductSize";
       sendPostRequest("../php/product.php", data, res =>{

       });
    });
}

function uploadProductImage(){
    console.log(addingBox.productImg.files.length);
    let mshh =  addingBox.itemInfo.mshh;
    for(let count = 0; count < addingBox.productImg.files.length; count++){
        let file = addingBox.productImg.files.item(count);
        let formData = new FormData();
        formData.append("file" , file);
        formData.append("mshh", mshh);
        uploadImage("../php/uploadProductImage.php" ,formData, res=>{
            console.log(res);
        });
    }
    closeAddingBox();
    alert("Thêm sản phẩm thành công!");
    reloadItems();

}

function resetAddingBox(){
    addingBox.name.value = '';
    addingBox.price.value = '';
    addingBox.decription.value = '';
    addingBox.typeLabel.innerHTML = "";
    addingBox.typeList.innerHTML = "";
    addingBox.sizeBox.innerHTML = "";
    addingBox.itemInfo = {
        mshh: '',
        name: '',
        price: '',
        type: "",
        decription: "",
        size: [],
        quantity: {},
    };
}

function getAddingItemQuantityBySize(){
    let i = true;
    addingBox.itemInfo.quantity = {}
    addingBox.itemInfo.size.forEach(s =>{
       let quantity = document.getElementById(sizes[s].mskc+s).value;
       //console.log(s+"   : "+ quantity);
       if(quantity === ''){
           i = false;
       }else {
           addingBox.itemInfo.quantity[s] = quantity;
       }
    });
    return i;
}

function addingFormCheck(){
    const checkingResult = {
        result: true,
        message: '',
    }

    if(addingBox.name.value === ''){
        checkingResult.result = false;
        checkingResult.message = "Tên không hợp lệ";
    }

    if(addingBox.price.value === '' || addingBox.price.value.match("\\D+")){
        checkingResult.result = false;
        checkingResult.message = "Giá sản phẩm không hợp lệ"
    }

    if(addingBox.itemInfo.type === ''){
        checkingResult.result = false;
        checkingResult.message = "Vui lòng chọn loại sản phẩm";
    }

    if(addingBox.itemInfo.size.length === 0){
        checkingResult.result = false;
        checkingResult.message = "Vui lòng chọn ít nhất một kích cỡ và nhập số lượng cho sản phẩm";
    }

    if(!getAddingItemQuantityBySize()){
        checkingResult.result = false;
        checkingResult.message = "Vui lòng nhập đủ số lượng cho các kích cỡ đã chọn";
    }

    if(addingBox.productImg.files.length === 0){
        checkingResult.result = false;
        checkingResult.message = "Vui lòng chọn ít nhất một ảnh cho sản phẩm";
    }

    return checkingResult;
}


/*-----------------Phần chỉnh sửa sản phẩm-------------------------------*/
function openEditingBox(){
    editingBox.editingBox.classList.remove("hiding-box");
    editingBox.name.value = currentItem.name;
    editingBox.price.value = currentItem.price;
    editingBox.description.value = currentItem.description;
    getItemSize();
    getItemType();
    getItemImages()
}

function closeEditingBox(){
    itemListBox.addEventListener("scroll", loadData);
    editingBox.editingBox.classList.add("hiding-box");
    resetEditingBox();
}

function getItemInformation(){
    let data = "mshh="+currentItem.mshh+"&type=getItem";
    sendPostRequest("../php/product.php", data, res =>{
       let item = JSON.parse(res) ;
       currentItem.name = item.tenHh;
       currentItem.description = item.moTa;
       currentItem.price = item.gia;
       currentItem.type = item.maLoaiHang;
       openEditingBox();
    });
}

function getItemSize(){
    let data = "mshh="+currentItem.mshh+"&type=getProductSizes";
    sendPostRequest("../php/product.php", data, res =>{
       let sizeArr = JSON.parse(res);
       sizeArr.forEach( s =>{
           let size = JSON.parse(s);
           currentItem.sizes[size.tenKichCo] = size;
       });

       setItemSize();
    });
}

function setItemSize(){
    for(const size in sizes){
        //   console.log(size);
        let div = document.createElement("div");
        let nameSpan = document.createElement("span");
        let quantitySpan = document.createElement("span");
        let radioInput = document.createElement("input");
        radioInput.type = "radio";
        let quantityInput = document.createElement("input");
        quantityInput.type = "text";

        quantityInput.id = sizes[size].tenKichCo+"quantity";
        quantityInput.disabled = true;
        quantitySpan.innerHTML = "Số lượng:";
        nameSpan.innerText = sizes[size].tenKichCo;
        radioInput.id = sizes[size].tenKichCo;
        if(currentItem.sizes[size]){
            radioInput.checked = true;
            quantityInput.value = currentItem.sizes[size].soLuong;
            quantityInput.disabled = false;
        }
        radioInput.onclick = function (){
            if(this.checked === true){
                document.getElementById(this.id+"quantity").disabled = false;
                if(!currentItem.sizes.hasOwnProperty(this.id))
                    currentItem.newSizes[this.id] = sizes[this.id];
            }else{
                if(!currentItem.sizes.hasOwnProperty(this.id))
                    currentItem.newSizes.delete(this.id);
            }
        }

        div.appendChild(radioInput);
        div.appendChild(nameSpan);
        div.appendChild(quantitySpan);
        div.appendChild(quantityInput);

        editingBox.sizeBox.appendChild(div);
    }
}

function getItemType(){
    let data = "maLoaiHang="+currentItem.type+"&type=getItemType";
    sendPostRequest("../php/product.php", data, res =>{
        console.log(res);
        let type = JSON.parse(res);
        currentItem.typeName = type.tenLoaiHang
        setItemType();
    });
}

function setItemType(){
    editingBox.typeBox.label.innerHTML = currentItem.typeName;
    editingBox.typeBox.typeList.innerHTML = "";
    for (const type in types) {
        let div = document.createElement("div");
        div.innerText = types[type].tenLoaiHang;
        div.id = types[type].maLoaiHang;
        div.onclick = function (){
            editingBox.typeBox.label.innerHTML = this.innerText;
            currentItem.type = this.id;
            editingBox.typeBox.downArrow.click();
        }
        editingBox.typeBox.typeList.appendChild(div);
    }
}

function getItemImages(){
    let data = "mshh="+currentItem.mshh+"&type=getItemImages";
    sendPostRequest("../php/product.php", data, res =>{
        console.log(res);
        JSON.parse(res).forEach(i =>{
           let img = JSON.parse(i);
           currentItem.img[img.maHinh] = img;
        });
        setItemImages();
    });
}

function setItemImages(){
    editingBox.itemImg.imgBox.innerHTML = '';
    for(let img in currentItem.img){
        let div = document.createElement("div");
        let imgE = document.createElement("img");
        let button = document.createElement("button");
        imgE.src = "../../khachhang/img/product/"+currentItem.img[img].tenHinh+".png";
        button.id = currentItem.img[img].maHinh;
        div.id = currentItem.img[img].maHinh + "p";
        button.innerHTML = "Xoá";
        button.onclick = deleteItemImage;

        div.appendChild(imgE);
        div.appendChild(button);
        editingBox.itemImg.imgBox.appendChild(div);
    }
}

function deleteItemImage(){
    let id = this.id;
    sendPostRequest("../php/product.php", "maHinh="+id+"&name="+currentItem.img[id].tenHinh+"&type=deleteImg", res =>{
        let imgContainer = document.getElementById(id+"p");
        editingBox.itemImg.imgBox.removeChild(imgContainer);
        currentItem.img.delete(id);
    });
}


function update(){
    let checkingResult = editingCheck();
    if(checkingResult.result){
        currentItem.name = editingBox.name.value;
        currentItem.price = editingBox.price.value;
        currentItem.description = editingBox.description;
        let data = "mshh="+currentItem.mshh+"&name="+currentItem.name+"&price="+currentItem.price+"&description="+currentItem.description+
                    "&maLoaiHang="+currentItem.type+"&type=update";
        sendPostRequest("../php/product.php", data, res=>{
            updateItemImg();
            updateItemSizes();
            alert("Cập nhật thành công!");
            reloadItems();
            closeEditingBox();
        });
    }else {
        alert(checkingResult.message);
    }
}

function updateItemImg(){
    if(editingBox.itemImg.img.files.length > 0){
        for(let count = 0; count < editingBox.itemImg.img.files.length; count++){
            uploadAnImage(currentItem.mshh, editingBox.itemImg.img.files.item(count))
        }
    }
}

function updateItemSizes(){
    for(let s in currentItem.sizes){
        let data = '';
        if(currentItem.sizes[s].soLuong === 0)
             data = "mskc="+currentItem.sizes[s].mskc+"&mshh="+currentItem.mshh+"&type=deleteItemSize";
           else
             data = "mskc="+currentItem.sizes[s].mskc+"&mshh="+currentItem.mshh+"&soLuong="+currentItem.sizes[s].soLuong+"&type=updateItemSize";
        sendPostRequest("../php/product.php", data, res =>{

        });
    }

    for(let s in currentItem.newSizes){
        if(currentItem.newSizeQuantity[s] !== 0){
            let data = "mskc="+sizes[s].mskc+"&mshh="+currentItem.mshh+"&quantity="+currentItem.newSizeQuantity[s]+"&type=setProductSize";
            sendPostRequest("../php/product.php", data, res=>{

            });
        }
    }
}

function editingCheck(){
    let checkingResult = {
        result: true,
        message: '',
    }
    if(editingBox.name.value === ""){
        checkingResult.result = false;
        checkingResult.message = "Tên sản phẩm không hợp lệ";
    }

    if(editingBox.price.value === '' || editingBox.price.value.match("\\D+")){
        checkingResult.result = false;
        checkingResult.message = "Giá sản phẩm không hợp lệ"
    }

    if(currentItem.type === ''){
        checkingResult.result = false;
        checkingResult.message = "Vui lòng chọn loại sản phẩm";
    }

    if(!getEditingItemQuantityBySize()){
        checkingResult.result = false;
        checkingResult.message = "Vui lòng nhập đủ số lượng cho các kích cỡ đã chọn";
    }

    return checkingResult;

}

function getEditingItemQuantityBySize(){
    let i = true;
    currentItem.newSizeQuantity = {};
    for (let s in currentItem.sizes){
        console.log(s);
        let quantity = document.getElementById(currentItem.sizes[s].tenKichCo+"quantity").value;
        console.log(s+"   : "+ quantity);
        if(quantity === ''){
            i = false;
        }else {
            currentItem.sizes[s].soLuong = quantity;
        }
    };

    for(let s in currentItem.newSizes){
        let quantity = document.getElementById(currentItem.newSizes[s].tenKichCo+"quantity").value;
        if (quantity === ''){
            i = falsel
        }else {
            currentItem.newSizeQuantity[s] = quantity;
        }
    }
    return i;
}

function resetEditingBox(){
    editingBox.name.value = "";
    editingBox.price.value = "";
    editingBox.description.value = "";
    editingBox.typeBox.typeList.innerHTML = "";
    editingBox.sizeBox.innerHTML = "";
    editingBox.itemImg.imgBox.innerHTML = "";
    currentItem = {
        mshh: '',
        name: '',
        price: '',
        description: '',
        type: '',
        typeName: '',
        sizes: {},
        img: {},
    }

}

/*------------------------Phần xoá sản phẩm----------------------------------*/
function openDeletingBox(){
    deletingBox.deletingBox.classList.remove("hiding-box");
}

function deleteItem(){
    let data = "mshh="+currentItem.mshh+"&type=deleteItem";
    sendPostRequest("../php/product.php", data, res =>{
        let deleteditem = document.getElementById("item_"+currentItem.mshh);
        itemListBox.removeChild(deleteditem);
        closeDeletingBox();
    });
}

function closeDeletingBox(){
    deletingBox.deletingBox.classList.add("hiding-box");
    itemListBox.addEventListener("scroll", loadData);
}



/*----------------------Phần chung------------------------------------*/

function uploadAnImage(mshh, file){
    let formData = new FormData();
    formData.append("file" , file);
    formData.append("mshh", mshh);
    uploadImage("../php/uploadProductImage.php" ,formData, res=>{
        console.log(res);
    });
}

function getAllSizes(){
    //   console.log("hihi");
    sendPostRequest("../php/product.php", "type=getAllSizes", res =>{//
        //console.log(res);
        let arr = JSON.parse(res);
        sizes = {};
        arr.forEach(item =>{
            let size = JSON.parse(item);
            sizes[size.tenKichCo] = size;
        });
    });
}

function getAllTypes(){
    sendPostRequest("../php/product.php", "type=getAllTypes", res =>{

        //   console.log(res);
        let arr = JSON.parse(res);
        types = {};
        arr.forEach(item =>{
            let type = JSON.parse(item);
            types[type.maLoaiHang] = type;
        });
    });
}

/*--------------------------Phần tìm kiếm sản phẩm------------------------------------*/

function search(){
    let keyWord = searchBox.searchContent.value;
    if(keyWord !== ''){
        searchBox.keyWord = keyWord;
        offset = 0;
        itemListBox.innerHTML = "";
        getItems();
    }
}