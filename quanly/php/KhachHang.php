<?php

namespace quanly\php\db;

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

    public static function them($newMskh, $newHoTenKh, $newSoDienThoai, $newEmail){
        $conn = getConnection();

        $sql = $conn->prepare("insert into khachhang values (?,?,?,?)");

        $sql->bind_param("sssss", $mskh, $hoTenKh, $soDienThoai, $email);
        $mskh = $newMskh;
        $hoTenKh = $newHoTenKh;
        $soDienThoai = $newSoDienThoai;
        $email = $newEmail;

        $result = $sql->execute();

        $sql->close();
        $conn->close();
        return $result;
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
        $khachhang = "";
        if($result->num_rows > 0){
            $row = $result->fetch_assoc();
            $khachhang = new KhachHang($row["mskh"], $row["hotenkh"], $row["sodienthoai"], $row["email"]);
        }

        $conn->close();
        $result->close();
        return $khachhang;
    }

    public static function timTatCa(){
        $conn = getConnection();

        $sql = "select * from khachhang";

        $result = $conn->query($sql);
        $arr = array([]);
        if($result->num_rows > 0){
            while ($row = $result->fetch_assoc()){
                $khachhang = new KhachHang($row["mskh"], $row["hotenkh"], $row["sodienthoai"], $row["email"]);
                $arr[$row["mskh"]] = $khachhang;
            }
        }
        $result->close();
        $conn->close();
        return $arr;
    }

    public static function capNhat(){

    }
}