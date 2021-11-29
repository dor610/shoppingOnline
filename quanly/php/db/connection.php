<?php

    function getConnection(): mysqli
    {
        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbName = "quanlydathang";

        $conn = new mysqli($servername, $username, $password, $dbName);

        return $conn;
}

?>