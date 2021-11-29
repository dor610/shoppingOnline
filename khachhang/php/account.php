<?php

use \khachhang\php\db\KhachHang;
use \khachhang\php\db\DiaChiKH;
require_once "db/KhachHang.php";
require_once "db/DiaChiKH.php";
    session_start();
    $type = $_POST['type'];

    if($type === "login"){
        $userName = $_POST['userName'];
        $password = $_POST['password'];

        $khachHang = KhachHang::tim($userName);

        if($khachHang != null){

            $diaChiKH = DiaChiKH::tim($khachHang->mskh);

            $response['mskh'] = $khachHang->mskh;
            $response['email'] = $khachHang->email;
            $response['sdt'] = $khachHang->soDienThoai;
            $response['hoTen'] = $khachHang->hoTenKh;
            $response['email'] = $khachHang->email;
            $response['isSuccess'] = true;

            if($diaChiKH != null)
                $response['diaChi'] = $diaChiKH->diaChi;

            $_SESSION['userName'] = $khachHang->mskh;
            echo json_encode($response, JSON_UNESCAPED_UNICODE);
        }else{
            $response['isSuccess'] = false;

            echo json_encode($response, JSON_UNESCAPED_UNICODE);
        }
    }

    if($type === "register"){
        $userName = $_POST['userName'];
        $password = $_POST['password'];
        $name = $_POST['name'];
        $sdt = $_POST['sdt'];
        $diaChi = $_POST['diaChi'];
        $email = $_POST['email'];

        $result = KhachHang::them($userName, $name, $sdt, $email);
        if (DiaChiKH::them($diaChi, $userName) === false) $result = false;

        if($result == true){
            $response['isSuccess'] = true;
            echo json_encode($response, JSON_UNESCAPED_UNICODE);
        }else{
           // KhachHang::xoa($userName);
            //DiaChiKH::xoa($madc);
            $response['isSuccess'] = false;
            echo json_encode($response, JSON_UNESCAPED_UNICODE);
        }
    }

    if($type === "guestAccount"){
        $name = $_POST['name'];
        $sdt = $_POST['tel'];
        $diaChi = $_POST['address'];
        $email = null;
        $userName = KhachHang::taoGuestUserName();

        KhachHang::them($userName, $name, $sdt, $email);
        DiaChiKH::them($diaChi, $userName);

        $result = KhachHang::timGuest($userName);

        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    }

    if($type === "logout"){
        unset($_SESSION["userName"]);

        $response["isSuccess"] = true;

        echo json_encode($response);
    }

    if($type === "isLoggedIn"){
        $response['result'] = false;
        if(isset($_SESSION['userName']))
            $response['result'] = true;

        echo json_encode($response);
    }

    if($type === 'getAddresses'){
        $mskh = $_POST['mskh'];
        $result = DiaChiKH::timTatCa($mskh);
        echo json_encode($result, 256);
    }

    if($type === "getAddress"){
        $madc = $_POST['madc'];
        $result = DiaChiKH::timDiaChi($madc);

        echo json_encode($result, 256);
    }

    if($type === "addAddress"){
        $mskh = $_POST['mskh'];
        $diaChi = $_POST['address'];
        $result = DiaChiKH::them($diaChi, $mskh);
        echo $result;
    }

    if ($type === "removeAddress"){
        $madc = $_POST['madc'];
        $result = DiaChiKH::xoa($madc);
        echo $result;
    }

    if($type === "updatehoTen"){
        $name = $_POST['value'];
        $mskh = $_POST['mskh'];
        $result = KhachHang::capNhatTen($name, $mskh);
        echo $result;
    }
    if ($type === "updatesdt"){
        $tel = $_POST['tel'];
        $mskh = $_POST['mskh'];
        $result = KhachHang::capNhatSDT($tel, $mskh);
        echo $result;

    }
    if($type === "updateemail"){
        $email = $_POST['value'];
        $mskh = $_POST['mskh'];
        $result = KhachHang::capNhatEmail($email, $mskh);
        echo $result;
    }
