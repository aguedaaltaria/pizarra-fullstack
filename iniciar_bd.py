import sqlite3

def inicializar_bd():
    conexion = sqlite3.connect('base_de_datos.db')
    with open('esquema.sql', 'r', encoding='utf-8') as archivo_sql:
        script = archivo_sql.read()
    conexion.executescript(script)
    conexion.commit()
    conexion.close()

    print("Base de datos 'base_de_datos.db' creada y poblada con exito!")

if __name__ == '__main__':
    inicializar_bd()