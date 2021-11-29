<?php
use quanly\php\db\DatHang;
require_once "db/DatHang.php";

$type = $_POST['type'];

if($type === 'totalOrderToday'){
    $result = DatHang::soDonHangTrongNgay();
    echo $result;
}

if($type === 'totalSoldItemToday'){
    $result = DatHang::soSanPhamDaBanTrongNgay();
    echo $result;
}

if($type === 'todayIncome'){
    $result = DatHang::doanhThuTrongNgay();
    echo $result;
}

if($type === "totalOrderByMonth"){
    $month = $_POST['month'];
    $year = $_POST['year'];
    $result = DatHang::soDonHangTheoThang($month, $year);
    echo $result;
}

if($type === "todayDeliveredOrder"){
    $result = DatHang::soDonHangDaGiaoTrongNgay();
    echo $result;
}

if($type === "topSellingItem"){
    $result = DatHang::sanPhamBanChay();
    echo json_encode($result, 256);
}