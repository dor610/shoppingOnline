<?php
namespace quanly\php\db;
require_once "connection.php";

class KichCo{
    public $mskc;
    public $tenKichCo;

    public function __construct($mskc, $tenKichCo){
        $this->mskc = $mskc;
        $this->tenKichCo = $tenKichCo;
    }

    public static function getAll(){
        $conn = getConnection();
        $sql = "select * from kichco";
        $result = $conn->query($sql);
        $arr = [];
        $count = 0;
       if($result->num_rows > 0){
           while ($row = $result->fetch_assoc()){
               $size = new KichCo($row["mskc"], $row["TenKichCo"]);
               $arr[$count] = json_encode($size, 256);
               $count++;
           }
       }

       return $arr;
    }

    public function add(){

    }
}