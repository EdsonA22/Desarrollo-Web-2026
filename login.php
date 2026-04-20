<?php
include("conexion.php");

$correo = $_POST['correo'];
$password = $_POST['password'];

$sql = "SELECT * FROM usuarios WHERE correo='$correo' AND password='$password'";
$resultado = $conexion->query($sql);

if ($resultado->num_rows > 0) {
    header("Location: index.html");
} else {
    echo "Correo o contraseña incorrectos";
}
?>