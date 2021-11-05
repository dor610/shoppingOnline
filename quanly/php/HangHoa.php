<?php
namespace quanly\php\db;
class HangHoa{
    public $mshh;
    public $tenHh;
    public $quyCach;
    public $gia;
    public $soLuongHang;
    public $maLoaiHang;

    public function __construct($mshh, $tenHh, $quyCach, $gia, $soLuongHang, $maLoaiHang){
        $this->mshh = $mshh;
        $this->tenHh = $tenHh;
        $this->quyCach = $quyCach;
        $this->gia = $gia;
        $this->soLuongHang = $soLuongHang;
        $this->maLoaiHang = $maLoaiHang;
    }

    public static function them($newMshh, $newTenHh, $newQuyCach, $newGia, $newSoLuongHang, $newMaLoaiHang){
        $conn = getConnection();

        $sql = $conn->prepare("insert into hanghoa values (?,?,?,?,?,?)");

        $sql->bind_param("sssss", $mshh, $tenHh, $quyCach, $gia, $soLuongHang, $maLoaiHang);
        $mshh = $newMshh;
        $tenHh = $newTenHh;
        $quyCach = $newQuyCach;
        $gia = $newGia;
        $soLuongHang = $newSoLuongHang;
        $maLoaiHang = $newMaLoaiHang;

        $result = $sql->execute();

        $sql->close();
        $conn->close();
        return $result;
    }

    public static function xoa($mshh){
        $conn = getConnection();

        $sql = "delete from hanghoa where mshh = '".$mshh."'";

        $result = $conn->query($sql);

        $conn->close();
        return $result;
    }

    public static function tim($mshh){
        $conn = getConnection();

        $sql = "select * from hanghoa where mshh ='".$mshh."'";

        $result = $conn->query($sql);
        $hanghoa = "";
        if($result->num_rows > 0){
            $row = $result->fetch_assoc();
            $hanghoa = new HangHoa($row["mshh"], $row["tenhh"], $row["quycach"], $row["gia"], $row["soluonghang"], $row["maloaihang"]);
        }

        $conn->close();
        $result->close();
        return $hanghoa;
    }

    public static function timTatCa(){
        $conn = getConnection();

        $sql = "select * from hanghoa";

        $result = $conn->query($sql);
        $arr = array([]);
        if($result->num_rows > 0){
            while ($row = $result->fetch_assoc()){
                $hanghoa = new HangHoa($row["mshh"], $row["tenhh"], $row["quycach"], $row["gia"], $row["soluonghang"], $row["maloaihang"]);
                $arr[$row["mshh"]] = $hanghoa;
            }
        }
        $result->close();
        $conn->close();
        return $arr;
    }

    public static function capNhat(){

    }

}
?>