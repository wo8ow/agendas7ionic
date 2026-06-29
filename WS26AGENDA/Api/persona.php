<?php
    require_once('../Modelo/cls_conexion.php');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: origin, content-type, Authorization, Accept, X-Request-With, x-xsrf-token');
    header('Content-Type: application/json; charset=utf-8');

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

    // 3. VERIFICAR RESPUESTA Y CAMBIAR CONTRASEÑA
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