<?php

namespace quanly\php\db;

class ChiTietDatHang{
    public $soDonDh;
    public $mahh;
    public $soLuong;
    public $giaDatHang;
    public $giamGia;

    public function __construct($soDonDh, $mahh, $soLuong, $giaDatHang, $giamGia){
        $this->soDonDh = $soDonDh;
        $this->mahh = $mahh;
        $this->soLuong = $soLuong;
        $this->giaDatHang = $giaDatHang;
        $this->giamGia = $giamGia;
    }

}