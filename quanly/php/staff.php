<?php
require_once "db/NhanVien.php";

$type = $_POST['type'];

if($type === 'login'){
    $msnv = $_POST['msnv'];

    $nhanVien = \quanly\php\db\NhanVien::tim($msnv);

    if($nhanVien === ''){
        echo $nhanVien;
    }else{
        $_SESSION['userName'] = $nhanVien->msnv;
        echo json_encode($nhanVien, 256);
    }
}

if($type === 'isLogin'){
    if(isset($_SESSION['userName']))
        echo true;
    else echo false;
}

if($type === "getStaff"){
    $msnv = $_POST['msnv'];

    $result = \quanly\php\db\NhanVien::tim($msnv);

    echo json_encode($result, 256);
}

if($type === "getStaffs"){
    $result = \quanly\php\db\NhanVien::timTatCa();

    echo json_encode($result, 256);
}

if($type === "getInfo"){
    $msnv = $_POST['msnv'];
    $nhanVien = \quanly\php\db\NhanVien::tim($msnv);
    echo json_encode($nhanVien, 256);
}

if($type === "addStaff"){
    $msnv = $_POST['msnv'];
    $name = $_POST['name'];
    $position = $_POST['position'];
    $phoneNumber = $_POST['phoneNumber'];
    $address = $_POST['address'];

    $result = \quanly\php\db\NhanVien::them($msnv, $name, $position, $address, $phoneNumber);

    echo $result;
}

if($type === "deleteStaff"){
    $msnv = $_POST['msnv'];
    $result = \quanly\php\db\NhanVien::xoa($msnv);
    echo $result;
}

if($type === "updateStaff"){
    $msnv = $_POST['msnv'];
    $name = $_POST['name'];
    $position = $_POST['position'];
    $phoneNumber = $_POST['phoneNumber'];
    $address = $_POST['address'];

    $result = \quanly\php\db\NhanVien::capNhat($msnv, $name, $position, $address, $phoneNumber);

    echo $result;
}

if($type === "search"){
    $keyWord = $_POST['keyWord'];
    $result = \quanly\php\db\NhanVien::timKiem($keyWord);

    echo json_encode($result, 256);
}
