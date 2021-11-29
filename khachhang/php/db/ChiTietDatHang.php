<?php
namespace khachhang\php\db;
require_once "connection.php";

class ChiTietDatHang{
    public $soDonHH;
    public $mshh;
    public $mskc;
    public $soLuong;
    public $giaDatHang;

    public function __construct($soDonHH, $mshh, $mskc, $soLuong, $giaDatHang){
        $this->mshh = $mshh;
        $this->soLuong = $soLuong;
        $this->mskc = $mskc;
        $this->giaDatHang = $giaDatHang;
        $this->soDonHH = $soDonHH;
    }

    public static function them($soDonHH, $mshh, $mskc, $soLuong, $gia){
        $conn = getConnection();
        $sql = $conn->prepare('insert into chitietdathang values (?,?,?,?,?)');
        $sql->bind_param('sssid', $soD, $mh, $mk, $so, $g);
        $soD = $soDonHH;
        $mh = $mshh;
        $mk = $mskc;
        $so = $soLuong;
        $g = $gia;

        $result = $sql->execute();
        $sql->close();
        $conn->close();
        return $result;
    }

    public static function themNhieu($chiTiet){
        $conn = getConnection();
        $sql = $conn->prepare("insert into chitietdathang values (?,?,?,?,?)");
        $sql->bind_param('sssid', $soD, $mh, $mk, $so, $g);
        for ($count = 0; $count < count($chiTiet); $count++){
            $soD = $chiTiet[$count]["soDonHH"];
            $mh = $chiTiet[$count]["mshh"];
            $mk = $chiTiet[$count]["mskc"];
            $so = $chiTiet[$count]["soLuong"];
            $g = $chiTiet[$count]["gia"];
            $sql->execute();
        }
    }

    public static function xoaTatCa($soDonHH){
        $conn = getConnection();
        $sql = "delete from chitiethanghoa where SoDonHH = '".$soDonHH."'";

        $result = $conn->query($sql);
        $conn->close();
        return $result;
    }

    public static function timChiTiet($madh){
        $conn = getConnection();
        $sql = "SELECT SoLuong, GiaDatHang, Tenhh, kichco.TenKichCo, hanghoa.mshh from chitietdathang JOIN hanghoa on hanghoa.mshh = chitietdathang.mshh
													  JOIN kichco on chitietdathang.mskc = kichco.mskc where SoDonHH = '$madh'";

        $result = $conn->query($sql);
        $arr = [];
        $count = 0;
        if($result->num_rows > 0){
            while ($row = $result->fetch_assoc()){
                $arr[$count] = json_encode($row, 256);
                $count++;
            }
        }
        $result->close();
        $conn->close();
        return $arr;
    }
}