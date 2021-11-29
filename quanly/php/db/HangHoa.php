<?php
namespace quanly\php\db;

require_once "connection.php";

class HangHoa{
    public $mshh;
    public $tenHh;
    public $moTa;
    public $gia;
    public $maLoaiHang;
    public $xoa;

    public function __construct($mshh, $tenHh, $moTa, $gia, $maLoaiHang, $xoa){
        $this->mshh = $mshh;
        $this->tenHh = $tenHh;
        $this->moTa = $moTa;
        $this->gia = $gia;
        $this->maLoaiHang = $maLoaiHang;
        $this->xoa = $xoa;
    }

    public static function them($newTenHh, $newMoTa, $newGia, $newMaLoaiHang){
        $conn = getConnection();

        $sql = $conn->prepare("insert into hanghoa values (?,?,?,?,?,?)");

        $sql->bind_param("sssss", $mshh, $tenHh, $moTa, $gia, $maLoaiHang, $xoa);
        $mshh = self::taoMshh();
        $tenHh = $newTenHh;
        $moTa = $newMoTa;
        $gia = $newGia;
        $maLoaiHang = $newMaLoaiHang;
        $xoa = "false";

        $result = $sql->execute();

        $sql->close();
        $conn->close();
        return $mshh;
    }

    public static function xoa($mshh){
        $conn = getConnection();

        $sql = "update hanghoa set xoa = 'true' where mshh = '".$mshh."'";

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
            $hanghoa = new HangHoa($row["mshh"], $row["Tenhh"], $row["MoTa"], $row["Gia"], $row["MaLoaiHang"], $row['Xoa']);
        }

        $conn->close();
        $result->close();
        return $hanghoa;
    }

    public static function layHangHoa($offset ,$soLuong){
        $conn = getConnection();
        $sql = "select * from hanghoa where Xoa = 'false' order by mshh DESC ";
        $sql = $sql."limit ".$offset.",".$soLuong;

        $result = $conn->query($sql);
        $arr = [];
        $count = 0;
        if($result->num_rows >0){
            while ($row = $result->fetch_assoc()){
                $hanghoa = new HangHoa($row["mshh"], $row["Tenhh"], $row["MoTa"], $row["Gia"], $row["MaLoaiHang"], $row["Xoa"]);
                $arr[$count] =json_encode( $hanghoa, JSON_UNESCAPED_UNICODE);
                $count++;
            }
        }

        $result->close();
        $conn->close();
        return $arr;
    }

    public static function timKiem($offset ,$soLuong, $keyWord){

        $hasShortWord = false;
        $keyWord = trim($keyWord, " ");
        $keyWordsArr = explode(" ", $keyWord);
        $searchString = '';
        for($count = 0; $count < count($keyWordsArr); $count++){
            if(strlen($keyWordsArr[$count]) < 3){
                $searchString = '';
                $hasShortWord = true;
                break;
            }
            $searchString = $searchString." +".$keyWordsArr[$count];
        }


        $arr = [];
        $count = 0;
        if($hasShortWord === true){
           $arr = self::timKiemLike($offset, $soLuong, $keyWordsArr);
        }else{
            $sql = "SELECT * FROM hanghoa WHERE MATCH(Tenhh) AGAINST('".$searchString."' IN BOOLEAN MODE) ";
            $conn = getConnection();
            $sql = $sql."limit ".$offset.",".$soLuong;
            $result = $conn->query($sql);
            if($result->num_rows >0){
                while ($row = $result->fetch_assoc()){
                    $hanghoa = new HangHoa($row["mshh"], $row["Tenhh"], $row["MoTa"], $row["Gia"], $row["MaLoaiHang"], $row["Xoa"]);
                    $arr[$count] =json_encode( $hanghoa, JSON_UNESCAPED_UNICODE);
                    $count++;
                }
            }

            $result->close();
            $conn->close();
        }

        return $arr;
    }

    public static function timKiemLike($offset, $soLuong, $keyWordsArr){
        $searchString = '';
        for($count = 0; $count < count($keyWordsArr); $count++){
            $searchString = $searchString."%".$keyWordsArr[$count]."%";
        }

        $sql = "SELECT * FROM hanghoa WHERE Tenhh LIKE '".$searchString."'";
        $arr = [];
        $count = 0;
        $conn = getConnection();
        $sql = $sql."limit ".$offset.",".$soLuong;
        $result = $conn->query($sql);
        if($result->num_rows >0) {
            while ($row = $result->fetch_assoc()) {
                $hanghoa = new HangHoa($row["mshh"], $row["Tenhh"], $row["MoTa"], $row["Gia"], $row["MaLoaiHang"], $row["Xoa"]);
                $arr[$count] = json_encode($hanghoa, JSON_UNESCAPED_UNICODE);
                $count++;
            }
        }

        $result->close();
        $conn->close();
        return $arr;
    }

    public static function timTatCa(){
        $conn = getConnection();

        $sql = "select * from hanghoa";

        $result = $conn->query($sql);
        $arr = [];
        if($result->num_rows > 0){
            while ($row = $result->fetch_assoc()){
                $hanghoa = new HangHoa($row["mshh"], $row["tenhh"], $row["gia"], $row["soluonghang"], $row["maloaihang"], $row["Xoa"]);
                $arr[$row["mshh"]] = $hanghoa;
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
            if($maxMshh< 10) $maxMshh = "0000".$maxMshh;
            else if($maxMshh < 100) $maxMshh = "000".$maxMshh;
            else if($maxMshh < 1000) $maxMshh = "00".$maxMshh;
            else if($maxMshh < 10000) $maxMshh = "0".$maxMshh;

            return $maxMshh;
        }

        return "00000";
    }

    public static function capNhat($mshh, $name, $price, $description, $maLoaiHang){
        $conn = getConnection();
        $sql = "update hanghoa set Tenhh = '".$name."', MoTa = '".$description."', Gia = '".$price."', MaLoaiHang = '".$maLoaiHang."' where mshh = '".$mshh."'";
        $result = $conn->query($sql);
        $conn->close();
        return $result;
    }

}
?>