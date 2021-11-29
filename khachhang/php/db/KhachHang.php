<?php

namespace khachhang\php\db;
require_once "connection.php";
require_once "DiaChiKH.php";
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

    public static function them($mskh, $hoTenKh, $soDienThoai, $email){
        $conn = getConnection();

        $sql = $conn->prepare("insert into khachhang values (?,?,?,?,?)");

        $sql->bind_param("sssss", $nmskh, $nhoTenKh, $nsoDienThoai, $nemail, $xoa);
        $nsoDienThoai = $soDienThoai;
        $nmskh = $mskh;
        $nhoTenKh = $hoTenKh;
        $nemail = $email;
        $xoa = 'false';
        $result = $sql->execute();

        $sql->close();
        $conn->close();
        return $result;
    }

    public static function capNhatTen($name, $mskh){
        $conn = getConnection();
        $sql = "update khachhang set HoTenKH = '$name' where mskh = '$mskh'";
        $result = $conn->query($sql);
        $conn->close();
        return $result;
    }

    public static function capNhatSDT($tel, $mskh){
        $conn = getConnection();
        $sql = "update khachhang set SoDienThoai = '$tel' where mskh = '$mskh'";
        $result = $conn->query($sql);
        $conn->close();
        return $result;
    }

    public static function capNhatEmail($email, $mskh){
        $conn = getConnection();
        $sql = "update khachhang set email = '$email' where mskh = '$mskh'";
        $result = $conn->query($sql);
        $conn->close();
        return $result;
    }

    public static function timGuest($mskh){
        $conn = getConnection();
        $sql = "select khachhang.mskh, madc from khachhang join diachikh on khachhang.mskh = diachikh.mskh where khachhang.mskh ='$mskh'";
        $result = $conn->query($sql);
        $guest = '';
        if($result->num_rows > 0){
            $guest = $result->fetch_assoc();
        }
        $result->close();
        $conn->close();
        return $guest;
    }

    public static function taoGuestUserName(){
        $conn = getConnection();
        $sql = "select mskh from khachhang where mskh like '%guest%' order by mskh desc limit 0,1";
        $result = $conn->query($sql);
        $mskh = '';
        if($result->num_rows > 0){
            $row = $result->fetch_assoc();
            $mskh = $row['mskh'];
        }
        $result->close();
        $conn->close();
        if($mskh !== ''){
            $mskh = substr($mskh,5);
            $id = intval($mskh);
            $id++;
            $mskh = "guest".$id;
        }else{
            $mskh = 'guest1';
        }
        return $mskh;
    }
}