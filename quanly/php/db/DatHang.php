<?php

namespace quanly\php\db;

class DatHang{
    public $soDonDh;
    public $mskh;
    public $msnv;
    public $ngayDh;
    public $ngayGh;
    public $trangThaiDh;

    public function __construct($soDonDh, $mskh, $msnv, $ngayDh, $ngayGh, $trangThaiDh){
        $this->soDonDh = $soDonDh;
        $this->mskh = $mskh;
        $this->msnv = $msnv;
        $this->ngayDh = $ngayDh;
        $this->ngayGh = $ngayGh;
        $this->trangThaiDh = $trangThaiDh;
    }

}