<?php

require_once "connection.php";
require_once "NhanVien.php";

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

if($type === "getInfo"){
    $msnv = $_POST['msnv'];
    $nhanVien = \quanly\php\db\NhanVien::tim($msnv);
    echo json_encode($nhanVien, 256);
}
