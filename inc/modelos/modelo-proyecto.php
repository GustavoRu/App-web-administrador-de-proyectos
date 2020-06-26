<?php

$accion= $_POST['accion'];
$proyecto= $_POST['proyecto'];

if ($accion==='crear') {
    //codigo para crear los administradores


    //importar la conexion
    include '../funciones/conexion.php';

    try {
        //realizar la consulta a la base de datos
        $stmt= $db->prepare("INSERT INTO proyectos (nombre) VALUES(?)");
        $stmt->bind_param('s', $proyecto);
        $stmt->execute();

       if ($stmt->affected_rows > 0) {
           $respuesta= array(
               'respuesta'=> 'correcto',
               'id_insertado'=> $stmt->insert_id,
               'tipo'=> $accion, 
               'nombre_proyecto'=> $proyecto
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