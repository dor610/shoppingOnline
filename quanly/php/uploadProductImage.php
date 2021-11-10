<?php
require_once "HinhHangHoa.php";

if(isset($_FILES["file"])){

    $mshh = $_POST['mshh'];
    $imgName = \quanly\php\db\HinhHangHoa::taoMaHinh($mshh);

    $maHinh = $imgName;

    \quanly\php\db\HinhHangHoa::them($maHinh ,$mshh, $imgName);

    $target_dir = "../../khachhang/img/product/";
    $target_file = $target_dir.$imgName.".png";
    move_uploaded_file($_FILES["file"]["tmp_name"], $target_file);
    echo true;
}else{
    echo false;
}
