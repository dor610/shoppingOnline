<?php
namespace quanly\php\db;
class DiaChiKH{

    public $madc;
    public $diaChi;
    public $mskh;

    public function __construct($madc, $diaChi, $mskh){
        $this->madc = $madc;
        $this->diaChi = $diaChi;
        $this->mskh = $mskh;
    }

    public static function them($madc, $diaChi, $mskh){
        $conn = getConnection();

        $sql = "insert into hinhhanghoa values ('".$madc."','".$diaChi."','".$mskh."')";

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

    public static function tim($madc){
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
}