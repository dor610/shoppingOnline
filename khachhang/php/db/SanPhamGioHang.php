<?php
namespace khachhang\php\db;
require_once "connection.php";
class SanPhamGioHang{
    public $mshh;
    public $mskh;
    public $mskc;
    public $soLuong;

    public function __construct($mshh, $mskh, $mskc, $soLuong){
        $this->mshh = $mshh;
        $this->soLuong = $soLuong;
        $this->mskc = $mskc;
        $this->mskh =$mskh;
    }

    public static function them($newMshh, $newMskh, $newMskc, $newSoLuong){
        $conn = getConnection();
        $sql = $conn->prepare('insert into giohang values(?,?,?,?)');
        $sql->bind_param('sssi',$mskh, $mshh, $mskc, $soLuong);
        $mskh = $newMskh;
        $mskc = $newMskc;
        $mshh = $newMshh;
        $soLuong = $newSoLuong;


        $result = $sql->execute();
        $sql->close();
        $conn->close();
        return $result;
    }

    public static function xoa($mshh, $mskh, $mskc){
        $conn = getConnection();
        $sql = "delete from giohang where mshh = '".$mshh."' and mskh = '".$mskh."' and mskc = '".$mskc."'";

        $result = $conn->query($sql);

        $conn->close();
        return $result;
    }

    public static function tim($mshh, $mskh, $mskc){
        $conn = getConnection();
        $sql = "select SoLuong from giohang where mshh = '".$mshh."' and mskh = '".$mskh."' and mskc = '".$mskc."'";

        $result = $conn->query($sql);
        if($result->num_rows > 0){
            $row = $result->fetch_assoc();
            return  $row['SoLuong'];
        }else{
            return 0;
        }
    }

    public static function capNhatSoLuong($newMshh, $newMskh, $newMskc, $newSoLuong){
        $conn = getConnection();
        $sql = $conn->prepare('update giohang set SoLuong = ? where mshh = ? and mskh = ? and mskc = ?');
        $sql->bind_param('isss', $soLuong, $mshh, $mskh, $mskc);
        $soLuong = $newSoLuong;
        $mshh = $newMshh;
        $mskh = $newMskh;
        $mskc = $newMskc;

        $result = $sql->execute();
        $sql->close();
        $conn->close();
        return $result;
    }

    public static function layHangHoa($mskh){
        $conn = getConnection();
        $sql = "SELECT giohang.mskh, giohang.mshh, giohang.mskc, giohang.SoLuong, hanghoa.Gia, kichco.TenKichCo, 
                hanghoa.Tenhh from giohang JOIN hanghoa ON giohang.mshh = hanghoa.mshh JOIN kichco 
                on giohang.mskc = kichco.mskc where giohang.mskh = '".$mskh."'";

        $result = $conn->query($sql);
        $arr = array();
        $count = 0;
        if($result->num_rows > 0){
            while ($row = $result->fetch_assoc()){
                $arr[$count] = json_encode($row, 256);
                $count++;
            }
        }

        $result->close();
        $conn->close();
        return $arr;
    }

}