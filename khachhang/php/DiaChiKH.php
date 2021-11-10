<?php
namespace khachhang\php\db;
require_once "connection.php";
class DiaChiKH{

    public $madc;
    public $diaChi;
    public $mskh;

    public function __construct($madc ,$diaChi, $mskh){
        $this->madc = $madc;
        $this->diaChi = $diaChi;
        $this->mskh = $mskh;
    }

    public static function them($madc, $diaChi, $mskh){
        $conn = getConnection();

        $sql = "insert into diachikh values ('".$madc."','".$diaChi."','".$mskh."')";

        $result = $conn->query($sql);

        $conn->close();
        return $result;
    }

    public static function xoa($madc){
        $conn = getConnection();

        $sql = "delete from diachikh where madc = '".$madc."'";

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

    public static function taomadc(){
        $conn = getConnection();
        $sql = "SELECT madc from diachikh ORDER by madc DESC LIMIT 1";
        $result = $conn->query($sql);

        if($result->num_rows > 0){
            $maxmadc = ($result->fetch_assoc())['madc'];
            $maxmadc = (intval($maxmadc) +1)."";
            if(strlen($maxmadc) === 1) $maxmadc = "0000".$maxmadc;
            else if(strlen($maxmadc) === 2) $maxmadc = "000".$maxmadc;
            else if(strlen($maxmadc) === 3) $maxmadc = "00".$maxmadc;
            else if(strlen($maxmadc) === 4) $maxmadc = "0".$maxmadc;

            return $maxmadc;
        }

        return "00000";
    }
}