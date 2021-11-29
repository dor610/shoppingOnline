<?php
use \khachhang\php\db\HangHoa;
use \khachhang\php\db\KichCoHangHoa;
use \khachhang\php\db\SanPhamGioHang;
use \khachhang\php\db\DatHang;
use \khachhang\php\db\ChiTietDatHang;
use \khachhang\php\db\HinhHangHoa;
use khachhang\php\db\TrangThaiDonHang;

require_once "db/HangHoa.php";
require_once "db/KichCoHangHoa.php";
require_once "db/SanPhamGioHang.php";
require_once "db/DatHang.php";
require_once "db/HinhHangHoa.php";
require_once "db/ChiTietDatHang.php";
require_once "db/TrangThaiDonHang.php";

$type = $_POST['type'];


if($type == 'get'){
    $fill = $_POST['fill'];
    $sort = $_POST['sort'];
    $offset = $_POST['offset'];
    $soLuong = $_POST['soLuong'];

    $result = HangHoa::layHangHoa($offset, $soLuong, $fill, $sort);
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
}

if($type == 'getOne'){
    $mshh = $_POST['mshh'];
    $result = HangHoa::tim($mshh);
    if($result != ''){
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    }else echo '';
}

if($type == 'kichCo'){
    $mshh = $_POST['mshh'];
    $result = KichCoHangHoa::getKichCoHangHoa($mshh);
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
}

if ($type == 'themGioHang'){
    $mshh = $_POST['mshh'];
    $mskh = $_POST['mskh'];
    $mskc = $_POST['mskc'];
    $soLuong = $_POST['soLuong'];

    $soLuongCu = SanPhamGioHang::tim($mshh, $mskh, $mskc);
    if($soLuongCu > 0){
        $soLuong += $soLuongCu;
        $result = SanPhamGioHang::capNhatSoLuong($mshh, $mskh, $mskc, $soLuong);
        echo $result;
    }else{
        $result = SanPhamGioHang::them($mshh, $mskh, $mskc, $soLuong);
        echo $result;
    }
}

if($type == 'layGioHang'){
    $mskh = $_POST['mskh'];

    $result = SanPhamGioHang::layHangHoa($mskh);
    echo json_encode($result, 256);
}

if($type == 'xoaGioHang'){
    $mshh = $_POST['mshh'];
    $mskc = $_POST['mskc'];
    $mskh = $_POST['mskh'];

    $result = SanPhamGioHang::xoa($mshh, $mskh, $mskc);

    echo $result;
}

if($type === "getItemImage"){
    $mshh = $_POST['mshh'];
    $result = HinhHangHoa::tim($mshh);

    echo json_encode($result, 256);
}

if($type == 'datHang'){
    $mskh = $_POST['mskh'];
    $madc = $_POST['madc'];
    $thanhToan = $_POST['thanhToan'];
    $result = DatHang::them($mskh, $madc, $thanhToan);

    echo $result;
}

if($type == 'chiTietDatHang'){
    $mskh = $_POST['mskh'];
    $chiTiet = $_POST['chiTiet'];
    $chiTiet = array_values(json_decode($chiTiet, true));
    ChiTietDatHang::themNhieu($chiTiet);

    for ($c = 0; $c < count($chiTiet); $c++){
        SanPhamGioHang::xoa($chiTiet[$c]["mshh"], $mskh, $chiTiet[$c]["mskc"]);
    }


    echo "";
}

if($type === "getStatus"){
    $result = TrangThaiDonHang::timTatCa();
    echo json_encode($result, 256);
}

if($type === "getOrder"){
    $madh = $_POST['madh'];
    $result = DatHang::tim($madh);
    echo  json_encode($result, 256);
}

if($type === "getOrders"){
    $mskh = $_POST['mskh'];
    $offset = $_POST['offset'];
    $result = DatHang::timTatCa($mskh, $offset);

    echo json_encode($result, 256);
}

if($type === "getOrderItems"){
    $madh = $_POST['madh'];
    $result = ChiTietDatHang::timChiTiet($madh);

    echo json_encode($result, 256);
}


if($type === 'cancelOrder'){
    $madh = $_POST['madh'];
    $result = DatHang::huyDonHang($madh);
    echo $result;
}
