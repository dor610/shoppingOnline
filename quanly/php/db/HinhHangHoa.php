<?php

namespace quanly\php\db;

class HinhHangHoa{

    public $maHinh;
    public $tenHinh;
    public $mshh;

    public function __construct($maHinh, $mshh, $tenHinh){
        $this->maHinh = $maHinh;
        $this->mshh = $mshh;
        $this->mshh = $tenHinh;
    }

    public static function them($maHinh, $mshh, $tenHinh){
        $conn = getConnection();

        $sql = "insert into hinhhanghoa values ('".$maHinh."','".$mshh."','".$tenHinh."')";

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

    public static function tim($maHinh){
        $conn = getConnection();

        $sql = "select * from hinhhanghoa where mahinh = '".$maHinh."'";

        $result = $conn->query($sql);

        if ($result->num_rows > 0){
            $row = $result->fetch_assoc();
            $hinh = new HinhHangHoa($row["mahinh"], $row["mshh"], $row["tenhinh"]);

            $result->close();;
            $conn->close();
            return $hinh;
        }

        $result->close();
        $conn->close();
        return "";
    }

    public static function timTatCa(){
        $conn = getConnection();

        $sql = "select * from hinhhanghoa";

        $result = $conn->query($sql);
        $arr = array([]);
        if($result->num_rows > 0){
            while ($row = $result->fetch_assoc()){
                $hinh = new HinhHangHoa($row["mahinh"], $row["mshh"], $row["tenhinh"]);
                $arr[$row["mskh"]] = $hinh;
            }
        }
        $result->close();
        $conn->close();
        return $arr;
    }

    public static function capNhat(){

    }
}