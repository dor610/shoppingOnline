<?php

namespace quanly\php\db;

use Cassandra\Date;
use Cassandra\Function_;

require_once "connection.php";
class DatHang{
    public $madh;
    public $mskh;
    public $madc;
    public $msnv;
    public $thanhToan;
    public $ngayDatHang;
    public $ngayGiaoHang;
    public $trangThai;

    public function __construct($madh, $mskh, $madc, $msnv, $thanhToan, $ngayDatHang, $ngayGiaoHang, $trangThai){
        $this->madh = $madh;
        $this->mskh = $mskh;
        $this->msnv = $msnv;
        $this->madc = $madc;
        $this->thanhToan = $thanhToan;
        $this->ngayDatHang = $ngayDatHang;
        $this-> ngayGiaoHang = $ngayGiaoHang;
        $this->trangThai = $trangThai;
    }

    public static function them($mskh, $madc, $thanhToan){
        $madh = DatHang::taomadh();
        $conn = getConnection();
        $sql = $conn->prepare("insert into dathang(madh, mskh, madc, thanhtoan, ngayDH, trangthai) values (?,?,?,?,?,?)");
        $sql->bind_param("ssssss", $so, $mk, $md, $thanht, $ngay, $tt);
        $date = date("Y-m-j");
        $so = $madh;
        $mk = $mskh;
        $md= $madc;
        $thanht = $thanhToan;
        $ngay = $date;
        $tt = '00001';

        $result = $sql->execute();
        $sql->close();
        $conn->close();
        return $madh;
    }

    public static function tim($madh){
        $conn = getConnection();
        $sql = "select * from dathang where SoDonHH = '".$madh."'";
        $result = $conn->query($sql);
        $donHang = '';
        if($result->num_rows > 0){
            $row = $result->fetch_assoc();
            $donHang = new DatHang($row["SoDonHH"], $row["mskh"], $row['madc'], $row['msnv'], $row["thanhtoan"], $row["ngayDH"], $row['ngayGH'], $row['trangthai']);
        }
        $result->close();
        $conn->close();
        return $donHang;

    }

    public static function timTatCa($condition, $offset, $type){
        $conn = getConnection();
        $sql = "";
        if($type === "customerOrder"){
            $sql = "SELECT SoDonHH, ngayDH, ngayGH, msnv, thanhtoan, diachikh.DiaChi, trangthaidonhang.tenTT 
                    FROM dathang JOIN diachikh on dathang.madc = diachikh.madc 
                        JOIN trangthaidonhang ON dathang.trangthai = trangthaidonhang.mstt WHERE dathang.mskh = '".$condition."'";
        }

        if($type == "orderBasicDetail"){
            $sql = "SELECT SoDonHH, HoTenKH, msnv, trangthai from dathang JOIN khachhang on dathang.mskh = khachhang.mskh where trangthai = '{$condition}' limit {$offset},15";
        }
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

    public static function huyDonHang($madh){
        $conn = getConnection();
        $sql = "update dathang set trangthai = '00005' where SoDonHH = '$madh'";
        $result = $conn->query($sql);

        $conn->close();
        return $result;
    }


    public static function capNhatNgayGiaoHang($ngayGiaoHang, $madh){
        $conn = getConnection();
        $sql = "update dathang set ngayGH = '$ngayGiaoHang' where SoDonHH = '$madh'";

        return $conn->query($sql);
    }

    public static function capNhatTrangThai($trangthai, $madh){
        $conn = getConnection();
        $sql = "update dathang set trangthai = '$trangthai' where SoDonHH = '$madh'";
        $result = $conn->query($sql);
        $conn->close();
        return $result;
    }

    public static function capNhatThongTinNhanVien($msnv, $madh){
        $conn = getConnection();
        $sql = "update dathang set msnv = '$msnv' where SoDonHH = '$madh'";
        $result = $conn->query($sql);
        $conn->close();
        return $result;
    }

    public static function taomadh(){
        $conn = getConnection();
        $sql = "SELECT madh from dathang ORDER by madh DESC LIMIT 1";
        $result = $conn->query($sql);

        if($result->num_rows > 0){
            $madh = ($result->fetch_assoc())['madh'];
            $madh = (intval($madh) +1)."";
            $length = 10 - strlen($madh);
            if($length > 0){
                for($count = 0; $count < $length; $count ++){
                    $madh = "0".$madh;
                }
            }
            return $madh;
        }

        return "0000000001";
    }

    public static function timKiem($madh, $offset){
        $conn = getConnection();
        $sql = "SELECT SoDonHH, HoTenKH, msnv, trangthai from dathang JOIN khachhang on dathang.mskh = khachhang.mskh where SoDonHH LIKE '%$madh%' limit {$offset},15";

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

    public static function soDonHangTrongNgay(){
        $conn = getConnection();
        $date = date('Y-m-j');
        $sql = "select count(SoDonHH) soluong from dathang where Date(ngayDH) = '$date'";
        $result = $conn->query($sql);
        $num = 0;
        if ($result->num_rows > 0){
            $row = $result->fetch_assoc();
            $num = intval($row['soluong']);
        }
        $result->close();
        $conn->close();
        return $num;

    }
    public static function doanhThuTrongNgay(){
        $conn = getConnection();
        $date = date('Y-m-j');
        $sql = "SELECT SoLuong, GiaDatHang from dathang JOIN chitietdathang on dathang.SoDonHH = chitietdathang.SoDonHH 
                where Date(ngayDH) = '$date' and trangthai = '00004'";
        $totalIncome = 0;
        $result = $conn->query($sql);
        if($result->num_rows > 0){
            while ($row = $result->fetch_assoc()){
                $totalIncome += (intval($row['SoLuong']) * intval($row['GiaDatHang']));
            }
        }

        $result->close();
        $conn->close();
        return $totalIncome;
    }

    public static function soDonHangDaGiaoTrongNgay(){
        $conn = getConnection();
        $date = date('Y-m-j');
        $sql = "select count(SoDonHH) as soluong from dathang where Date(ngayGH) = '$date' and trangthai = '00004'";
        $result = $conn->query($sql);
        $num = 0;
        if ($result->num_rows > 0){
            $row = $result->fetch_assoc();
            $num = intval($row['soluong']);
        }
        $result->close();
        $conn->close();
        return $num;
    }

    public static function soDonHangTheoThang($thang, $nam){
        $conn = getConnection();
        $sql = "SELECT COUNT(SoDonHH) as soluong from dathang WHERE extract(month from Date(ngayDH)) = '$thang' and extract(year from Date(ngayDH)) = '$nam'";
        $result = $conn->query($sql);
        $num = 0;
        if ($result->num_rows > 0){
            $row = $result->fetch_assoc();
            $num = intval($row['soluong']);
        }
        $result->close();
        $conn->close();
        return $num;
    }
   /* public static function doanhThuTheoThang($thang){

    }

    public static function soDonHangTheoNgay($ngay){

    }

    public static function doanhThuTheoNgay($thang){

    }*/
    public static function soSanPhamDaBanTrongNgay(){
        $conn = getConnection();
        $date = date('Y-m-j');
        $sql = "select sum(chitietdathang.SoLuong) as soluong from dathang JOIN chitietdathang on dathang.SoDonHH = chitietdathang.SoDonHH 
	            where Date(ngayDH) = '$date'";
        $result = $conn->query($sql);
        $num = 0;
        if ($result->num_rows > 0){
            $row = $result->fetch_assoc();
            $num = intval($row['soluong']);
        }
        $result->close();
        $conn->close();
        return $num;
    }

    public static function sanPhamBanChay(){
        $conn = getConnection();
        $sql = "select chitietdathang.mshh, sum(SoLuong) as soluong, Tenhh from dathang JOIN chitietdathang on dathang.SoDonHH = chitietdathang.SoDonHH
                                                                                        JOIN hanghoa on chitietdathang.mshh = hanghoa.mshh 
                                                                                        GROUP by chitietdathang.mshh ORDER by soluong desc LIMIT 0, 10";
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