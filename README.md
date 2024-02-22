# Food Manager
App para saber que comida tienes guardada y cuando vence. Te marca en rojo lo ya vencido para que lo cambies.

Se creo a partir de la template de expo-router con SDK 50, no tiene nada especial instalado, la UI utiliza los recursos nativos de React Native sin librerias adicionales

# Database
Como DB se utiliza supabase, la URL y el AnonKey deben existir como variables de entorno llamdas `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANONKEY`

Para usar Supabase recuerda que tienes que agregar las policies correspondientes en la base de datos, sino the devuelve [] (array vacio) aunque hayan datos en la tabla

Se supone que se guardan las env en el codigo fuente cuando se compile y que no deberia ser asi por seguridad, pero como es una aplicacion de prueba se deja asi