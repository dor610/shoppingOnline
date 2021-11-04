<?php

namespace quanly\php\db;

class NhanVien{

    public $msnv;
    public $chuVu;
    public $diaChi;
    public $soDienThoai;

    public function __construct($msnv, $chuVu, $diaChi, $soDienThoai){
        $this->msnv = $msnv;
        $this->chuVu = $chuVu;
        $this->diaChi = $diaChi;
        $this->soDienThoai = $soDienThoai;
    }

    public static function them($newMsnv, $newChuVu, $newDiaChi, $newSoDienThoai){
        $conn = getConnection();

        $sql = $conn->prepare("insert into nhanvien values (?,?,?,?)");
        $sql->bind_param("ssss", $msnv, $chuVu, $diaChi, $soDienThoai);
        $msnv = $newMsnv;
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
            $nhanVien = new NhanVien($row["msnv"], $row["chucvu"], $row["diachi"], $row["sodienthoai"]);
        }

        $result->close();
        $conn->close();
        return $nhanVien;
    }

    public static function timTatCa(){
        $conn = getConnection();

        $sql = "select * from nhanvien";

        $result = $conn->query($sql);
        $arr = array([]);
        if($result->num_rows > 0){
            while ($row = $result->fetch_assoc()){
                $nhanVien = new NhanVien($row["msnv"], $row["chucvu"], $row["diachi"], $row["sodienthoai"]);
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