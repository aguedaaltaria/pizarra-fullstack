from flask import Flask, jsonify, request, render_template
import sqlite3

aplicacion = Flask(__name__)

def obtener_conexion_bd():
    conexion = sqlite3.connect('base_de_datos.db')
    conexion.row_factory = sqlite3.Row
    return conexion

# GET
@aplicacion.route('/')
def inicio():
    return render_template('index.html')

@aplicacion.route('/api/usuarios', methods=['GET'])
def obtener_usuarios():
    conexion = obtener_conexion_bd()
    usuarios_filas = conexion.execute('select * from usuarios').fetchall()
    conexion.close()

    lista_usuarios = [dict(usuario) for usuario in usuarios_filas]

    return jsonify(lista_usuarios), 200 

# POST
@aplicacion.route('/api/usuarios', methods=['POST'])
def crear_usuario():
    datos = request.get_json()

    nombre = datos.get('nombre')
    apellido = datos.get('apellido')
    correo = datos.get('correo')
    rol = datos.get('rol', 'usuario')

    if not nombre or not apellido or not correo:
        return jsonify({'error': 'El nombre, apellido y correo son obligatorios'}), 400
    
    conexion = obtener_conexion_bd()
    cursor = conexion.cursor()
    try:
        cursor.execute(
            'insert into usuarios (nombre, apellido, correo, rol) values (?, ?, ?, ?)',
            (nombre, apellido, correo, rol)
        )
        conexion.commit()
        nuevo_id = cursor.lastrowid
        conexion.close()

        return jsonify({
            'id': nuevo_id,
            'nombre': nombre,
            'apellido': apellido,
            'correo': correo,
            'rol': rol
        }), 201
    except sqlite3.IntegrityError:
        conexion.close()
        return jsonify({'error': 'El correo electronico ya esta registrado'}), 400

# PUT 
@aplicacion.route('/api/usuarios/<int:id_usuario>', methods=['PUT'])
def actualizar_usuario(id_usuario):
    datos = request.get_json()

    nombre = datos.get('nombre')
    apellido = datos.get('apellido')
    correo = datos.get('correo')
    rol = datos.get('rol')

    if not nombre or not apellido or not correo:
        return jsonify({'error': 'Nombre, apellido y correo son obligatorios'}), 400

    conexion = obtener_conexion_bd()
    cursor = conexion.cursor()
    try:
        cursor.execute(
            '''UPDATE usuarios 
               SET nombre = ?, apellido = ?, correo = ?, rol = ? 
               WHERE id = ?''',
            (nombre, apellido, correo, rol, id_usuario)
        )
        conexion.commit()
        filas_afectadas = cursor.rowcount
        conexion.close()

        if filas_afectadas == 0:
            return jsonify({'error': 'Usuario no encontrado en la base de datos'}), 404

        return jsonify({'mensaje': 'Usuario actualizado con exito'}), 200

    except sqlite3.IntegrityError:
        conexion.close()
        return jsonify({'error': 'El correo ya pertenece a otro usuario'}), 400
    
# DELETE 
@aplicacion.route('/api/usuarios/<int:id_usuario>', methods=['DELETE'])
def eliminar_usuario(id_usuario):
    conexion = obtener_conexion_bd()
    cursor = conexion.cursor()
    cursor.execute('DELETE FROM usuarios WHERE id = ?', (id_usuario,))
    conexion.commit()
    filas_afectadas = cursor.rowcount
    conexion.close()

    if filas_afectadas == 0:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    return jsonify({'mensaje': f'Usuario {id_usuario} eliminado correctamente'}), 200

@aplicacion.route('/api/usuarios/todos', methods=['DELETE'])
def eliminar_todos_usuarios():
    conexion = obtener_conexion_bd()
    conexion.execute('DELETE FROM usuarios')
    conexion.commit()
    conexion.close()
    return jsonify({'mensaje': 'Todos los usuarios han sido eliminados'}), 200


if __name__ == '__main__':
    aplicacion.run(debug=True, port=5000)