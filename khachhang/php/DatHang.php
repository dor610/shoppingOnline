<?php
namespace khachhang\php\db;
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

    public static function xoa($soDonHh){
        $conn = getConnection();
        $sql = "delete from dathang where SoDonHH = '".$soDonHh."'";
        ChiTietDatHang::xoaTatCa($soDonHh);
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
}

