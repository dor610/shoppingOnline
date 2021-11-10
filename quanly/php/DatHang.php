<?php

namespace quanly\php\db;

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

    }

    public static function timTatCa($mskh, $type){
        $conn = getConnection();
        $sql = "";
        if($type === "customerOrder"){
            $sql = "SELECT SoDonHH, ngayDH, ngayGH, msnv, thanhtoan, diachikh.DiaChi, trangthaidonhang.tenTT 
                    FROM dathang JOIN diachikh on dathang.madc = diachikh.madc 
                        JOIN trangthaidonhang ON dathang.trangthai = trangthaidonhang.mstt WHERE dathang.mskh = '".$mskh."'";
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

    public static function xoa($madh){
        $conn = getConnection();
        $sql = "delete from dathang where madh = '".$madh."'";
        ChiTietDatHang::xoaTatCa($madh);
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

}