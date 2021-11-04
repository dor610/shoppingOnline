<?php
require_once "HangHoa.php";
require_once "KichCoHangHoa.php";
require_once "SanPhamGioHang.php";
require_once "DatHang.php";
require_once "ChiTietDatHang.php";

$type = $_POST['type'];


if($type == 'get'){
    $fill = $_POST['fill'];
    $sort = $_POST['sort'];
    $offset = $_POST['offset'];
    $soLuong = $_POST['soLuong'];

    $result = \khachhang\php\db\HangHoa::layHangHoa($offset, $soLuong, $fill, $sort);
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
}

if($type == 'getOne'){
    $mshh = $_POST['mshh'];
    $result = \khachhang\php\db\HangHoa::tim($mshh);
    if($result != ''){
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    }else echo '';
}

if($type == 'kichCo'){
    $mshh = $_POST['mshh'];
    $result = \khachhang\php\db\KichCoHangHoa::getKichCoHangHoa($mshh);
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
}

if ($type == 'themGioHang'){
    $mshh = $_POST['mshh'];
    $mskh = $_POST['mskh'];
    $mskc = $_POST['mskc'];
    $soLuong = $_POST['soLuong'];

    $soLuongCu = \khachhang\php\db\SanPhamGioHang::tim($mshh, $mskh, $mskc);
    if($soLuongCu > 0){
        $soLuong += $soLuongCu;
        $result = \khachhang\php\db\SanPhamGioHang::capNhatSoLuong($mshh, $mskh, $mskc, $soLuong);
        echo $result;
    }else{
        $result = \khachhang\php\db\SanPhamGioHang::them($mshh, $mskh, $mskc, $soLuong);
        echo $result;
    }
}

if($type == 'layGioHang'){
    $mskh = $_POST['mskh'];

    $result = \khachhang\php\db\SanPhamGioHang::layHangHoa($mskh);
    echo json_encode($result, 256);
}

if($type == 'xoaGioHang'){
    $mshh = $_POST['mshh'];
    $mskc = $_POST['mskc'];
    $mskh = $_POST['mskh'];

    $result = \khachhang\php\db\SanPhamGioHang::xoa($mshh, $mskh, $mskc);

    echo $result;
}

if($type == 'getImg'){
    $mshh = $_POST['mshh'];

    $result = \khachhang\php\db\HangHoa::timHinh($mshh);

    echo $result;
}

if($type == 'datHang'){
    $mskh = $_POST['mskh'];
    $madc = $_POST['madc'];
    $thanhToan = $_POST['thanhToan'];
    $result = \khachhang\php\db\DatHang::them($mskh, $madc, $thanhToan);

    echo $result;
}

if($type == 'chiTietDatHang'){
    $mskh = $_POST['mskh'];
    $chiTiet = $_POST['chiTiet'];
    $chiTiet = array_values(json_decode($chiTiet, true));
    \khachhang\php\db\ChiTietDatHang::themNhieu($chiTiet);

    for ($c = 0; $c < count($chiTiet); $c++){
        \khachhang\php\db\SanPhamGioHang::xoa($chiTiet[$c]["mshh"], $mskh, $chiTiet[$c]["mskc"]);
    }


    echo "";
}



