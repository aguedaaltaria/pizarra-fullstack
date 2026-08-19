#!/usr/bin/env bash

echo "🧹 Limpiando archivos temporales..."

# Eliminar carpetas __pycache__ y archivos .pyc
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find . -type f -name "*.pyc" -delete 2>/dev/null || true

echo "✅ Caché de Python eliminada."

# Preguntar si se desea restablecer la base de datos
read -p "¿Deseas reiniciar la base de datos al estado inicial? (s/N): " RESPUESTA
if [[ "$RESPUESTA" =~ ^[sS]$ ]]; then
    rm -f base_de_datos.db
    python3 iniciar_bd.py
    echo "🔄 Base de datos reiniciada con éxito."
fi

echo "✨ Limpieza completada."