<?php
namespace quanly\php\db;
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

        $sql = "delete from loaihanghoa where maloaihang = '".$maLoaiHang."'";

        $result = $conn->query($sql);

        $conn->close();
        return $result;
    }

    public static function tim($maLoaihang){
        $conn = getConnection();

        $sql = "select * from loaihanghoa where maloaihang = '".$maLoaihang."'";

        $result = $conn->query($sql);

        if ($result->num_rows > 0){
            $row = $result->fetch_assoc();
            $loaiHang = new LoaiHangHoa($row["maloaihang"], $row["tenhanghoa"]);

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
        $arr = array([]);
        if($result->num_rows > 0){
            while ($row = $result->fetch_assoc()){
                $loaiHang = new LoaiHangHoa($row["maloaihang"], $row["tenhanghoa"]);
                $arr[$row["mskh"]] = $loaiHang;
            }
        }
        $result->close();
        $conn->close();
        return $arr;
    }

    public static function capNhat(){

    }
}

