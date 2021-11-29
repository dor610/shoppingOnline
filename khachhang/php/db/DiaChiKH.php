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

    public static function them($diaChi, $mskh){
        $conn = getConnection();
        $madc = DiaChiKH::taoMaDC();
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

    public static function timDiaChi($madc){
        $conn = getConnection();

        $sql = "select * from diachikh where madc = '".$madc."'";

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
            $madc = ($result->fetch_assoc())['madc'];
            $madc = (intval($madc) +1)."";
            $length = 10 - strlen($madc);
            if($length > 0){
                for($count = 0; $count < $length; $count ++){
                    $madc = "0".$madc;
                }
            }
            return $madc;
        }

        return "0000000001";
    }
}