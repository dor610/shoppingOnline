<?php

namespace khachhang\php\db;
require_once "connection.php";
class KhachHang{

    public $mskh;
    public $hoTenKh;
    public $email;
    public $soDienThoai;

    public function __construct($mskh, $hoTenKh, $soDienThoai, $email){
        $this->mskh = $mskh;
        $this->hoTenKh = $hoTenKh;
        $this->soDienThoai = $soDienThoai;
        $this->email = $email;
    }

    public static function xoa($mskh){
        $conn = getConnection();

        $sql = "delete from khachhang where mskh = '".$mskh."'";

        $result = $conn->query($sql);

        $conn->close();
        return $result;
    }

    public static function tim($mskh){
        $conn = getConnection();

        $sql = "select * from khachhang where mskh ='".$mskh."'";

        $result = $conn->query($sql);
        $khachhang = null;
        if($result->num_rows > 0){
            $row = $result->fetch_assoc();
            $khachhang = new KhachHang($row["mskh"], $row["HoTenKH"], $row["SoDienThoai"], $row["email"]);
        }

        $conn->close();
        $result->close();
        return $khachhang;
    }

    public static function capNhat(){

    }
}
/*
$k = KhachHang::tim("khang");
echo json_encode($k, JSON_UNESCAPED_UNICODE);*/