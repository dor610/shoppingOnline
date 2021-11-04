<?php
namespace khachhang\php\db;
require_once "connection.php";
class DiaChiKH{

    public $maDc;
    public $diaChi;
    public $mskh;

    public function __construct($maDc ,$diaChi, $mskh){
        $this->maDc = $maDc;
        $this->diaChi = $diaChi;
        $this->mskh = $mskh;
    }

    public static function them($maDc, $diaChi, $mskh){
        $conn = getConnection();

        $sql = "insert into diachikh values ('".$maDc."','".$diaChi."','".$mskh."')";

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

    public static function tim($mskh){
        $conn = getConnection();

        $sql = "select * from diachikh where mskh = '".$mskh."'";

        $result = $conn->query($sql);

        if ($result->num_rows > 0){
            $row = $result->fetch_assoc();
            $diaChi = new DiaChiKH($row["madc"], $row["DiaChi"], $row["mskh"]);

            $result->close();;
            $conn->close();
            return $diaChi;
        }

        $result->close();
        $conn->close();
        return "";
    }

    public static function timTatCa($mskh){
        $conn = getConnection();

        $sql = "select * from diachikh where mskh = '".$mskh."'";

        $result = $conn->query($sql);
        $arr = [];
        $count = 0;
        if($result->num_rows > 0){
            while ($row = $result->fetch_assoc()){
                $diaChi = new DiaChiKH($row["madc"], $row["DiaChi"], $row["mskh"]);
                $arr[$count] = json_encode($diaChi, 256);
                $count++;
            }
        }
        $result->close();
        $conn->close();
        return $arr;
    }

    public static function capNhat(){

    }

    public static function taoMaDC(){
        $conn = getConnection();
        $sql = "SELECT madc from diachikh ORDER by madc DESC LIMIT 1";
        $result = $conn->query($sql);

        if($result->num_rows > 0){
            $maxMadc = ($result->fetch_assoc())['madc'];
            $maxMadc = (intval($maxMadc) +1)."";
            if(strlen($maxMadc)< 10) $maxMadc = "0000".$maxMadc;
            else if(strlen($maxMadc < 100)) $maxMadc = "000".$maxMadc;
            else if(strlen($maxMadc) < 1000) $maxMadc = "00".$maxMadc;
            else if(strlen($maxMadc) < 10000) $maxMadc = "0".$maxMadc;

            return $maxMadc;
        }

        return "00000";
    }
}