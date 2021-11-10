<?php

namespace quanly\php\db;

class NhanVien{

    public $msnv;
    public $chuVu;
    public $hoTenNV;
    public $diaChi;
    public $soDienThoai;

    public function __construct($msnv, $hoTenNV, $chuVu, $diaChi, $soDienThoai){
        $this->msnv = $msnv;
        $this->hoTenNV = $hoTenNV;
        $this->chuVu = $chuVu;
        $this->diaChi = $diaChi;
        $this->soDienThoai = $soDienThoai;
    }

    public static function them($newMsnv, $newHoTenNV, $newChuVu, $newDiaChi, $newSoDienThoai){
        $conn = getConnection();

        $sql = $conn->prepare("insert into nhanvien values (?,?,?,?,?)");
        $sql->bind_param("sssss", $msnv, $hoTenNV, $chuVu, $diaChi, $soDienThoai);
        $msnv = $newMsnv;
        $hoTenNV = $newHoTenNV;
        $chuVu = $newChuVu;
        $diaChi = $newDiaChi;
        $soDienThoai = $newSoDienThoai;

        $result = $sql->execute();

        $sql->close();
        $conn->close();
        return $result;
    }

    public static function xoa($msnv){
        $conn = getConnection();

        $sql = "delete from nhanvien where msnv ='".$msnv."'";

        $result = $conn->query($sql);

        $conn->close();
        return $result;
    }

    public static function tim($msnv){
        $conn = getConnection();

        $sql = "select * from nhanvien where msnv = '".$msnv."'";
        $nhanVien = "";
        $result = $conn->query($sql);
        if($result->num_rows > 0){
            $row = $result->fetch_assoc();
            $nhanVien = new NhanVien($row["msnv"], $row["HoTenNV"],$row["ChucVu"], $row["DiaChi"], $row["SoDienThoai"]);
        }

        $result->close();
        $conn->close();
        return $nhanVien;
    }

    public static function timTatCa(){
        $conn = getConnection();

        $sql = "select * from nhanvien";

        $result = $conn->query($sql);
        $arr = [];
        if($result->num_rows > 0){
            while ($row = $result->fetch_assoc()){
                $nhanVien = new NhanVien($row["msnv"], $row["HoTenNV"],$row["ChucVu"], $row["DiaChi"], $row["SoDienThoai"]);
                $arr[$row["mskh"]] = $nhanVien;
            }
        }
        $result->close();
        $conn->close();
        return $arr;
    }

    public static function capNhat(){

    }

}