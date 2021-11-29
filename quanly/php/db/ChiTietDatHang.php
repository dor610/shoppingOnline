<?php

namespace quanly\php\db;

require_once "connection.php";

class ChiTietDatHang{
    public $soDonDh;
    public $mshh;
    public $mskc;
    public $soLuong;
    public $gia;

    public function __construct($soDonDh, $mshh, $mskc, $soLuong, $gia){
        $this->soDonDh = $soDonDh;
        $this->mshh = $mshh;
        $this->soLuong = $soLuong;
        $this->mskc = $mskc;
        $this->gia = $gia;
    }

    public static function tim($madh){
        $conn = getConnection();
        $sql = "select * from chitietdathang where SoDonHH = '{$madh}'";
        $result = $conn->query($sql);
        $arr = [];
        $count = 0;
        if($result->num_rows > 0){
            while ($row = $result->fetch_assoc()){
                $item = new ChiTietDatHang($row['SoDonHH'], $row['mshh'], $row['mskc'], $row['SoLuong'], $row['GiaDatHang']);
                $arr[$count] = json_encode($item, 256);
                $count++;
            }
        }

        $result->close();
        $conn->close();
        return $arr;
    }

}