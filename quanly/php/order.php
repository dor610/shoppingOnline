<?php
use quanly\php\db\TrangThaiDonHang;
use quanly\php\db\DatHang;
use quanly\php\db\ChiTietDatHang;
use quanly\php\db\KichCoHangHoa;


require_once "db/KichCoHangHoa.php";
require_once "db/DatHang.php";
require_once "db/TrangThaiDonHang.php";
require_once "db/ChiTietDatHang.php";

$type = $_POST['type'];

if($type === "getStatus"){
    $result = TrangThaiDonHang::timTatCa();
    echo json_encode($result, 256);
}

if($type === "getOrderDetail"){
    $soDonHH = $_POST['soDonHH'];
    $result = DatHang::tim($soDonHH);

    echo json_encode($result, 256);
}

if($type === "getOrderBasicDetail"){
    $mstt = $_POST['mstt'];
    $offset = $_POST['offset'];
    $result = DatHang::timTatCa($mstt, $offset, "orderBasicDetail");

    echo json_encode($result, 256);
}

if($type === "getOrderItems"){
    $madh = $_POST['madh'];
    $result = ChiTietDatHang::tim($madh);

    echo json_encode($result, 256);
}

if($type === "updateDeliveryDate"){
    $ngayGH = $_POST['ngayGH'];
    $madh = $_POST['madh'];

    $result = DatHang::capNhatNgayGiaoHang($ngayGH, $madh);

    echo $result;
}

if($type === "updateOrderStatus"){
    $status = $_POST['trangThai'];
    $madh = $_POST['madh'];

    $result = DatHang::capNhatTrangThai($status, $madh);
    echo $result;
}

if($type === "updateStaffInfo"){
    $msnv = $_POST['msnv'];
    $madh = $_POST['madh'];
    $result = DatHang::capNhatThongTinNhanVien($msnv, $madh);
}

if($type === "updateItemQuantity"){
    $mskc = $_POST['mskc'];
    $mshh = $_POST['mshh'];
    $soLuong = $_POST['soLuong'];
    $result = KichCoHangHoa::capNhatSoLuong($mskc, $mshh, $soLuong);

    echo $result;
}

if($type === "search"){
    $offset = $_POST['offset'];
    $madh = $_POST['madh'];
    $result = DatHang::timKiem($madh, $offset);

    echo json_encode($result, 256);
}

