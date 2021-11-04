<?php

namespace khachhang\php\db;
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
        $sql = "SELECT kichco.mskc, mshh, SoLuong, kichco.TenKichCo from kichcohanghoa JOIN kichco on kichcohanghoa.mskc = kichco.mskc WHERE mshh = ".$mshh;

        $result = $conn->query($sql);
        $arr = Array([]);
        $count = 0;
        if($result->num_rows > 0){
            while ($row = $result->fetch_assoc()){
                $kichCo = new KichCoHangHoa($row['mskc'], $row['mshh'], $row['TenKichCo'], $row['SoLuong']);
                $arr[$count] = json_encode($kichCo, JSON_UNESCAPED_UNICODE);
                $count++;
            }
            $arr[$count] = 'true';
        }else{
            $arr[$count] = 'false';
        }

        $result->close();
        $conn->close();
        return $arr;
    }
}

