<?php
namespace quanly\php\db;

require_once "connection.php";

class LoaiHangHoa{
    public $maLoaiHang;
    public $tenLoaiHang;

    public function __construct($maLoaiHang, $tenLoaiHang){
        $this->maLoaiHang = $maLoaiHang;
        $this->tenLoaiHang = $tenLoaiHang;
    }

    public static function them($maLoaiHang, $tenLoaiHang){
        $conn = getConnection();

        $sql = "insert into loaihanghoa values ('".$maLoaiHang."','".$tenLoaiHang."')";

        $result = $conn->query($sql);

        $conn->close();
        return $result;
    }

    public static function xoa($maLoaiHang){
        $conn = getConnection();

        $sql = "delete from loaihanghoa where MaLoaiHang = '".$maLoaiHang."'";

        $result = $conn->query($sql);

        $conn->close();
        return $result;
    }

    public static function tim($maLoaiHang){
        $conn = getConnection();

        $sql = "select * from loaihanghoa where MaLoaiHang = '".$maLoaiHang."'";

        $result = $conn->query($sql);

        if ($result->num_rows > 0){
            $row = $result->fetch_assoc();
            $loaiHang = new LoaiHangHoa($row["MaLoaiHang"], $row["TenLoaiHang"]);

            $result->close();;
            $conn->close();
            return $loaiHang;
        }

        $result->close();
        $conn->close();
        return "";
    }

    public static function timTatCa(){
        $conn = getConnection();

        $sql = "select * from loaihanghoa";

        $result = $conn->query($sql);
        $arr = [];
        $count = 0;
        if($result->num_rows > 0){
            while ($row = $result->fetch_assoc()){
                $loaiHang = new LoaiHangHoa($row["MaLoaiHang"], $row["TenLoaiHang"]);
                $arr[$count] = json_encode($loaiHang, 256);
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
