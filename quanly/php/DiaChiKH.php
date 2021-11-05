<?php
namespace quanly\php\db;
class DiaChiKH{

    public $maDc;
    public $diaChi;
    public $mskh;

    public function __construct($maDc, $diaChi, $mskh){
        $this->maDc = $maDc;
        $this->diaChi = $diaChi;
        $this->mskh = $mskh;
    }

    public static function them($maDc, $diaChi, $mskh){
        $conn = getConnection();

        $sql = "insert into hinhhanghoa values ('".$maDc."','".$diaChi."','".$mskh."')";

        $result = $conn->query($sql);

        $conn->close();
        return $result;
    }

    public static function xoa($maDc){
        $conn = getConnection();

        $sql = "delete from diachikh where madc = '".$maDc."'";

        $result = $conn->query($sql);

        $conn->close();
        return $result;
    }

    public static function tim($maDc){
        $conn = getConnection();

        $sql = "select * from diachikh where madc = '".$maDc."'";

        $result = $conn->query($sql);

        if ($result->num_rows > 0){
            $row = $result->fetch_assoc();
            $diaChi = new DiaChiKH($row["madc"], $row["diachi"], $row["mskh"]);

            $result->close();;
            $conn->close();
            return $diaChi;
        }

        $result->close();
        $conn->close();
        return "";
    }

    public static function timTatCa(){
        $conn = getConnection();

        $sql = "select * from diachikh";

        $result = $conn->query($sql);
        $arr = array([]);
        if($result->num_rows > 0){
            while ($row = $result->fetch_assoc()){
                $diaChi = new DiaChiKH($row["madc"], $row["diachi"], $row["mskh"]);
                $arr[$row["mskh"]] = $diaChi;
            }
        }
        $result->close();
        $conn->close();
        return $arr;
    }

    public static function capNhat(){

    }
}