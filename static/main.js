const formulario = document.getElementById('formulario-usuario');
const cuerpoTabla = document.getElementById('cuerpo-tabla');
const contadorUsuarios = document.getElementById('contador-usuarios');
const botonVaciar = document.getElementById('boton-vaciar');

// GET
async function cargarUsuarios() {
    try {
        const respuesta = await fetch('/api/usuarios');
        if (!respuesta.ok) throw new Error(`Error: ${respuesta.status}`);

        const usuarios = await respuesta.json();
        cuerpoTabla.innerHTML = '';
        contadorUsuarios.textContent = `${usuarios.length} usuario${usuarios.length === 1 ? '' : 's'}`;

        if (usuarios.length === 0) {
            cuerpoTabla.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: var(--color-texto-suave);">
                        No hay usuarios registrados aún.
                    </td>
                </tr>
            `;
            return;
        }

        usuarios.forEach(usuario => {
            const fila = document.createElement('tr');
            let claseRol = 'rol-usuario';
            if (usuario.rol === 'administrador') claseRol = 'rol-admin';
            if (usuario.rol === 'editora') claseRol = 'rol-editor';

            fila.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nombre} ${usuario.apellido}</td>
                <td>${usuario.correo}</td>
                <td><span class="etiqueta-rol ${claseRol}">${usuario.rol}</span></td>
                <td>
                    <div class="contenedor-acciones">
                        <button class="boton-accion boton-editar" onclick="editarUsuario(${usuario.id}, '${usuario.nombre}', '${usuario.apellido}', '${usuario.correo}', '${usuario.rol}')">Editar</button>
                        <button class="boton-accion boton-eliminar" onclick="eliminarUsuario(${usuario.id})">Borrar</button>
                    </div>
                </td>
            `;
            cuerpoTabla.appendChild(fila);
        });

    } catch (error) {
        console.error('Error al obtener usuarios:', error);
    }
}

// POST
async function manejarEnvioFormulario(evento) {
    evento.preventDefault();   
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const rol = document.getElementById('rol').value;

    const nuevoUsuario = { nombre, apellido, correo, rol };

    try {
        const respuesta = await fetch('/api/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoUsuario)
        });
        const resultado = await respuesta.json();

        if (respuesta.ok) {
            formulario.reset();
            document.getElementById('nombre').focus();
            await cargarUsuarios();
        } else {
            alert(`Error: ${resultado.error || 'No se pudo registrar'}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor.');
    }
}

// DELETE
async function eliminarUsuario(id) {
    if (!confirm(`¿Estás segura de que deseas eliminar al usuario ID #${id}?`)) return;

    try {
        const respuesta = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
        if (respuesta.ok) {
            await cargarUsuarios();
        } else {
            const error = await respuesta.json();
            alert(`Error: ${error.error}`);
        }
    } catch (error) {
        console.error('Error al eliminar:', error);
    }
}

async function vaciarTabla() {
    if (!confirm('⚠️ ¿Estás segura de eliminar TODOS los usuarios de la base de datos?')) return;

    try {
        const respuesta = await fetch('/api/usuarios/todos', { method: 'DELETE' });
        if (respuesta.ok) {
            await cargarUsuarios();
        }
    } catch (error) {
        console.error('Error al vaciar tabla:', error);
    }
}


// PUT
async function editarUsuario(id, nombreActual, apellidoActual, correoActual, rolActual) {
    const nuevoNombre = prompt('Modificar Nombre:', nombreActual);
    if (nuevoNombre === null) return;

    const nuevoApellido = prompt('Modificar Apellido:', apellidoActual);
    if (nuevoApellido === null) return;

    const nuevoCorreo = prompt('Modificar Correo:', correoActual);
    if (nuevoCorreo === null) return;

    const datosActualizados = {
        nombre: nuevoNombre.trim(),
        apellido: nuevoApellido.trim(),
        correo: nuevoCorreo.trim(),
        rol: rolActual
    };

    try {
        const respuesta = await fetch(`/api/usuarios/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosActualizados)
        });

        if (respuesta.ok) {
            await cargarUsuarios();
        } else {
            const error = await respuesta.json();
            alert(`Error: ${error.error}`);
        }
    } catch (error) {
        console.error('Error al actualizar:', error);
    }
}

// Escuchadores
formulario.addEventListener('submit', manejarEnvioFormulario);
botonVaciar.addEventListener('click', vaciarTabla);
document.addEventListener('DOMContentLoaded', cargarUsuarios);