<?php

use quanly\php\db\HangHoa;
use quanly\php\db\LoaiHangHoa;

use quanly\php\db\KichCo;
use quanly\php\db\KichCoHangHoa;
use quanly\php\db\HinhHangHoa;

require_once "HangHoa.php";
require_once "LoaiHangHoa.php";
require_once "KichCo.php";
require_once "KichCoHangHoa.php";
require_once "HinhHangHoa.php";

$type = $_POST['type'];


if($type === "search"){
    $offset = $_POST["offset"];
    $soLuong = $_POST['soLuong'];
    $keyWord = $_POST['keyWord'];

    $result = HangHoa::timKiem($offset, $soLuong, $keyWord);
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
}

if($type === "getItems"){
    $offset = $_POST["offset"];
    $soLuong = $_POST['soLuong'];

    $result = HangHoa::layHangHoa($offset, $soLuong);
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
}

if($type === "getItem"){
    $mshh = $_POST["mshh"];

    $result = HangHoa::tim($mshh);

    echo json_encode($result, 256);
}

if($type === 'add'){
    $name = $_POST['name'];
    $description = $_POST['description'];
    $price = $_POST['price'];
    $productType = $_POST['productType'];

    $mshh = HangHoa::them($name, $description, $price, $productType);

    if($mshh) echo $mshh;
    else echo "";
}

if($type === "deleteItem"){
    $mshh = $_POST["mshh"];
    $result = HangHoa::xoa($mshh);
    HinhHangHoa::xoaTatCa($mshh);
    KichCoHangHoa::xoaTatCa($mshh);
    echo $result;
}

if($type === "deleteItemSize"){
    $mshh = $_POST['mshh'];
    $mskc = $_POST['mskc'];
    $result = KichCoHangHoa::xoa($mskc, $mshh);
    echo $result;
}

if($type === "updateItemSize"){
    $mshh = $_POST['mshh'];
    $mskc = $_POST['mskc'];
    $soLuong = $_POST['soLuong'];
    $result = KichCoHangHoa::capNhat($mskc, $mshh, $soLuong);
    echo $result;
}

if($type === "update"){
    $mshh = $_POST['mshh'];
    $name = $_POST['name'];
    $description = $_POST['description'];
    $price = $_POST['price'];
    $maLoaiHang = $_POST['maLoaiHang'];

    $result = HangHoa::capNhat($mshh, $name, $price, $description, $maLoaiHang);

    echo $result;
}

if($type === "setProductSize"){
    $mshh = $_POST['mshh'];
    $mskc = $_POST['mskc'];
    $soLuong = $_POST["quantity"];

    $result = KichCoHangHoa::them($mskc, $mshh, $soLuong);

    echo $result;
}

if($type === "getAllSizes"){
    $result = KichCo::getAll();

    echo json_encode($result, 256);
}

if($type === "getProductSizes"){
    $mshh = $_POST['mshh'];
    $result = KichCoHangHoa::getKichCoHangHoa($mshh);

    echo json_encode($result, 256);
}

if($type === "getAllTypes"){
    $result = LoaiHangHoa::timTatCa();

    echo json_encode($result, 256);
}

if($type === "getItemType"){
    $maLoaiHang = $_POST["maLoaiHang"];
    $result = LoaiHangHoa::tim($maLoaiHang);

    echo json_encode($result, 256);
}

if($type === "getItemImages"){
    $mshh = $_POST['mshh'];
    $result = HinhHangHoa::timTatCa($mshh);

    echo json_encode($result, 256);
}

if($type === "getItemImage"){
    $mshh = $_POST['mshh'];
    $result = HinhHangHoa::tim($mshh);

    echo json_encode($result, 256);
}

if($type === "deleteImg"){
    $maHinh = $_POST['maHinh'];
    $name = $_POST['name'];
    $result = HinhHangHoa::xoa($maHinh);
    unlink("../../khachhang/img/product/".$name.".png");

    echo $result;
}

if($type === "getTotalQuantity"){
    $mshh = $_POST['mshh'];
    $result = KichCoHangHoa::getTongSoLuong($mshh);
    echo $result;
}
