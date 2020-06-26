<?php

$accion= $_POST['accion'];
$password= $_POST['password'];
$usuario= $_POST['usuario'];

if ($accion==='crear') {
    //codigo para crear los administradores

    //hashear passwords
    $opciones=array(
        'cost'=>12
    );
    $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);

    //importar la conexion
    include '../funciones/conexion.php';

    try {
        //realizar la consulta a la base de datos
        $stmt= $db->prepare("INSERT INTO usuarios (usuario, password) VALUES(?,?)");
        $stmt->bind_param('ss', $usuario, $hash_password);
        $stmt->execute();

       if ($stmt->affected_rows > 0) {
           $respuesta= array(
               'respuesta'=> 'correcto',
               'id_insertado'=> $stmt->insert_id,
               'tipo'=> $accion
           );
       }else {
           $respuesta= array(
               'respuesta'=> 'error'
           );
       }
        $stmt->close();
        $db->close();

    } catch (Exeption $e) {
        //En caso de error tomar la exception
        $respuesta = array(
        'error'=> $e->getMessage()
    );
    }
    echo json_encode($respuesta);
    
   
}
if ($accion==='login') {
    //escribir codigo que loguee a los administradores
    include '../funciones/conexion.php';

    try {
        //Seleccionar el administrador de la base de datos
        $stmt= $db->prepare("SELECT * FROM usuarios WHERE usuario=? ");
        $stmt->bind_param('s', $usuario); 
        $stmt->execute();
        //loguear el resultado
        $stmt->bind_result($id_usuario, $nombre_usuario, $password_usuario);
        $stmt->fetch();
        if ($nombre_usuario) {
            //el usuario existe, verificar el password
            if (password_verify($password, $password_usuario)) {
                //iniciar sesion
                session_start();
                $_SESSION['usuario']= $nombre_usuario;
                $_SESSION['id']= $id_usuario;
                $_SESSION['login']=true;

                //login correcto
                $respuesta=array(
                    'respuesta'=> 'correcto',
                    'nombre'=> $nombre_usuario,
                    'tipo'=> $accion
                );
            }else{
                //login incorrecto, enviar error
                $respuesta=array(
                    'resultado'=> 'Password incorrecto',
                );
            }
            
        }else {
            $respuesta =array(
                'error'=>'Usuario no existe'
            );
        }
        
        

        $stmt->close();
        $db->close();

    } catch (Exception $e) {
         //En caso de error tomar la exception
         $respuesta = array(
            'pass'=> $e->getMessage()
        );
    }
    echo json_encode($respuesta);
}