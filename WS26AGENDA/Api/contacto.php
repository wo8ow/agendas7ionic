<?php
    require_once('../Modelo/cls_conexion.php');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: PUT,GET, POST, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: origin, content-type, Authorization, Accept, X-Request-With, x-xsrf-token');
    header('Content-Type: application/json; charset=utf-8');

    $data = json_decode(file_get_contents("php://input"), true);
    
    $conex = new cls_conexion();
    $conex = $conex->conectar();

    if ($data['accion'] == "consultar") {
        $sentencia = sprintf("SELECT * from contacto where persona_cod_persona = '%s'", 
            mysqli_real_escape_string($conex, $data['cod_persona']));
        $rs = mysqli_query($conex, $sentencia);
        if (mysqli_num_rows($rs) > 0) {
            $datos = array();
            while ($row = mysqli_fetch_assoc($rs)) {
                $datos[] = array(
                    'codigo' => $row['cod_contacto'],
                    'nombre' => $row['nom_contacto'],
                    'apellido' => $row['ape_contacto'],
                    'telefono' => $row['telefono_contacto'],
                    // Validamos por si el campo correo se llama diferente en tu BD
                    'correo' => isset($row['correo_contacto']) ? $row['correo_contacto'] : '' 
                );
            }
            echo json_encode(array("estado" => true, "contactos" => $datos));
        } else {
            echo json_encode(array("estado" => false, "mensaje" => "No tiene contactos registrados"));
        }
    }
    // INSERTAR
    else if ($data['accion'] == "insertar") {
        $sentencia = sprintf("INSERT INTO contacto (nom_contacto, ape_contacto, telefono_contacto, persona_cod_persona) VALUES ('%s', '%s', '%s', '%s')",
            mysqli_real_escape_string($conex, $data['nombre']),
            mysqli_real_escape_string($conex, $data['apellido']),
            mysqli_real_escape_string($conex, $data['telefono']),
            mysqli_real_escape_string($conex, $data['cod_persona']));
            
        if(mysqli_query($conex, $sentencia)){
            echo json_encode(array("estado" => true, "mensaje" => "Contacto guardado correctamente"));
        } else {
            // Se agrega mysqli_error para depurar a nivel de arquitectura de BD
            echo json_encode(array("estado" => false, "mensaje" => "Error SQL: " . mysqli_error($conex)));
        }
    }
    // ACTUALIZAR
    else if ($data['accion'] == "actualizar") {
        $sentencia = sprintf("UPDATE contacto SET nom_contacto='%s', ape_contacto='%s', telefono_contacto='%s' WHERE cod_contacto='%s'",
            mysqli_real_escape_string($conex, $data['nombre']),
            mysqli_real_escape_string($conex, $data['apellido']),
            mysqli_real_escape_string($conex, $data['telefono']),
            mysqli_real_escape_string($conex, $data['cod_contacto']));
            
        if(mysqli_query($conex, $sentencia)){
            echo json_encode(array("estado" => true, "mensaje" => "Contacto actualizado"));
        } else {
            echo json_encode(array("estado" => false, "mensaje" => "Error SQL: " . mysqli_error($conex)));
        }
    }
    // 3. ELIMINAR
    else if ($data['accion'] == "eliminar") {
        $sentencia = sprintf("DELETE FROM contacto WHERE cod_contacto='%s'",
            mysqli_real_escape_string($conex, $data['cod_contacto']));
            
        if(mysqli_query($conex, $sentencia)){
            echo json_encode(array("estado" => true, "mensaje" => "Contacto eliminado"));
        } else {
            echo json_encode(array("estado" => false, "mensaje" => "Error al eliminar contacto"));
        }
    }
?>