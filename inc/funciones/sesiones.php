<?php

function usuarioAutenticado(){
    if (!revisarUsuario()) {
        header('Location:login.php');
        exit();
    }
}

function revisarUsuario(){
    return isset($_SESSION['usuario']);
}
session_start();
usuarioAutenticado();