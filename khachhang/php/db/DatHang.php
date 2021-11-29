<?php
namespace khachhang\php\db;
use DateTime;
use quanly\php\db\ChiTietDatHang;

require_once "connection.php";
require_once "ChiTietDatHang.php";
class DatHang{
    public $soDonHH;
    public $mskh;
    public $madc;
    public $msnv;
    public $thanhToan;
    public $ngayDatHang;
    public $ngayGiaoHang;
    public $trangThai;

    public function __construct($soDonHH, $mskh, $msnv, $madc, $thanhToan, $ngayDatHang, $ngayGiaoHang, $trangThai){
        $this->soDonHH = $soDonHH;
        $this->mskh = $mskh;
        $this->msnv = $msnv;
        $this->madc = $madc;
        $this->thanhToan = $thanhToan;
        $this->ngayDatHang = $ngayDatHang;
        $this-> ngayGiaoHang = $ngayGiaoHang;
        $this->trangThai = $trangThai;
    }

    public static function them($mskh, $madc, $thanhToan){
        $soDonHH = DatHang::taoSoDonHH();
        $conn = getConnection();
        $sql = $conn->prepare("insert into dathang(SoDonHH, mskh, madc, thanhtoan, ngayDH, trangthai) values (?,?,?,?,?,?)");
        $sql->bind_param("ssssss", $so, $mk, $md, $thanht, $ngay, $tt);
        $date = date("Y-m-j");
        $so = $soDonHH;
        $mk = $mskh;
        $md= $madc;
        $thanht = $thanhToan;
        $ngay = $date;
        $tt = '00001';

        $result = $sql->execute();
        $sql->close();
        $conn->close();
        return $soDonHH;
    }


    public static function huyDonHang($madh){
        $conn = getConnection();
        $sql = "update dathang set trangthai = '00005' where SoDonHH = '$madh'";
        $result = $conn->query($sql);

        $conn->close();
        return $result;
    }


    public static function taoSoDonHH(){
        $conn = getConnection();
        $sql = "SELECT SoDonHH from dathang ORDER by SoDonHH DESC LIMIT 1";
        $result = $conn->query($sql);

        if($result->num_rows > 0){
            $soDonHH = ($result->fetch_assoc())['SoDonHH'];
            $soDonHH = (intval($soDonHH) +1)."";
            $length = 10 - strlen($soDonHH);
            if($length > 0){
                for($count = 0; $count < $length; $count ++){
                    $soDonHH = "0".$soDonHH;
                }
            }
            return $soDonHH;
        }

        return "0000000001";
    }

    public static function tim($madh){
        $conn = getConnection();
        $sql = "select * from dathang where SoDonHH = '$madh'";
        $result = $conn->query($sql);
        $donHang = '';
        if($result->num_rows > 0){
            $row= $result->fetch_assoc();
            $donHang = new DatHang($row['SoDonHH'], $row['mskh'], $row['msnv'], $row['madc'], $row['thanhtoan'], $row['ngayDH'], $row['ngayGH'], $row['trangthai']);
        }
        $result->close();
        $conn->close();
        return $donHang;
    }

    public static function timTatCa($mskh, $offset){
        $conn = getConnection();
        $sql = "select * from dathang where mskh = '$mskh' order by ngayDH DESC limit $offset, 15";
        $result = $conn->query($sql);
        $arr = [];
        $count = 0;
        if($result->num_rows> 0){
            while($row = $result->fetch_assoc()){
                $donHang = new DatHang($row['SoDonHH'], $row['mskh'], $row['msnv'], $row['madc'], $row['thanhtoan'], $row['ngayDH'], $row['ngayGH'], $row['trangthai']);
                $arr[$count] = json_encode($donHang, 256);
                $count++;
            }
        }
        $result->close();
        $conn->close();
        return $arr;
    }
}
