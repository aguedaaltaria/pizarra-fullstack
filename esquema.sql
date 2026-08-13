-- crear la tabla donde guardaremos los usuarios
create table if not exists usuarios (
    id integer primary key autoincrement,
    nombre text not null,
    apellido text not null,
    correo text unique not null,
    rol text not null default 'usuario'
);

-- insertar datos de prueba iniciales
insert or ignore into usuarios (nombre, apellido, correo, rol)
values ('Agueda', 'Guzman', 'agueda@ejemplo.com', 'administrador');

insert or ignore into usuarios (nombre, apellido, correo, rol)
values ('Carlos', 'Chavez', 'carlos@ejemplo.com', 'usuario');