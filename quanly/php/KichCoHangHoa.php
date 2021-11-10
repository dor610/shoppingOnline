<?php

namespace quanly\php\db;

require_once 'connection.php';
class KichCoHangHoa{
    public $mskc;
    public $mshh;
    public $tenKichCo;
    public $soLuong;

    function __construct($mskc, $mshh, $tenKichCo, $soLuong){
        $this->mskc = $mskc;
        $this->mshh = $mshh;
        $this->tenKichCo = $tenKichCo;
        $this->soLuong = $soLuong;
    }

    static function getKichCoHangHoa($mshh){
        $conn = getConnection();
        $sql = "SELECT kichco.mskc, mshh, SoLuong, kichco.TenKichCo from kichcohanghoa JOIN kichco on kichcohanghoa.mskc = kichco.mskc WHERE mshh = '".$mshh."'";

        $result = $conn->query($sql);
        $arr = [];
        $count = 0;
        if($result->num_rows > 0){
            while ($row = $result->fetch_assoc()){
                $kichCo = new KichCoHangHoa($row['mskc'], $row['mshh'], $row['TenKichCo'], $row['SoLuong']);
                $arr[$count] = json_encode($kichCo, JSON_UNESCAPED_UNICODE);
                $count++;
            }
        }

        $result->close();
        $conn->close();
        return $arr;
    }

    public static function them($mskc, $mshh, $soLuong){
        $conn = getConnection();
        $sql = "insert into kichcohanghoa values('".$mskc."', '".$mshh."', ".$soLuong.")";

        $result = $conn->query($sql);
        $conn->close();
        return $result;
    }

    public static function getTongSoLuong($mshh){
        $conn = getConnection();

        $sql = "select sum(SoLuong) as tongsoluong from kichcohanghoa where mshh = '".$mshh."'";
        $result = 0;
        $row = $conn->query($sql);
        if($row->num_rows > 0){
            $result = $row->fetch_assoc()['tongsoluong'];
        }
        $conn->close();
        return $result;
    }

    public static function xoa($mskc, $mshh){
        $conn = getConnection();
        $sql = "delete from kichcohanghoa where mskc = '".$mskc."' and mshh = '".$mshh."'";
        $result = $conn->query($sql);
        $conn->close();
        return $result;
    }

    public static function xoaTatCa($mshh){
        $conn = getConnection();
        $sql = "delete from kichcohanghoa where  mshh = '".$mshh."'";
        $result = $conn->query($sql);
        $conn->close();
        return $result;
    }

    public static function capNhat($mskc, $mshh, $soLuong){
        $conn = getConnection();
        $sql = "update kichcohanghoa set soLuong = ".$soLuong." where mskc = '".$mskc."' and mshh = '".$mshh."'";
        $result = $conn->query($sql);
        $conn->close();
        return $result;

    }
}

