<?php

use \khachhang\php\db\KhachHang;
use \khachhang\php\db\DiaChiKH;
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

        $madc = DiaChiKH::taoMaDC();

        $result = KhachHang::them($userName, $name, $sdt, $email);
        if (DiaChiKH::them($madc, $diaChi, $userName) === false) $result = false;

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
