# DB_SERVER
Mongodb Server REST API

Para correr:
npm install
npm start
Se conectara al Servidor Mongo en un Host remoto (95.217.2.43) y escuchara en localhost por el puerto 5001 por peticiones con dos rutas:
search, que solicita una busqueda en la base de datos del documento enviado y espera un objeto contentivo de los parametros collection, que representa la coleccion del documento donde se buscaran los parametros de busqueda y search que representa el documento contentivo de los parametros de busqueda
