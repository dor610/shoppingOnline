<?php

namespace quanly\php\db;

require_once "connection.php";

class NhanVien{

    public $msnv;
    public $chucVu;
    public $hoTenNV;
    public $diaChi;
    public $soDienThoai;
    public $xoa;

    public function __construct($msnv, $hoTenNV, $chucVu, $diaChi, $soDienThoai, $xoa){
        $this->msnv = $msnv;
        $this->hoTenNV = $hoTenNV;
        $this->chucVu = $chucVu;
        $this->diaChi = $diaChi;
        $this->soDienThoai = $soDienThoai;
        $this->xoa = $xoa;
    }

    public static function them($msnv, $hoTenNV, $chucVu, $diaChi, $soDienThoai){
        $conn = getConnection();

        $sql = $conn->prepare("insert into nhanvien values (?,?,?,?,?,?)");
        $sql->bind_param("ssssss", $nmsnv, $nhoTenNV, $nchucVu, $ndiaChi, $nsoDienThoai, $xoa);
        $nchucVu = $chucVu;
        $nmsnv = $msnv;
        $nhoTenNV = $hoTenNV;
        $ndiaChi = $diaChi;
        $nsoDienThoai = $soDienThoai;
        $xoa = 'false';

        $result = $sql->execute();

        $sql->close();
        $conn->close();
        return $result;
    }

    public static function xoa($msnv){
        $conn = getConnection();

        $sql = "update nhanvien set xoa = 'true' where msnv ='".$msnv."'";

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
            $nhanVien = new NhanVien($row["msnv"], $row["HoTenNV"],$row["ChucVu"], $row["DiaChi"], $row["SoDienThoai"], $row['xoa']);
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
        $count = 0;
        if($result->num_rows > 0){
            while ($row = $result->fetch_assoc()){
                $nhanVien = new NhanVien($row["msnv"], $row["HoTenNV"],$row["ChucVu"], $row["DiaChi"], $row["SoDienThoai"], $row['xoa']);
                $arr[$count] = json_encode($nhanVien, 256);
                $count++;
            }
        }
        $result->close();
        $conn->close();
        return $arr;
    }

    public static function timKiem($keyWord){
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
            $arr = self::timKiemLike($keyWordsArr);
        }else{
            $conn = getConnection();
            $sql = "SELECT * FROM nhanvien WHERE MATCH(HoTenNV) AGAINST('".$searchString."' IN BOOLEAN MODE) ";
            $result = $conn->query($sql);
            if($result->num_rows >0){
                while ($row = $result->fetch_assoc()){
                    $nhanVien = new NhanVien($row["msnv"], $row["HoTenNV"],$row["ChucVu"], $row["DiaChi"], $row["SoDienThoai"], $row['xoa']);
                    $arr[$count] = json_encode($nhanVien, 256);
                    $count++;
                }
            }else{
                $arr = self::timKiemLike($keyWordsArr);
            }

            $result->close();
            $conn->close();
        }
        return $arr;
    }

    public static function timKiemLike($keyWordsArr){
        $conn = getConnection();
        $searchString = "";
        for($count = 0; $count < count($keyWordsArr); $count++){
            $searchString = $searchString."%".$keyWordsArr[$count]."%";
        }
        $sql = "SELECT * FROM nhanvien WHERE HoTenNV LIKE '".$searchString."'";
        $result = $conn->query($sql);
        $arr = [];
        $count = 0;
        if($result->num_rows >0) {
            while ($row = $result->fetch_assoc()) {
                $nhanVien = new NhanVien($row["msnv"], $row["HoTenNV"],$row["ChucVu"], $row["DiaChi"], $row["SoDienThoai"], $row['xoa']);
                $arr[$count] = json_encode($nhanVien, 256);
                $count++;
            }
        }

        $result->close();
        $conn->close();
        return $arr;
    }

    public static function capNhat($msnv, $name, $position, $address, $phoneNumber){
        $conn = getConnection();
        $sql = "update nhanvien set HoTenNV = '$name', ChucVu = '$position', DiaChi = '$address', SoDienThoai = '$phoneNumber' where msnv = '$msnv'";
        $result = $conn->query($sql);
        $conn->close();
        return $result;
    }

}

//echo NhanVien::capNhat("dsfsd", "Nguyễn Văn A", "Nhân Viên", "dasdas dasdas đáasda", "0123456789");