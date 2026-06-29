<?php
require_once('../Config/config.php');
class cls_conexion {
    public $conexion;
    public function conectar() {
        $this->conexion = mysqli_connect(host, usuario, clave, db);
        if (!$this->conexion) {
            die(json_encode(array("estado" => false, "mensaje" => "Error de conexión")));
        }
        mysqli_set_charset($this->conexion, "utf8");
        return $this->conexion;
    }
}
?>