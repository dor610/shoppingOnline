<?php

require_once "db/KhachHang.php";
require_once "db/DiaChiKH.php";
require_once "db/DatHang.php";

$type = $_POST['type'];

if($type === "getInfo"){
    $mskh = $_POST['mskh'];
    $result = \quanly\php\db\KhachHang::tim($mskh);

    echo json_encode($result, 256);
}

if($type === "getAddresses"){
    $mskh = $_POST['mskh'];
    $result = \quanly\php\db\DiaChiKH::timTatCa($mskh);

    echo json_encode($result, 256);
}

if($type === 'getAddress'){
    $madc = $_POST['madc'];
    $result = \quanly\php\db\DiaChiKH::tim($madc);

    echo json_encode($result, 256);
}

if($type === "getCustomers"){
    $offset = $_POST['offset'];
    $soLuong = $_POST['soLuong'];
    $result = \quanly\php\db\KhachHang::timVoiOffset($offset, $soLuong);

    echo json_encode($result, 256);
}

if($type === "search"){
    $offset = $_POST['offset'];
    $soLuong = $_POST['soLuong'];
    $keyWord = $_POST['keyWord'];

    $result = \quanly\php\db\KhachHang::timKiemFullText($offset, $soLuong, $keyWord);

    echo json_encode($result, 256);
}

if($type === "customerOrder"){
    $mskh = $_POST['mskh'];

    $result = \quanly\php\db\DatHang::timTatCa($mskh, 0,"customerOrder");

    echo json_encode($result, 256);
}

if($type === "deleteCustomer"){
    $mskh = $_POST['mskh'];

    $result = \quanly\php\db\KhachHang::xoa($mskh);

    echo $result;
}