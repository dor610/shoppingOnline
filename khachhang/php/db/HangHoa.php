<?php
namespace khachhang\php\db;
require_once "connection.php";
class HangHoa{
    public $mshh;
    public $tenHh;
    public $moTa;
    public $gia;
    public $maLoaiHang;

    public function __construct($mshh, $tenHh, $moTa, $gia, $maLoaiHang){
        $this->mshh = $mshh;
        $this->tenHh = $tenHh;
        $this->moTa = $moTa;
        $this->gia = $gia;
        $this->maLoaiHang = $maLoaiHang;
    }

    public static function them($newMshh, $newTenHh, $newMoTa, $newGia, $newMaLoaiHang){
        $conn = getConnection();

        $sql = $conn->prepare("insert into hanghoa values (?,?,?,?,?,?)");

        $sql->bind_param("sssss", $mshh, $tenHh, $moTa, $gia, $maLoaiHang);
        $mshh = $newMshh;
        $tenHh = $newTenHh;
        $moTa = $newMoTa;
        $gia = $newGia;
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
            $hanghoa = new HangHoa($row["mshh"], $row["Tenhh"], $row["MoTa"], $row["Gia"], $row["MaLoaiHang"]);
        }

        $conn->close();
        $result->close();
        return $hanghoa;
    }

    public static function layHangHoa($offset ,$soLuong, $fill, $sort){
        $conn = getConnection();
        $sql = "select * from hanghoa ";
        $sql = match ($fill) {
            'nam' => $sql . "where MaLoaiHang REGEXP '^M.+' ",
            'aoNam' => $sql . "where MaLoaiHang REGEXP '^MS.+' ",
            'quanNam' => $sql . "where MaLoaiHang REGEXP '^MP.+' ",
            'nu' => $sql . "where MaLoaiHang REGEXP '^W.+' ",
            'aoNu' => $sql . "where MaLoaiHang REGEXP '^WS.+' ",
            'quanNu' => $sql . "where MaLoaiHang REGEXP '^WP.+' ",
            default => $sql."",
        };

        $sql = match ($sort) {
            'giaTang' => $sql . "order by Gia ",
            'giaGiam' => $sql . "order by Gia desc ",
            default => $sql . "order by mshh DESC ",
        };

        $sql = $sql."limit ".$offset.",".$soLuong;

        $result = $conn->query($sql);
        $arr = array([]);
        $count = 0;
        if($result->num_rows >0){
            while ($row = $result->fetch_assoc()){
                $hanghoa = new HangHoa($row["mshh"], $row["Tenhh"], $row["MoTa"], $row["Gia"], $row["MaLoaiHang"]);
                $arr[$count] =json_encode( $hanghoa, JSON_UNESCAPED_UNICODE);
                $count++;
            }
            $arr[$count] = "true";
        }else{
            $arr[$count] = "false";
        }

        $result->close();
        $conn->close();
        return $arr;
    }

    public static function timTatCa(){
        $conn = getConnection();

        $sql = "select * from hanghoa";

        $result = $conn->query($sql);
        $arr = null;
        if($result->num_rows > 0){
            $count = 0;
            while ($row = $result->fetch_assoc()){
                $hanghoa = new HangHoa($row["mshh"], $row["Tenhh"], $row["MoTa"], $row["Gia"], $row["MaLoaiHang"]);
                $arr[$count] = json_encode( $hanghoa, JSON_UNESCAPED_UNICODE);
                echo $arr[$count];
                $count++;
            }
        }
        $result->close();
        $conn->close();
        return $arr;
    }


    public static function taoMshh(){
        $conn = getConnection();
        $sql = "SELECT mshh from hanghoa ORDER by mshh DESC LIMIT 1";
        $result = $conn->query($sql);

        if($result->num_rows > 0){
            $maxMshh = ($result->fetch_assoc())['mshh'];
            $maxMshh = (intval($maxMshh) +1)."";
            if(strlen($maxMshh) === 1) $maxMshh = "0000".$maxMshh;
            else if(strlen($maxMshh) === 2) $maxMshh = "000".$maxMshh;
            else if(strlen($maxMshh) === 3) $maxMshh = "00".$maxMshh;
            else if(strlen($maxMshh) === 4) $maxMshh = "0".$maxMshh;

            return $maxMshh;
        }

        return "00000";
    }
    public static function timHinh($mshh){
        $conn = getConnection();
        $sql = "select tenhinh from hinhhanghoa where mshh = '".$mshh."'";

        $result = $conn->query($sql);
        if($result->num_rows > 0){
            $row = $result->fetch_assoc();
            return $row['tenhinh'];
        }

        return '';
    }
}
?>