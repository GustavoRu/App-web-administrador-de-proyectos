
eventListeners();
//lista de proyectos
let listaProyetos=document.querySelector('ul#proyectos');

function eventListeners() {
    //document ready
    document.addEventListener('DOMContentLoaded', function () {
        actualizarProgreso();
    })
    //boton para crear proyecto
    document.querySelector('#crear-proyecto').addEventListener('click', nuevoProyecto);
    //boton para una nueva tarea
    document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);

    //botones para las acciones de las tareas
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
    
}

function nuevoProyecto(e) {
    e.preventDefault();
    console.log('Presionaste');

    //crea un input para el nombre del proyecto
    let nuevoProyecto= document.createElement('li');
    nuevoProyecto.innerHTML= '<input type="text" id= "nuevo-proyecto">';
    listaProyetos.appendChild(nuevoProyecto);

    //seleccionar el id con el nuevo proyecto
    let inputNuevoProyecto = document.querySelector('#nuevo-proyecto');


    //al presionar enter crea el proyecto
    inputNuevoProyecto.addEventListener('keypress', function name(e) {
        let tecla = e.which || e.keyCode;

        if (tecla===13) {
            guardarProyectoDB(inputNuevoProyecto.value);
            //elimino el li del ul
            listaProyetos.removeChild(nuevoProyecto);
        }
    });
}

function guardarProyectoDB(nombreProyecto) {
    
    //crear llamado ajax
    let xhr= new XMLHttpRequest();

    //enviar datos por formData
    let datos= new FormData;
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');

    //abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);
    
    //Carga
    xhr.onload= function () {
        if (this.status===200) {
            //obtener datos de la respuesta
            let respuesta = JSON.parse(xhr.responseText),
            proyecto = respuesta.nombre_proyecto,
            id_proyecto= respuesta.id_insertado,
            tipo = respuesta.tipo, 
            resultado = respuesta.respuesta;

            if (resultado=== 'correcto') {
                //fue exitoso
                if (tipo==='crear') {
                    //se creo un nuevo proyecto
                    //inyectar en el html
                    let nuevoProyecto= document.createElement('li');
                    nuevoProyecto.innerHTML=`
                        <a href="index.php?id_proyecto=${id_proyecto}" id="${id_proyecto}">
                            ${proyecto}
                        </a>    
                    `;
                    //agregar al html
                    listaProyetos.appendChild(nuevoProyecto);

                    //enviar alerta
                    swal({
                        title: 'Proyecto Creado',
                        text: 'El proyecto:' + proyecto + 'se creo correctamente',
                        type: 'success'
                    })
                    .then(resultado=>{
                        //redireccionar a la nueva url
                        if (resultado.value) {
                            window.location.href = 'index.php?id_proyecto=' + id_proyecto; 
                        }
                    }

                    );
                    
                    
                }else{
                    // se actualizo o se elimino

                }

            }else{
                //hubo un error
                swal({
                    title: 'Error',
                    text: 'Hubo un error',
                    type: 'error'
                })
            }
        }
    }

    //enviar el request
    xhr.send(datos);
    
    
    
    console.log(nombreProyecto);
    //inyectar el html
    let nuevoProyecto= document.createElement('li');
    nuevoProyecto.innerHTML= `<a href="#">${nombreProyecto} </a> id="proyecto:${id_proyecto}"`;
    listaProyetos.appendChild(nuevoProyecto);
}

//agregar una nueva tarea al proyecto actual
function agregarTarea(e) {
    e.preventDefault();
    let nombreTarea= document.querySelector('.nombre-tarea').value;
    //validar que el campo tenga algo escrito
    if (nombreTarea==='') {
        swal({
            title: 'Error',
            text: 'Una tarea no puede ir vacia',
            type: 'error'
        })
    }else{
        //la tarea tiene algo, insertar en php

        //crear llamado a ajax
        let xhr = new XMLHttpRequest();

        //crear formData
        let datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

        //abrir la conexion
        xhr.open('POST', 'inc/modelos/modelos-tareas.php', true);

        //ejecutar y respuesta
        xhr.onload= function () {
            if(this.status===200){
                //todo correcto
                let respuesta = JSON.parse(xhr.responseText),
                resultado=respuesta.respuesta,
                tarea= respuesta.tarea,
                id_insertado= respuesta.id_insertado,
                tipo= respuesta.tipo;
                
                if (resultado==='correcto') {
                    //se agrego correctamente
                    if(tipo==='crear'){
                        //lanzar alerta
                        swal({
                            title: 'Tarea creada',
                            text: 'La tarea: ' + tarea + ' se creo correctamente',
                            type: 'success'
                        });

                        //seleccionar el parrafo con la lista vacia
                        let parrafoListaVacia = document.querySelectorAll('.lista-vacia');

                        if(parrafoListaVacia.length > 0){
                            document.querySelector('.lista-vacia').remove();
                        }

                        //contruir el template
                        let nuevaTarea = document.createElement('li');
                        //agregamos el id
                        nuevaTarea.id= 'tarea:'+id_insertado;

                        //nueva tare
                        nuevaTarea.classList.add('tarea');

                        //insertar en el html
                        nuevaTarea.innerHTML= `
                            <p> ${tarea} </p>
                            <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                        `;
                        //agregarlo al dom
                        let listaTareas = document.querySelector('.listado-pendientes ul');
                        listaTareas.appendChild(nuevaTarea);

                        //limpiar el formulario
                        document.querySelector('.agregar-tarea').reset();

                        //actualizar progreso 
                        actualizarProgreso();
                    }

                }else{
                    //hubo un error
                    swal({
                        title: 'Error',
                        text: 'Hubo un error', 
                        type: 'error'
                    })
                }
            }
        }

        //enviar la consulta
        xhr.send(datos);
    }
}

//cambia el estado de las tareas o las elimina
function accionesTareas(e) {
    e.preventDefault();
    if(e.target.classList.contains('fa-check-circle')) {
        if(e.target.classList.contains('completo')){
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        }else{
             e.target.classList.add('completo');
             cambiarEstadoTarea(e.target, 1);
        }
    }

    if(e.target.classList.contains('fa-trash')) {
        swal({
            title: 'Seguro(a)?',
            text: "Esta acción no se puede deshacer",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.value) {
                //borrar de la base de datos
                let tareaEliminar = e.target.parentElement.parentElement;

                eliminarTareaDB(tareaEliminar);
                //borrar del html
                console.log(tareaEliminar);
                tareaEliminar.remove();
                
                
              swal(
                'Eliminado!',
                'La tarea fue eliminada!.',
                'success'
              )
            }
          })
    }
}
//completa o descompleta una tarea
function cambiarEstadoTarea(tarea, estado){
    let idTarea = tarea.parentElement.parentElement.id.split(':');
    //crear llamado ajax
    let xhr = new XMLHttpRequest();

    //informacion 
    let datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);


    //abrir la conexion
    xhr.open('POST', 'inc/modelos/modelos-tareas.php', true);

    //on load
    xhr.onload = function () {
        if(this.status === 200){
            console.log(JSON.parse(xhr.responseText));
            //actualizar el progreso
            actualizarProgreso();
        }
    }

    //enviar la peticion
    xhr.send(datos);

}

//elimina la tarea de la base de datos
function eliminarTareaDB(tareaEliminar) {
    console.log(tareaEliminar);
    let idTarea = tareaEliminar.id.split(':');
    //crear llamado ajax
    let xhr = new XMLHttpRequest();

    //informacion 
    let datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');
    


    //abrir la conexion
    xhr.open('POST', 'inc/modelos/modelos-tareas.php', true);

    //on load
    xhr.onload = function () {
        if(this.status === 200){
            console.log(JSON.parse(xhr.responseText));

            //comprobar que haya tareas restantes
            let listaTareasRestantes = document.querySelectorAll('li.tarea');
            if(listaTareasRestantes.length === 0){
                document.querySelector('.listado-pendientes ul').innerHTML= "<p class='lista-vacia'> No hay tareas en este proyecto </p>";
            }
            //actualizar el progreso
            actualizarProgreso();
        }
    }

    //enviar la peticion
    xhr.send(datos);
}

//actualiza el avance del proyecto
function actualizarProgreso() {
    //obtener todas las tareas
    const tareas= document.querySelectorAll('li.tarea');
    //obtener las tareas completadas
    const tareasCompletadas = document.querySelectorAll('i.completo');

    //deterrminar el avance
    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);

    //asignar el avance a la barra
    const porcentaje= document.querySelector('#porcentaje');
    porcentaje.style.width = avance + '%';

    //mostrar una alerta al completar el 100%
    if(avance=== 100){
        swal({
            title: 'Proyecto terminado',
            text: 'Ya no tienes tareas pendientes!',
            type: 'success'
        });
    }
}    