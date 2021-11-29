<?php

namespace quanly\php\db;

require_once "connection.php";

class TrangThaiDonHang{
    public $mstt;
    public $tentt;

    public function __construct($mstt, $tentt){
        $this->mstt = $mstt;
        $this->tentt = $tentt;
    }

    public static function timTatCa(){
        $conn = getConnection();
        $sql = "select * from trangthaidonhang";
        $result = $conn->query($sql);
        $arr = [];
        $count = 0;
        if($result->num_rows > 0){
            while ($row = $result->fetch_assoc()){
                $tt = new TrangThaiDonHang($row['mstt'], $row['tenTT']);
                $arr[$count] = json_encode($tt, 256);
                $count++;
            }
        }
        $result->close();
        $conn->close();
        return $arr;
    }
}