<?php

namespace quanly\php\db;

require_once "connection.php";
class KhachHang{

    public $mskh;
    public $hoTenKh;
    public $email;
    public $soDienThoai;
    public $xoa;

    public function __construct($mskh, $hoTenKh, $soDienThoai, $email, $xoa){
        $this->mskh = $mskh;
        $this->hoTenKh = $hoTenKh;
        $this->soDienThoai = $soDienThoai;
        $this->email = $email;
        $this->xoa = $xoa;
    }

    public static function them($mskh, $hoTenKh, $soDienThoai, $email){
        $conn = getConnection();

        $sql = $conn->prepare("insert into khachhang values (?,?,?,?)");

        $sql->bind_param("sssss", $mskh, $hoTenKh, $soDienThoai, $email, $xoa);

        $xoa = 'false';
        $result = $sql->execute();

        $sql->close();
        $conn->close();
        return $result;
    }

    public static function xoa($mskh){
        $conn = getConnection();

        $sql = "update khachhang set xoa = 'true' where mskh = '".$mskh."'";

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
            $khachhang = new KhachHang($row["mskh"], $row["HoTenKH"], $row["SoDienThoai"], $row["email"], $row['xoa']);
        }

        $conn->close();
        $result->close();
        return $khachhang;
    }

    public static function timTatCa(){
        $conn = getConnection();

        $sql = "select * from khachhang";

        $result = $conn->query($sql);
        $arr = [];
        $count = 0;
        if($result->num_rows > 0){
            while ($row = $result->fetch_assoc()){
                $khachhang = new KhachHang($row["mskh"], $row["HoTenKH"], $row["SoDienThoai"], $row["email"], $row['xoa']);
                $arr[$count] = json_encode($khachhang, 256);
                $count++;
            }
        }
        $result->close();
        $conn->close();
        return $arr;
    }

    public static function timVoiOffset($offset, $soLuong){
        $conn = getConnection();
        $sql = "select * from khachhang order by mskh desc limit ".$offset.",".$soLuong;
        $result = $conn->query($sql);
        $arr = [];
        $count = 0;
        if($result->num_rows > 0){
            while ($row = $result->fetch_assoc()){
                $khachHang = new KhachHang($row['mskh'], $row["HoTenKH"], $row['SoDienThoai'], $row['email'], $row['xoa']);
                $arr[$count] = json_encode($khachHang, 256);
                $count++;
            }
        }
        $result->close();
        $conn->close();
        return $arr;
    }

    public static function timKiemFullText($offset, $soLuong, $keyWord){
        $hasShortWord = false;
        $keyWord = trim($keyWord, " ");
        $keyWordsArr = explode(" ", $keyWord);
        $searchString = '';
        for($count = 0; $count < count($keyWordsArr); $count++){
            if(strlen($keyWordsArr[$count]) < 3){
                $searchString = '';
                $hasShortWord = true;
                break;
            }
            $searchString = $searchString." +".$keyWordsArr[$count];
        }
        $arr = [];
        $count = 0;
        if($hasShortWord === true){
                $arr = self::timKiemLike($offset, $soLuong, $keyWordsArr);
        }else{
            $conn = getConnection();
            $sql = "SELECT * FROM khachhang WHERE MATCH(HoTenKH) AGAINST('".$searchString."' IN BOOLEAN MODE) ";
            $sql = $sql."limit ".$offset.",".$soLuong;
            $result = $conn->query($sql);
            if($result->num_rows >0){
                while ($row = $result->fetch_assoc()){
                    $khachHang = new KhachHang($row['mskh'], $row["HoTenKH"], $row['SoDienThoai'], $row['email'], $row['xoa']);
                    $arr[$count] = json_encode($khachHang, 256);
                    $count++;
                }
            }else{
                $arr = self::timKiemLike($offset, $soLuong, $keyWordsArr);
            }

            $result->close();
            $conn->close();
        }
        return $arr;
    }

    public static function timKiemLike($offset, $soLuong, $keyWordsArr){
        $conn = getConnection();
        $searchString = "";
        for($count = 0; $count < count($keyWordsArr); $count++){
            $searchString = $searchString."%".$keyWordsArr[$count]."%";
        }
        $sql = "SELECT * FROM khachhang WHERE HoTenKH LIKE '".$searchString."'";
        $sql = $sql."limit ".$offset.",".$soLuong;
        $result = $conn->query($sql);
        $arr = [];
        $count = 0;
        if($result->num_rows >0) {
            while ($row = $result->fetch_assoc()) {
                $khachHang = new KhachHang($row['mskh'], $row["HoTenKH"], $row['SoDienThoai'], $row['email'], $row['xoa']);
                $arr[$count] = json_encode($khachHang, 256);
                $count++;
            }
        }

        $result->close();
        $conn->close();
        return $arr;
    }
}