<?php
    require_once('../Modelo/cls_conexion.php');
    
    // 1. CONFIGURACIÓN DE CORS (Limpiada y unificada)
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization, x-xsrf-token");
    header('Content-Type: application/json; charset=utf-8');
    
    // 2. INTERCEPTAR PETICIÓN PREFLIGHT (OPTIONS) DE IONIC
    // Si la petición es OPTIONS, devolvemos código 200 y salimos, esto evita el error CORS
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit();
    }
    
    // 3. LECTURA DE DATOS
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data['accion'])) {
        echo json_encode(array("estado" => false, "mensaje" => "Acción no especificada"));
        exit;
    }

    // 1. LOGIN DE USUARIO
    if ($data['accion'] == "loggin") {
        $conex = (new Cls_conexion())->conectar();
        $sentencia = sprintf("SELECT cod_persona FROM persona WHERE ci_persona='%s' AND clave_persona='%s'",
            mysqli_real_escape_string($conex, $data['usuario']), 
            mysqli_real_escape_string($conex, $data['clave']));
            
        $rs = mysqli_query($conex, $sentencia);
        if (mysqli_num_rows($rs) > 0) {
            $row = mysqli_fetch_assoc($rs);
            echo json_encode(array("estado" => true, "codigo" => $row['cod_persona']));
        } else {
            echo json_encode(array("estado" => false, "mensaje" => "Usuario o contraseña incorrectos"));
        }
    }

    // 2. RECUPERAR LA PREGUNTA DE SEGURIDAD
    else if ($data['accion'] == "obtener_pregunta") {
        $conex = (new Cls_conexion())->conectar();
        $usuario = mysqli_real_escape_string($conex, $data['usuario']); // ci_persona
        $sentencia = "SELECT pregunta_seguridad FROM persona WHERE ci_persona='$usuario'";
        $rs = mysqli_query($conex, $sentencia);
        if (mysqli_num_rows($rs) > 0) {
            $row = mysqli_fetch_assoc($rs);
            if (!empty($row['pregunta_seguridad'])) {
                echo json_encode(array("estado" => true, "pregunta" => $row['pregunta_seguridad']));
            } else {
                echo json_encode(array("estado" => false, "mensaje" => "El usuario no tiene una pregunta de seguridad configurada"));
            }
        } else {
            echo json_encode(array("estado" => false, "mensaje" => "El usuario (Cédula) no existe"));
        }
    }

     // 3. CONSULTA (CORREGIDO ERROR SINTAXIS Y ECHO)
    else if ($data['accion'] == "consulta") {
        $conex = (new Cls_conexion())->conectar();
        
        // Corrección: Agregado el "sprintf" y "mysqli_real_escape_string" por seguridad
        $sentencia = sprintf("SELECT * FROM persona WHERE cod_persona='%s'", 
            mysqli_real_escape_string($conex, $data['cod_persona']));
            
        $rs = mysqli_query($conex, $sentencia);
        if (mysqli_num_rows($rs) > 0) {
            $row = mysqli_fetch_assoc($rs);
            $datos = array(
                // OJO: Cambié 'co_persona' a 'cod_persona', verifica cómo se llama exactamente en tu BD
                "codigo" => $row['cod_persona'],    
                "nombre" => $row['nom_persona'],
                "apellido" => $row['ape_persona'],
            );
            // Corrección: Cambiado a "echo" para que devuelva la respuesta al frontend
            echo json_encode(array("estado"=>true, "persona"=>$datos));
        }
        else{
            // Corrección: Cambiado a "echo"
            echo json_encode(array("estado"=>false, "mensaje"=>"No existe los datos de la persona"));
        }
    }

    // 4. VERIFICAR RESPUESTA Y CAMBIAR CONTRASEÑA
    else if ($data['accion'] == "restablecer_por_pregunta") {
        $conex = (new Cls_conexion())->conectar();
        $usuario = mysqli_real_escape_string($conex, $data['usuario']);
        $respuesta = mysqli_real_escape_string($conex, $data['respuesta']);
        $nueva_clave = mysqli_real_escape_string($conex, $data['nueva_clave']);
        
        // Usamos LOWER para que no afecten las mayúsculas/minúsculas al responder
        $sentencia = "SELECT cod_persona FROM persona WHERE ci_persona='$usuario' AND LOWER(respuesta_seguridad) = LOWER('$respuesta')";
        $rs = mysqli_query($conex, $sentencia);
        
        if (mysqli_num_rows($rs) > 0) {
            $update = "UPDATE persona SET clave_persona='$nueva_clave' WHERE ci_persona='$usuario'";
            if (mysqli_query($conex, $update)) {
                echo json_encode(array("estado" => true, "mensaje" => "Contraseña restablecida con éxito"));
            } else {
                echo json_encode(array("estado" => false, "mensaje" => "Error al actualizar la base de datos: " . mysqli_error($conex)));
            }
        } else {
            echo json_encode(array("estado" => false, "mensaje" => "La respuesta de seguridad es incorrecta"));
        }
    }
?>