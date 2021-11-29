<?php

namespace khachhang\php\db;
require_once "connection.php";
class HinhHangHoa{

    public $maHinh;
    public $tenHinh;
    public $mshh;

    public function __construct($maHinh, $mshh, $tenHinh){
        $this->maHinh = $maHinh;
        $this->mshh = $mshh;
        $this->tenHinh = $tenHinh;
    }

    public static function them($maHinh, $mshh, $tenHinh){
        $conn = getConnection();
        $sql = "insert into hinhhanghoa values ('".$maHinh."','".$tenHinh."','".$mshh."')";

        $result = $conn->query($sql);

        $conn->close();
        return $result;
    }

    public static function xoa($maHinh){
        $conn = getConnection();

        $sql = "delete from hinhhanghoa where mahinh = '".$maHinh."'";

        $result = $conn->query($sql);

        $conn->close();
        return $result;
    }
    public static function xoaTatCa($mshh){
        $conn = getConnection();

        $sql = "delete from hinhhanghoa where mshh = '".$mshh."'";

        $result = $conn->query($sql);

        $conn->close();
        return $result;
    }

    public static function tim($mshh){
        $conn = getConnection();

        $sql = "select * from hinhhanghoa where mshh = '".$mshh."'";

        $result = $conn->query($sql);
        $hinh = '';
        if ($result->num_rows > 0){
            $row = $result->fetch_assoc();
            $hinh = new HinhHangHoa($row["mahinh"], $row["mshh"], $row["tenhinh"]);
        }

        $result->close();
        $conn->close();
        return $hinh;
    }

    public static function timTatCa($mshh){
        $conn = getConnection();

        $sql = "select * from hinhhanghoa where mshh = '".$mshh."'";

        $result = $conn->query($sql);
        $arr = [];
        $count = 0;

        if ($result->num_rows > 0){
            while ($row = $result->fetch_assoc()){
                $hinh = new HinhHangHoa($row["mahinh"], $row["mshh"], $row["tenhinh"]);
                $arr[$count] = json_encode($hinh, 256);
                $count++;
            }
        }

        $result->close();
        $conn->close();
        return $arr;
    }

    public static function taoMaHinh($mshh){
        $conn = getConnection();
        $sql = "SELECT mahinh FROM hinhhanghoa WHERE mahinh REGEXP '^".$mshh."+' ORDER BY mahinh DESC LIMIT 1";
        $result = $conn->query($sql);
        if($result->num_rows > 0){
            $maxMaHinh = ($result->fetch_assoc())['mahinh'];
            $maxMaHinh = substr($maxMaHinh, 5);
            $maxMaHinh = (intval($maxMaHinh) +1)."";
            return $mshh.$maxMaHinh;
        }

        return $mshh;
    }

}