<?php

$accion= $_POST['accion'];
$id_proyecto=  (isset($_POST['id_proyecto'])) ?(int) $_POST['id_proyecto'] : '';
$tarea = (isset($_POST['tarea'])) ? $_POST['tarea'] : '';
$estado = (isset($_POST['estado'])) ? $_POST['estado'] : '';
$id_tarea = (isset($_POST['id'])) ?(int) $_POST['id'] : '';

if ($accion==='crear') {
    //codigo para crear los administradores


    //importar la conexion
    include '../funciones/conexion.php';

    try {
        //realizar la consulta a la base de datos
        $stmt= $db->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES(?,?)");
        $stmt->bind_param('si', $tarea, $id_proyecto);
        $stmt->execute();

       if ($stmt->affected_rows > 0) {
           $respuesta= array(
               'respuesta'=> 'correcto',
               'id_insertado'=> $stmt->insert_id,
               'tipo'=> $accion, 
               'tarea'=> $tarea
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

if($accion === 'actualizar'){

    //importar la conexion
    include '../funciones/conexion.php';

    try {
        //realizar la consulta a la base de datos
        $stmt= $db->prepare("UPDATE tareas set estado= ? WHERE id = ?");
        $stmt->bind_param('ii', $estado, $id_tarea);
        $stmt->execute();

       if ($stmt->affected_rows > 0) {
           $respuesta= array(
               'respuesta'=> 'correcto'
               
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

if($accion === 'eliminar'){

    //importar la conexion
    include '../funciones/conexion.php';

    try {
        //realizar la consulta a la base de datos
        $stmt= $db->prepare("DELETE from tareas WHERE id= ?");
        $stmt->bind_param('i', $id_tarea);
        $stmt->execute();

       if ($stmt->affected_rows > 0) {
           $respuesta= array(
               'respuesta'=> 'correcto'
               
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