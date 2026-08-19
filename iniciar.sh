#!/usr/bin/env bash

# Detener la ejecución si ocurre algún error inesperado
set -e

PUERTO=5000

echo "=========================================="
echo "   Iniciando Pizarra Fullstack 📋"
echo "=========================================="

# 1. Comprobar si el puerto está ocupado
echo "🔍 Verificando disponibilidad del puerto $PUERTO..."
PIDS_OCUPADOS=$(lsof -ti :$PUERTO || true)

if [ -n "$PIDS_OCUPADOS" ]; then
    echo "⚠️  El puerto $PUERTO ya está en uso. Intentando liberar proceso(s)..."
    echo "$PIDS_OCUPADOS" | xargs kill -9 2>/dev/null || true
    sleep 1
    echo "✅ Puerto $PUERTO liberado."
else
    echo "✅ Puerto $PUERTO libre."
fi

# 2. Verificar y activar entorno virtual con uv
if [ ! -d ".venv" ]; then
    echo "📦 Entorno virtual no detectado. Creando con uv..."
    uv venv
fi

echo "🔌 Activando entorno virtual..."
source .venv/bin/activate

# 3. Asegurar dependencias
echo "📥 Verificando dependencias..."
uv pip install -q flask

# 4. Verificar si existe la base de datos; si no, crearla
if [ ! -f "base_de_datos.db" ]; then
    echo "🗄️  Base de datos no encontrada. Inicializando desde esquema.sql..."
    python3 iniciar_bd.py
else
    echo "🗄️  Base de datos detectada."
fi

# 5. Iniciar la aplicación Flask
echo "🚀 Arrancando servidor en http://127.0.0.1:$PUERTO"
echo "=========================================="
python3 aplicacion.py