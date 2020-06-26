<?php

$db= new mysqli('localhost', "root", "","uptask");

if ($db->connect_error) {
    echo $db->connect_error;
}
$db->set_charset('utf8'); 