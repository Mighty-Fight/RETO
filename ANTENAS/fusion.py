import mysql.connector
from reader import R420
import time
import datetime
import re
from datetime import datetime

nombres_tags = {
    "ad89180010d68d8b39000080": "Kit 1",
    "ad89180010d6958b3a000081": "Kit 1",
    "ad89180010d6a98c39000083": "Kit 1",
    "ad89180010d8e58d3a0000c6": "Kit 1",
    "ad89180010d98188390000d7": "Kit 1",
    "ad89180010d4b98d38000049": "Kit 2",
    "ad89180010d67d8b3900007d": "Kit 2",
    "ad89180010d6858a3900007f": "Kit 2",
    "ad89180010d6878a3900007e": "Kit 2",
    "ad89180010d7318b39000093": "Kit 2",
    "ad89180010d6a1883a000082": "Kit 3",
    "ad89180010d6c58c39000085": "Kit 3",
    "ad89180010d6d38a35000088": "Kit 3",
    "ad89180010d705873900008e": "Kit 3",
    "ad89180010d97d903a0000d8": "Kit 3",
    "ad89180010d6c3873c000086": "Kit 4",
    "ad89180010d6cb8e38000087": "Kit 4",
    "ad89180010d6fd8e3a00008d": "Kit 4",
    "ad89180010d94d8f390000d1": "Kit 4",
    "ad89180010dad5893b000000": "Kit 4",
    "ad89180010d6dd8a36000089": "Kit 5",
    "ad89180010d6e58c3600008a": "Kit 5",
    "ad89180010d6f58f3600008b": "Kit 5",
    "ad89180010d6ff8c3600008c": "Kit 5",
    "ad89180010d9318f3a0000cf": "Kit 5",
    "ad89180010d65b8d3800007a": "Kit 6",
    "ad89180010d6638f3900007b": "Kit 6",
    "ad89180010d66d8c3a00007c": "Kit 6",
    "ad89180010d7398a39000094": "Kit 6",
    "ad89180010dacd8c3a0000ff": "Kit 6"
}


##################
#CONEXIÓN A LA DB#
##################

# conexion = mysql.connector.connect(user='admin', password='usuario123', host='db-retorfid.cdsc040qszy0.us-east-2.rds.amazonaws.com',
#                                   database='RETORFID', port='3306')

conexion = mysql.connector.connect(user='root', password='usuario123', host='localhost',
                                   database='RETORFID', port='3306')
cursor = conexion.cursor()

####################
#CREACIÓN DE TABLAS#
####################

# Definir la consulta SQL para crear la tabla de la estación 1
sql_create_table_estacion1 = """
CREATE TABLE IF NOT EXISTS Estación_1 (
ID INT AUTO_INCREMENT PRIMARY KEY,
Tag VARCHAR(25) NOT NULL,
Kit VARCHAR(25) DEFAULT NULL,
modo VARCHAR(25) DEFAULT NULL,
Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 1'
"""

sql_create_table_estacion2 = """
CREATE TABLE IF NOT EXISTS Estación_2 (
ID INT AUTO_INCREMENT PRIMARY KEY,
Tag VARCHAR(25) NOT NULL,
Kit VARCHAR(25) DEFAULT NULL,
modo VARCHAR(25) DEFAULT NULL,
Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 2'
"""

sql_create_table_estacion3 = """
CREATE TABLE IF NOT EXISTS Estación_3 (ID INT AUTO_INCREMENT PRIMARY KEY,
Tag VARCHAR(25) NOT NULL,
Kit VARCHAR(25) DEFAULT NULL,
modo VARCHAR(25) DEFAULT NULL,
Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 3'
"""

sql_create_table_estacion4 = """
CREATE TABLE IF NOT EXISTS Estación_4 (ID INT AUTO_INCREMENT PRIMARY KEY, 
Tag VARCHAR(25) NOT NULL,
Kit VARCHAR(25) DEFAULT NULL,
modo VARCHAR(25) DEFAULT NULL,
Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 4'
"""

sql_create_table_estacion5 = """
CREATE TABLE IF NOT EXISTS Estación_5 (ID INT AUTO_INCREMENT PRIMARY KEY,
Tag VARCHAR(25) NOT NULL,
Kit VARCHAR(25) DEFAULT NULL,
modo VARCHAR(25) DEFAULT NULL,
Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 5'
"""

sql_create_table_estacion6 = """
CREATE TABLE IF NOT EXISTS Estación_6 (ID INT AUTO_INCREMENT PRIMARY KEY, 
Tag VARCHAR(25) NOT NULL,
Kit VARCHAR(25) DEFAULT NULL,
modo VARCHAR(25) DEFAULT NULL,
Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 6'
"""

sql_create_table_estacion7 = """
CREATE TABLE IF NOT EXISTS Estación_7 (ID INT AUTO_INCREMENT PRIMARY KEY,
Tag VARCHAR(25) NOT NULL,
Kit VARCHAR(25) DEFAULT NULL,
modo VARCHAR(25) DEFAULT NULL,
Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 7'
"""

sql_create_table_Eventos = """
CREATE TABLE IF NOT EXISTS Eventos (
id INT AUTO_INCREMENT,
usuario VARCHAR(100) DEFAULT NULL,
evento VARCHAR(100) DEFAULT NULL,
descripcion VARCHAR(100) DEFAULT NULL,
fecha VARCHAR(100) DEFAULT NULL,
hora VARCHAR(100) DEFAULT NULL,
PRIMARY KEY (id)
) COMMENT 'Base de datos de los Eventos'
"""

sql_create_table_datos = """
CREATE TABLE IF NOT EXISTS Datos (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  Tag VARCHAR(25) UNIQUE,
  Nombre TEXT,
  Bahia INT NOT NULL,
  Cantidad INT NOT NULL, 
  Hora_entrada_lab TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Hora_salida_lab TIMESTAMP DEFAULT NULL,
  Hora_entrada_bodega TIMESTAMP DEFAULT NULL,
  Hora_salida_bodega TIMESTAMP DEFAULT NULL,
  INV ENUM('SI', 'NO') NOT NULL DEFAULT 'NO' 
) COMMENT 'Base de datos de los tags'
"""

sql_create_table_contabilidad_kits = """
CREATE TABLE IF NOT EXISTS Contabilidad_Kits (
  Kit VARCHAR(25) NOT NULL,
  Cantidad INT NOT NULL,
  PRIMARY KEY (Kit)
) COMMENT 'Contabilidad de los kits'
"""

sql_create_table_dropeo = """
CREATE TABLE IF NOT EXISTS dropeo (
  id INT AUTO_INCREMENT,
  dropp VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT 'tabla de solicitud';
"""

sql_insert_first_row_if_empty = """
INSERT INTO dropeo (dropp)
SELECT ''
WHERE NOT EXISTS (SELECT 1 FROM dropeo);
"""

cursor.execute(sql_create_table_estacion1)
conexion.commit()

cursor.execute(sql_create_table_estacion2)
conexion.commit()

cursor.execute(sql_create_table_estacion3)
conexion.commit()

cursor.execute(sql_create_table_estacion4)
conexion.commit()

cursor.execute(sql_create_table_estacion5)
conexion.commit()

cursor.execute(sql_create_table_estacion6)
conexion.commit()

cursor.execute(sql_create_table_estacion7)
conexion.commit()

cursor.execute(sql_create_table_Eventos)
conexion.commit()

cursor.execute(sql_create_table_dropeo)
conexion.commit()

cursor.execute(sql_insert_first_row_if_empty)
conexion.commit()

cursor.execute(sql_create_table_datos)
conexion.commit()

cursor.execute(sql_create_table_contabilidad_kits)
conexion.commit()

###################
#NO SÉ QUE HACE XD#
###################

# Verificar si la tabla de contabilidad está vacía
cursor.execute("SELECT COUNT(*) FROM Contabilidad_Kits")
num_rows = cursor.fetchone()[0]
if num_rows == 0:
    # Definir los valores predeterminados para la tabla de contabilidad de kits
    valores_contabilidad_kits = [
        ("Kit 1", 0),
        ("Kit 2", 0),
        ("Kit 3", 0),
        ("No registrado", 0)
    ]
    # Insertar los valores predeterminados en la tabla de contabilidad de kits
    cursor.executemany("INSERT INTO Contabilidad_Kits (Kit, Cantidad) VALUES (%s, %s)", valores_contabilidad_kits)

# Confirmar los cambios en la base de datos
conexion.commit()

try:
    # Intenta agregar la columna sin la condición IF NOT EXISTS
    cursor.execute("""
    ALTER TABLE Datos
    ADD COLUMN Hora_entrada_bodega TIMESTAMP DEFAULT NULL
    """)
    conexion.commit()
except mysql.connector.Error as err:
    # Captura el error si la columna ya existe
    if err.errno == 1060:  # Error 1060 es 'Duplicate column name'
        print("La columna 'Hora_entrada_bodega' ya existe.")
    else:
        raise  # Propaga otros errores que no sean específicos de columna duplicada


try:
    cursor.execute("""
    ALTER TABLE Datos
    ADD COLUMN Hora_salida_bodega TIMESTAMP DEFAULT NULL
    """)
    conexion.commit()
except mysql.connector.Error as err:
    if err.errno == 1060:  # Error 1060 es 'Duplicate column name'
        print("La columna 'Hora_salida_bodega' ya existe.")
    else:
        raise

###########
#FUNCIONES#
###########

def obtener_hora_actual():
    return time.strftime('%Y-%m-%d %H:%M:%S')

def decrementar_lista(lista_ceros, index):
    print("Valor actual en lista_ceros[index]:", lista_ceros[index])
    print("Tipo de lista_ceros[index]:", type(lista_ceros[index]))
    #lista_ceros = [int(elemento) for elemento in lista_ceros]
    if not isinstance(lista_ceros[index], int):
        raise TypeError(f"Se esperaba un entero en el índice {index}, pero se encontró {type(lista_ceros[index])}")
    lista_ceros[index] -= int(1)
    lista_ceros = [int(elemento) for elemento in lista_ceros]
    return lista_ceros[index]

def def_time(fecha_hora_1, fecha_hora_2):
    # Convertir las cadenas de texto a objetos datetime
    datetime_1 = datetime.strptime(str(fecha_hora_1), '%Y-%m-%d %H:%M:%S')
    datetime_2 = datetime.strptime(str(fecha_hora_2), '%Y-%m-%d %H:%M:%S')

    # Calcular la diferencia
    diferencia = datetime_2 - datetime_1

    # Obtener horas, minutos y segundos de la diferencia
    total_segundos = int(diferencia.total_seconds())
    horas = total_segundos // 3600
    minutos = (total_segundos % 3600) // 60
    segundos = total_segundos % 60

    # Retornar la diferencia en una sola variable
    return f"{horas}h :{minutos}m : {segundos}s"

ultima_deteccion_bodega = {}

def tiempo_suficiente_ultima_deteccion(tag_id, tiempo_actual):
    if tag_id not in ultima_deteccion_bodega:
        return True
    ultima_deteccion = ultima_deteccion_bodega[tag_id]
    diferencia = tiempo_actual - ultima_deteccion
    return diferencia.total_seconds() > 10  # Retardo de 10 segundos

def extract_number_from_string(drop_kit):

    match = re.search(r'\d+', str(drop_kit))
    if match:
        return match.group(0)
    else:
        return None
    
def rellenar_lista(lista, max_ceros):
    # Si la lista está vacía, devolver una lista con un solo cero
    if not lista:
        return [0]
    
    # La primera posición de la lista es cero
    lista[0] = 0
    
    # Rellenar el resto de la lista con el valor max_ceros
    for i in range(1, len(lista)):
        lista[i] = max_ceros
    
    return lista

def rellenar_con_hora(lista):
    if not lista:
        return [0]
    hora_actual = time.strftime('%Y-%m-%d %H:%M:%S')
    for i in range(1, len(lista)):
        lista[i] = hora_actual
    
    return lista

#############################
#INICIALIZACIÓN DE VARIABLES#
#############################

durationn=0.1
max_cero=4
    
####################
#CREACIÓN DE LISTAS#
####################

tags_detectados_IN = []
tags_detectados_OUT = []
tags_detectados_RACK= []
antena_1 = []


cursor.execute("SELECT Tag FROM Estación_1")
E_1 = cursor.fetchall()
cursor.execute("SELECT Tag FROM Estación_2")
E_2 = cursor.fetchall()
cursor.execute("SELECT Tag FROM Estación_3")
E_3 = cursor.fetchall()
cursor.execute("SELECT Tag FROM Estación_4")
E_4 = cursor.fetchall()
cursor.execute("SELECT Tag FROM Estación_5")
E_5 = cursor.fetchall()
cursor.execute("SELECT Tag FROM Estación_6")
E_6 = cursor.fetchall()
cursor.execute("SELECT Tag FROM Estación_7")
E_7 = cursor.fetchall()


lista_ceros_1 = rellenar_lista(list(range(len(E_1)+1)), max_cero)
lista_ceros_2 = rellenar_lista(list(range(len(E_2)+1)), max_cero)
lista_ceros_3 = rellenar_lista(list(range(len(E_3)+1)), max_cero)
lista_ceros_4 = rellenar_lista(list(range(len(E_4)+1)), max_cero)
lista_ceros_5 = rellenar_lista(list(range(len(E_5)+1)), max_cero)
lista_ceros_6 = rellenar_lista(list(range(len(E_6)+1)), max_cero)
lista_ceros_7 = rellenar_lista(list(range(len(E_7)+1)), max_cero)
lista_hora_1 = rellenar_con_hora(list(range(len(E_1)+1)))
lista_hora_2 = rellenar_con_hora(list(range(len(E_2)+1)))
lista_hora_3 = rellenar_con_hora(list(range(len(E_3)+1)))
lista_hora_4 = rellenar_con_hora(list(range(len(E_4)+1)))
lista_hora_5 = rellenar_con_hora(list(range(len(E_5)+1)))
lista_hora_6 = rellenar_con_hora(list(range(len(E_6)+1)))
lista_hora_7 = rellenar_con_hora(list(range(len(E_7)+1)))

###############
#LECTORES RFID#
############### 

reader_2 = R420('192.168.0.20')
reader_1 = R420('192.168.0.21')
reader_IN = R420('192.168.0.44')
reader_OUT = R420('192.168.0.42')
#reader_RACK = R420('192.168.0.20')


while True:

# # # # # # # # # #
# P O R T A L E S #
# # # # # # # # # #

    # Detectar tags con el lector RFID de entrada
    try:
        tags_IN = reader_IN.detectTags(powerDBm=reader_IN.power_table[35], freqMHz=reader_IN.freq_table[0], mode=1001, session=2, population=1, duration=durationn, searchmode=2)
        for tag_IN in tags_IN:
            tag_id_IN = tag_IN['EPC-96'].decode('utf-8')
            nombre_IN = nombres_tags.get(tag_id_IN, "No registrado")
            hora_actual = obtener_hora_actual()
            cursor.execute("SELECT * FROM Datos WHERE Tag = %s", (tag_id_IN,))
            resultado = cursor.fetchone()
            if resultado:
                # Si la tag ya existe y tiene registrada una hora de salida, significa que está reingresando.
                if resultado[6] is not None:  # Asumiendo que el índice 6 es Hora_salida_lab
                    # Resetear las horas relevantes y actualizar la entrada
                    cursor.execute("""
                    UPDATE Datos 
                    SET ID = "1",
                        Nombre = "Kit 1",
                        Cantidad = Cantidad, 
                        Hora_entrada_lab = %s, 
                        Hora_salida_lab = NULL, 
                        Hora_entrada_bodega = NULL 
                    WHERE Tag = %s""", (hora_actual, tag_id_IN))
                    print(f"Tag '{tag_id_IN}' ha reingresado y sus tiempos han sido reseteados.")
                else:
                    # Si la hora de salida es NULL, es un error lógico, pues no debería detectarse entrada sin salida.
                    print(f"Error: Tag '{tag_id_IN}' detectado en entrada sin registro de salida.")
            else:
                # Insertar la tag como nueva entrada si no existe previamente en la base de datos
                cursor.execute("INSERT INTO Datos (Tag, nombre, Bahia, Cantidad, Hora_entrada_lab) VALUES (%s, %s, 0, 1, %s)", (tag_id_IN, "Kit 1", hora_actual))
                print(f"Nueva tag '{tag_id_IN}' registrada en entrada.")
                conexion.commit()
    except Exception as e:
        print("ERROR!")
        
    



    # Detectar tags con el lector RFID de salida
    try:
        tags_OUT = reader_OUT.detectTags(powerDBm=reader_OUT.power_table[35], freqMHz=reader_OUT.freq_table[0], mode=1001, session=2, population=1, duration=durationn, searchmode=2)
        for tag_OUT in tags_OUT:
            tag_id_OUT = tag_OUT['EPC-96'].decode('utf-8')
            print("Tag detectado en entrada:", tag_id_OUT)
            # Verificar si el tag ya ha sido detectado antes
            if tag_id_OUT not in tags_detectados_OUT:
                tags_detectados_OUT.append(tag_id_OUT)
                # Definir el nombre basado en el diccionario
                nombre_OUT = nombres_tags.get(tag_id_OUT, "No registrado")
                # Definir los valores para la inserción en la tabla de datos
                valores_datos_OUT = (tag_id_OUT, 1)
                try:
                    # Verificar si el tag ya está en la base de datos
                    cursor.execute("SELECT * FROM Datos WHERE Tag = %s", (tag_id_OUT,))
                    if cursor.fetchone():  # El tag ya existe, actualizar el nombre
                        cursor.execute("UPDATE Datos SET Nombre = %s WHERE Tag = %s", ("", tag_id_OUT))
                    else:  # El tag no existe, insertarlo CAMBIOOOOOOOOOOOOO 
                        fecha, hora = obtener_hora_actual().split(' ')
                        cursor.execute("UPDATE Datos SET Hora_salida_lab = %s WHERE Tag = %s", (hora, tag_id_OUT))
                        conexion.commit()        


                    # Actualizar la contabilidad de kits
                    cursor.execute("UPDATE Contabilidad_Kits SET Cantidad = Cantidad - 1 WHERE Kit = %s", (nombre_OUT,))
                    # Confirmar los cambios en la base de datos
                    conexion.commit()
                    print(f"Tag '{tag_id_OUT}' insertado/actualizado en la base de datos con nombre '{nombre_OUT}' (entrada).")
                except mysql.connector.Error as err:
                    if err.errno == 1062:  # Error de clave duplicada
                        print(f"El tag '{tag_id_OUT}' ya existe en la base de datos.")
                        # Aquí puedes decidir qué hacer en caso de un tag duplicado,
                        # como actualizar el registro existente o ignorarlo.
                    else:
                        print("Error al insertar/actualizar el tag (entrada):", err)  
    except Exception as e:
        print("ERROR!")
    
    # try:        
    #     tags_RACK = reader_RACK.detectTags(powerDBm=reader_RACK.power_table[35], freqMHz=reader_RACK.freq_table[0], mode=1001, session=2, population=1, duration=durationn, searchmode=2)
    #     for tag_RACK in tags_RACK:
    #         tag_id_RACK = tag_RACK['EPC-96'].decode('utf-8')
    #         tiempo_actual = datetime.datetime.now()
    #         print("Tag detectado en bodega:", tag_id_RACK)
            
    #         if tiempo_suficiente_ultima_deteccion(tag_id_RACK, tiempo_actual):
    #             cursor.execute("SELECT Hora_entrada_bodega, Hora_salida_bodega FROM Datos WHERE Tag = %s", (tag_id_RACK,))
    #             tag_info = cursor.fetchone()
                
    #             if tag_info:
    #                 if tag_info[0] is not None and tag_info[1] is None:  # Hora de entrada y salida bodega
    #                     cursor.execute("UPDATE Datos SET Hora_salida_bodega = %s WHERE Tag = %s", (obtener_hora_actual(), tag_id_RACK))
    #                     print(f"Tag '{tag_id_RACK}' hora de salida de la bodega registrada.")
    #                 elif tag_info[0] is None:
    #                     cursor.execute("UPDATE Datos SET Hora_entrada_bodega = %s WHERE Tag = %s", (obtener_hora_actual(), tag_id_RACK))
    #                     print(f"Tag '{tag_id_RACK}' hora de entrada a la bodega registrada.")
    #             else:
    #                 print(f"Tag '{tag_id_RACK}' no registrado en la base de datos.")
    #             ultima_deteccion_bodega[tag_id_RACK] = tiempo_actual
    #         else:
    #             print(f"Tag '{tag_id_RACK}' detectado nuevamente demasiado pronto; no se actualiza la salida.")
    #         conexion.commit()
    # except Exception as e:
    #     print("ERROR!") 

        

    try:
        for tag_OUT in tags_OUT:
            tag_id_OUT = tag_OUT['EPC-96'].decode('utf-8')
            if tag_id_OUT in tags_detectados_OUT:
                cursor.execute("SELECT Hora_entrada_lab FROM datos WHERE Tag = %s", (tag_id_OUT,))
                try:
                    if cursor.fetchone() is not None:
                        cursor.execute("UPDATE Datos SET Hora_salida_lab = %s WHERE Tag = %s", (obtener_hora_actual(), tag_id_OUT))
                        conexion.commit()
                        fecha, hora = obtener_hora_actual().split(' ')
                        cursor.execute("SELECT Hora_entrada_lab FROM datos WHERE Tag = %s", (tag_id_OUT,))
                        hora_entrada = cursor.fetchone()[0]
                        cursor.execute("SELECT Hora_salida_lab FROM datos WHERE Tag = %s", (tag_id_OUT,))
                        hora_salida = cursor.fetchone()[0]
                        cursor.execute("SELECT ID FROM datos WHERE Tag = %s", (tag_id_OUT,))
                        idd=cursor.fetchone()[0]
                        descripcion= def_time(hora_entrada,obtener_hora_actual())
                        cursor.execute("INSERT INTO Eventos (usuario, evento, descripcion, fecha, hora) VALUES (%s, %s, %s, %s, %s)",
                                    ("Portales", "SALIDA", "Tiempo en el lab: " + descripcion + " | ID: "+str(idd), fecha, hora))  
                        cursor.execute("DELETE FROM datos WHERE Tag = %s", (tag_id_OUT,))
                        #print("-1 fila estacion1")
                        conexion.commit()
                except Exception as e:
                    print(f"lol2: {e}")
    except Exception as e:
        print("ERROR!")

    ############
    # Verifica cuántos registros cumplirían con la condición antes de la actualización a 'SI'

    cursor.execute("""
        SELECT Nombre FROM Datos
        WHERE Hora_entrada_bodega IS NOT NULL AND Hora_salida_bodega IS NULL AND INV = 'NO'
    """)
    resultado = cursor.fetchone()
    cursor.fetchall()
    print("resultado", resultado)

    try:
        if resultado:
            
            nombre_dropp = resultado[0]
            nombre_dropp = extract_number_from_string(nombre_dropp)
            cursor.execute("SELECT dropp FROM dropeo")
            rows = cursor.fetchone()  # Obtener todos los resultados de la consulta
            
            drops_registrados = [registro[0] for registro in cursor.fetchall()]
            #cursor.fetchall()

            try:

                # Verificar si el valor ya existe en la tabla 'dropeo'
                cursor.execute("SELECT COUNT(*) FROM dropeo WHERE dropp = %s", (nombre_dropp,))
                count = cursor.fetchone()
                if count is not None:
                    count = count[0]
                else:
                    count = 0
            
            except Exception as e:
                print(f"lol1: {e}")

                
            print("nombre_dropp= ", nombre_dropp)
            print("drops_registrados= ", drops_registrados)

            # Evitar resultados no leídos
            cursor.fetchall()

            if nombre_dropp in drops_registrados:  # Si el valor no existe, insertarlo
                print(f"El valor '{nombre_dropp}' ya existe en la tabla 'dropeo'. No se ha insertado nuevamente.")
            else:
                cursor.execute("INSERT INTO dropeo (dropp) VALUES (%s)", (nombre_dropp,))
                print("el valor se registro en dropp existosamente")
                conexion.commit()
                
                primer_si_detectado = True
            

            
            # Verificar si hay registros para actualizar a 'SI'
            cursor.execute("""
                SELECT COUNT(*) FROM Datos
                WHERE Hora_entrada_bodega IS NOT NULL AND Hora_salida_bodega IS NULL
            """)

            count = cursor.fetchone()
            try:
                if count is not None:
                    count = count[0]
                else:
                    count = 0  
                print(count)
            
            except Exception as e:
                print(f"lol2: {e}")
        else:
            count = 0
    
    except Exception as e:
        print("ERROR!")

    try:
        if count > 0:
            cursor.execute("""
                UPDATE Datos
                SET INV = 'SI'
                WHERE Hora_entrada_bodega IS NOT NULL AND Hora_salida_bodega IS NULL
            """)
            conexion.commit()        
    except Exception as e:
        print("ERROR!")

    # Ahora verifica cuántos registros deberían ser actualizados a 'NO'
    cursor.execute("""
        SELECT COUNT(*) FROM Datos
        WHERE Hora_entrada_bodega IS NOT NULL AND Hora_salida_bodega IS NOT NULL
    """)
    count_no = cursor.fetchone()[0]

    try:
        # Si count_no es mayor que 0, realiza la actualización a 'NO'
        if count_no > 0:
            cursor.execute("""
                UPDATE Datos
                SET INV = 'NO'
                WHERE Hora_entrada_bodega IS NOT NULL AND Hora_salida_bodega IS NOT NULL
            """)
            conexion.commit()
            print("INV actualizado a 'NO' para registros con salida de bodega.")
    except Exception as e:
        print("ERROR!")

# # # # # # # # # # # #
# E S T A C I O N E S #
# # # # # # # # # # # #

############
#ESTACIÓN_1#
############

    Lector_1 = reader_1.detectTags(powerDBm=reader_1.power_table[35], freqMHz=reader_1.freq_table[0], mode=1002, session=2, population=1, duration=0.25, searchmode=2)
    tags_detectados = [tag['EPC-96'].decode('utf-8') for tag in Lector_1 if tag['AntennaID'] == 1]
    cursor.execute("SELECT Tag FROM Estación_1")
    tags_registrados = [registro[0] for registro in cursor.fetchall()]
    # cursor.execute("SELECT modo FROM Estación_1 ORDER BY id DESC LIMIT 1")
    # modo = cursor.fetchone()[0]
    Estación=1

    #if modo == "lectura":
    try:
        
        for tag_registrado in tags_registrados: #REGISTRO HORA DE SALIDA
            cursor.execute("SELECT Tag FROM Estación_1")
            tags_registrados = [registro[0] for registro in cursor.fetchall()] #TAGS INCLUIDOS DENTRO DE LA TABLA DE LA ESTACIÓN 1
            index=tags_registrados.index(tag_registrado)+1
            print("index= ",index)
            print("lista_ceros: ",lista_ceros_1)
            print("lista_hora: ", lista_hora_1)
            # print(lista_ceros_1[index])
            ultimo_cero_1=False
            if tag_registrado not in tags_detectados and lista_ceros_1[index]==0: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
                try:
                    print("tercer cero")
                    # print(index)
                    cursor.execute("SELECT Hora_entrada FROM Estación_1 WHERE Tag = %s", (tag_registrado,))
                    hora_entrada = cursor.fetchone()[0]
                    fecha, hora = lista_hora_1[index].split(' ')
                    descripcion= def_time(hora_entrada,lista_hora_1[index])
                    cursor.execute(
                        "INSERT INTO Eventos (usuario, evento, descripcion, fecha, hora) VALUES (%s, %s, %s, %s, %s)",
                        ("Estación: " + str(Estación), "Kit Armado", "Tiempo de armado: " + descripcion, fecha, hora)
                    )

                    ultimo_cero_1=True
                    
                    #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
                except mysql.connector.Error as err:
                    print("Error al actualizar la hora de salida en la tabla de la Estación 1:", err) 
            if tag_registrado not in tags_detectados and lista_ceros_1[index]!=0 and lista_ceros_1[index]!=max_cero:
                print("segundo cero")
                lista_ceros_1[index]=decrementar_lista(lista_ceros_1,index)
            
            if tag_registrado not in tags_detectados and lista_ceros_1[index]==max_cero: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
                try:
                    print("primer cero")
                    #cursor.execute("INSERT INTO fechas (ID, Hora_salida, Estación) VALUES (%s, %s, %s)", (str(tag_registrado), obtener_hora_actual(), int(Estación)))
                    lista_hora_1[index]=(str(obtener_hora_actual()))
                    lista_ceros_1[index]=decrementar_lista(lista_ceros_1,index)
                    #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
                except mysql.connector.Error as err:
                    print("Error al actualizar la hora de salida en la tabla de la Estación 1:", err) 

            if lista_ceros_1[index]==0 and ultimo_cero_1==True:
                lista_ceros_1.pop(index)
                lista_hora_1.pop(index)
                cursor.execute("DELETE FROM Estación_1 WHERE Tag = %s", (tag_registrado,))
                #print("-1 fila estacion1")
                conexion.commit()

            if tag_registrado in tags_detectados:
                lista_ceros_1[index]=int(max_cero)

            ultimo_cero_1=False
        
        for tag_1 in Lector_1: #REGISTRO HORA DE ENTRADA
            
            if tag_1['AntennaID'] == 1:
                tags = tag_1['EPC-96'].decode('utf-8')
                # Asignación de nombre
                nombre_tag_1 = nombres_tags.get(tags, "No registrado")
                
                # Verificar si el tag ya está presente en la tabla de la Estación 1
                cursor.execute("SELECT Tag FROM Estación_1 WHERE Tag = %s", (tags,))
                resultado = cursor.fetchone()
                
                if resultado is None:
                    # El tag no está presente en la tabla, entonces se inserta
                    try:
                        #id_kit = (list(nombres_tags.keys())).index(tags) % 5 + 1
                        # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
                        print(obtener_hora_actual())
                        cursor.execute("INSERT INTO Estación_1 (Tag, Hora_entrada) VALUES (%s, %s)", (tags, obtener_hora_actual()))
                        conexion.commit()
                        lista_ceros_1.append(int(max_cero))
                        lista_hora_1.append(0)
                        #print(f"Tag '{tags}' insertado en la tabla de la Estación 1 con nombre '{nombre_tag_1}' y hora de entrada registrada.")
                    except mysql.connector.Error as err:
                        print("Error al insertar el tag en la tabla de la Estación 1:", err)
    except Exception as e:
        print("ERROR!")

############
#ESTACIÓN_2#
############

    tags_detectados2 = [tag['EPC-96'].decode('utf-8') for tag in Lector_1 if tag['AntennaID'] == 9]
    cursor.execute("SELECT Tag FROM Estación_2")
    tags_registrados2 = [registro[0] for registro in cursor.fetchall()]

    Estación=2
    try:
        for tag_registrado in tags_registrados2: #REGISTRO HORA DE SALIDA
            cursor.execute("SELECT Tag FROM Estación_2")
            tags_registrados2 = [registro[0] for registro in cursor.fetchall()] #TAGS INCLUIDOS DENTRO DE LA TABLA DE LA ESTACIÓN 1
            index=tags_registrados2.index(tag_registrado)+1
            print("index= ",index)
            print("lista_ceros: ",lista_ceros_2)
            print("lista_hora: ", lista_hora_2)
            # print(lista_ceros_2[index])
            ultimo_cero_2=False
            if tag_registrado not in tags_detectados2 and lista_ceros_2[index]==0: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
                try:
                    print("tercer cero")
                    # print(index)
                    cursor.execute("SELECT Hora_entrada FROM Estación_2 WHERE Tag = %s", (tag_registrado,))
                    hora_entrada = cursor.fetchone()[0]
                    fecha, hora = lista_hora_2[index].split(' ')
                    descripcion= def_time(hora_entrada,lista_hora_2[index])
                    cursor.execute(
                            "INSERT INTO Eventos (usuario, evento, descripcion, fecha, hora) VALUES (%s, %s, %s, %s, %s)",
                            ("Estación: " + str(Estación), "Kit armado", "Tiempo de armado: " + descripcion, fecha, hora))
                    ultimo_cero_2=True
                    
                    #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
                except mysql.connector.Error as err:
                    print("Error al actualizar la hora de salida en la tabla de la Estación 2:", err) 

            if tag_registrado not in tags_detectados2 and lista_ceros_2[index]!=0 and lista_ceros_2[index]!=max_cero:
                print("segundo cero")
                lista_ceros_2[index]=decrementar_lista(lista_ceros_2,index)
            
            if tag_registrado not in tags_detectados2 and lista_ceros_2[index]==max_cero: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
                try:
                    print("primer cero")
                    #cursor.execute("INSERT INTO fechas (ID, Hora_salida, Estación) VALUES (%s, %s, %s)", (str(tag_registrado), obtener_hora_actual(), int(Estación)))
                    lista_hora_2[index]=(str(obtener_hora_actual()))
                    lista_ceros_2[index]=decrementar_lista(lista_ceros_2,index)
                    #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
                except mysql.connector.Error as err:
                    print("Error al actualizar la hora de salida en la tabla de la Estación 2:", err) 

            if lista_ceros_2[index]==0 and ultimo_cero_2==True:
                lista_ceros_2.pop(index)
                lista_hora_2.pop(index)
                cursor.execute("DELETE FROM Estación_2 WHERE Tag = %s", (tag_registrado,))
                #print("-1 fila estacion1")
                conexion.commit()

            if tag_registrado in tags_detectados2:
                lista_ceros_2[index]=int(max_cero)

            ultimo_cero_2=False

        for tag_1 in Lector_1: #REGISTRO HORA DE ENTRADA
            
            if tag_1['AntennaID'] == 9:
                tags = tag_1['EPC-96'].decode('utf-8')
                # Asignación de nombre
                nombre_tag_2 = nombres_tags.get(tags, "No registrado")
                
                # Verificar si el tag ya está presente en la tabla de la Estación 1
                cursor.execute("SELECT Tag FROM Estación_2 WHERE Tag = %s", (tags,))
                resultado = cursor.fetchone()
                
                if resultado is None:
                    # El tag no está presente en la tabla, entonces se inserta
                    try:
                        # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
                        print(obtener_hora_actual())
                        cursor.execute("INSERT INTO Estación_2 (Tag, Kit, Hora_entrada) VALUES (%s, %s, %s)", (tags, nombre_tag_2, obtener_hora_actual()))
                        conexion.commit()
                        lista_ceros_2.append(int(max_cero))
                        lista_hora_2.append(0)
                        #print(f"Tag '{tags}' insertado en la tabla de la Estación 1 con nombre '{nombre_tag_2}' y hora de entrada registrada.")
                    except mysql.connector.Error as err:
                        print("Error al insertar el tag en la tabla de la Estación 2:", err)
    except Exception as e:
        print("ERROR!")

############
#ESTACIÓN_3#
############

    tags_detectados_3 = [tag['EPC-96'].decode('utf-8') for tag in Lector_1 if tag['AntennaID'] == 17]
    cursor.execute("SELECT Tag FROM Estación_3")
    tags_registrados3 = [registro[0] for registro in cursor.fetchall()]

    Estación=3
    try:
        for tag_registrado in tags_registrados3: #REGISTRO HORA DE SALIDA
            cursor.execute("SELECT Tag FROM Estación_3")
            tags_registrados3 = [registro[0] for registro in cursor.fetchall()] #TAGS INCLUIDOS DENTRO DE LA TABLA DE LA ESTACIÓN 1
            index=tags_registrados3.index(tag_registrado)+1
            print("index= ",index)
            print("lista_ceros: ",lista_ceros_3)
            print("lista_hora: ", lista_hora_3)
            # print(lista_ceros_3[index])
            ultimo_cero_3=False
            if tag_registrado not in tags_detectados_3 and lista_ceros_3[index]==0: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
                try:
                    print("tercer cero")
                    # print(index)
                    cursor.execute("SELECT Hora_entrada FROM Estación_3 WHERE Tag = %s", (tag_registrado,))
                    hora_entrada = cursor.fetchone()[0]
                    fecha, hora = lista_hora_3[index].split(' ')
                    descripcion= def_time(hora_entrada,lista_hora_3[index])
                    cursor.execute(
                            "INSERT INTO Eventos (usuario, evento, descripcion, fecha, hora) VALUES (%s, %s, %s, %s, %s)",
                            ("Estación: " + str(Estación), "Kit armado", "Tiempo de armado: " + descripcion, fecha, hora))

                    ultimo_cero_3=True
                    
                    #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
                except mysql.connector.Error as err:
                    print("Error al actualizar la hora de salida en la tabla de la Estación 3:", err) 

            if tag_registrado not in tags_detectados_3 and lista_ceros_3[index]!=0 and lista_ceros_3[index]!=max_cero:
                print("segundo cero")
                lista_ceros_3[index]=decrementar_lista(lista_ceros_3,index)
            
            if tag_registrado not in tags_detectados_3 and lista_ceros_3[index]==max_cero: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
                try:
                    print("primer cero")
                    #cursor.execute("INSERT INTO fechas (ID, Hora_salida, Estación) VALUES (%s, %s, %s)", (str(tag_registrado), obtener_hora_actual(), int(Estación)))
                    lista_hora_3[index]=(str(obtener_hora_actual()))
                    lista_ceros_3[index]=decrementar_lista(lista_ceros_3,index)
                    #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
                except mysql.connector.Error as err:
                    print("Error al actualizar la hora de salida en la tabla de la Estación 3:", err) 

            if lista_ceros_3[index]==0 and ultimo_cero_3==True:
                lista_ceros_3.pop(index)
                lista_hora_3.pop(index)
                cursor.execute("DELETE FROM Estación_3 WHERE Tag = %s", (tag_registrado,))
                #print("-1 fila estacion1")
                conexion.commit()

            if tag_registrado in tags_detectados_3:
                lista_ceros_3[index]=int(max_cero)

            ultimo_cero_3=False

        for tag_1 in Lector_1: #REGISTRO HORA DE ENTRADA
            
            if tag_1['AntennaID'] == 17:
                tags = tag_1['EPC-96'].decode('utf-8')
                # Asignación de nombre
                nombre_tag_3 = nombres_tags.get(tags, "No registrado")
                
                # Verificar si el tag ya está presente en la tabla de la Estación 1
                cursor.execute("SELECT Tag FROM Estación_3 WHERE Tag = %s", (tags,))
                resultado = cursor.fetchone()
                
                if resultado is None:
                    # El tag no está presente en la tabla, entonces se inserta
                    try:
                        # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
                        print(obtener_hora_actual())
                        cursor.execute("INSERT INTO Estación_3 (Tag, Kit, Hora_entrada) VALUES (%s, %s, %s)", (tags, nombre_tag_3, obtener_hora_actual()))
                        conexion.commit()
                        lista_ceros_3.append(int(max_cero))
                        lista_hora_3.append(0)
                        #print(f"Tag '{tags}' insertado en la tabla de la Estación 1 con nombre '{nombre_tag_3}' y hora de entrada registrada.")
                    except mysql.connector.Error as err:
                        print("Error al insertar el tag en la tabla de la Estación 3:", err)
    except Exception as e:
        print("ERROR!")


############
#ESTACIÓN_4#
############

    Lector_2 = reader_2.detectTags(powerDBm=reader_2.power_table[35], freqMHz=reader_2.freq_table[0], mode=1002, session=2, population=1, duration=durationn, searchmode=2)
    print(Lector_2)
    tags_detectados_4 = [tag['EPC-96'].decode('utf-8') for tag in Lector_2 if tag['AntennaID'] == 1]
    cursor.execute("SELECT Tag FROM Estación_4")
    tags_registrados_4 = [registro[0] for registro in cursor.fetchall()]


    Estación=4
    try:
        for tag_registrado in tags_registrados_4: #REGISTRO HORA DE SALIDA
            cursor.execute("SELECT Tag FROM Estación_4")
            tags_registrados_4 = [registro[0] for registro in cursor.fetchall()] #TAGS INCLUIDOS DENTRO DE LA TABLA DE LA ESTACIÓN 1
            index=tags_registrados_4.index(tag_registrado)+1
            print("index= ",index)
            print("lista_ceros: ",lista_ceros_4)
            print("lista_hora: ", lista_hora_4)
            # print(lista_ceros_4[index])
            ultimo_cero_4=False
            if tag_registrado not in tags_detectados_4 and lista_ceros_4[index]==0: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
                try:
                    print("tercer cero")
                    # print(index)
                    cursor.execute("SELECT Hora_entrada FROM Estación_4 WHERE Tag = %s", (tag_registrado,))
                    hora_entrada = cursor.fetchone()[0]
                    fecha, hora = lista_hora_4[index].split(' ')
                    descripcion= def_time(hora_entrada,lista_hora_4[index])
                    cursor.execute(
                            "INSERT INTO Eventos (usuario, evento, descripcion, fecha, hora) VALUES (%s, %s, %s, %s, %s)",
                            ("Estación: " + str(Estación), "Kit armado", "Tiempo de armado: " + descripcion, fecha, hora))

                    ultimo_cero_4=True
                    
                    #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
                except mysql.connector.Error as err:
                    print("Error al actualizar la hora de salida en la tabla de la Estación 4:", err) 

            if tag_registrado not in tags_detectados_4 and lista_ceros_4[index]!=0 and lista_ceros_4[index]!=max_cero:
                print("segundo cero")
                lista_ceros_4[index]=decrementar_lista(lista_ceros_4,index)
            
            if tag_registrado not in tags_detectados_4 and lista_ceros_4[index]==max_cero: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
                try:
                    print("primer cero")
                    #cursor.execute("INSERT INTO fechas (ID, Hora_salida, Estación) VALUES (%s, %s, %s)", (str(tag_registrado), obtener_hora_actual(), int(Estación)))
                    lista_hora_4[index]=(str(obtener_hora_actual()))
                    lista_ceros_4[index]=decrementar_lista(lista_ceros_4,index)
                    #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
                except mysql.connector.Error as err:
                    print("Error al actualizar la hora de salida en la tabla de la Estación 4:", err) 

            if lista_ceros_4[index]==0 and ultimo_cero_4==True:
                lista_ceros_4.pop(index)
                lista_hora_4.pop(index)
                cursor.execute("DELETE FROM Estación_4 WHERE Tag = %s", (tag_registrado,))
                #print("-1 fila estacion1")
                conexion.commit()

            if tag_registrado in tags_detectados_4:
                lista_ceros_4[index]=int(max_cero)

            ultimo_cero_4=False

        for tag_2 in Lector_2: #REGISTRO HORA DE ENTRADA
            
            if tag_2['AntennaID'] == 1:
                tags = tag_2['EPC-96'].decode('utf-8')
                # Asignación de nombre
                nombre_tag_4 = nombres_tags.get(tags, "No registrado")
                
                # Verificar si el tag ya está presente en la tabla de la Estación 1
                cursor.execute("SELECT Tag FROM Estación_4 WHERE Tag = %s", (tags,))
                resultado = cursor.fetchone()
                
                if resultado is None:
                    # El tag no está presente en la tabla, entonces se inserta
                    try:
                        # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
                        print(obtener_hora_actual())
                        cursor.execute("INSERT INTO Estación_4 (Tag, Kit, Hora_entrada) VALUES (%s, %s, %s)", (tags, nombre_tag_4, obtener_hora_actual()))
                        conexion.commit()
                        lista_ceros_4.append(int(max_cero))
                        lista_hora_4.append(0)
                        #print(f"Tag '{tags}' insertado en la tabla de la Estación 1 con nombre '{nombre_tag_4}' y hora de entrada registrada.")
                    except mysql.connector.Error as err:
                        print("Error al insertar el tag en la tabla de la Estación 4:", err)
    except Exception as e:
        print("ERROR!")

############
#ESTACIÓN_5#
############

    tags_detectados_5 = [tag['EPC-96'].decode('utf-8') for tag in Lector_2 if tag['AntennaID'] == 2]
    cursor.execute("SELECT Tag FROM Estación_5")
    tags_registrados_5 = [registro[0] for registro in cursor.fetchall()]

    Estación=5
    try:
        for tag_registrado in tags_registrados_5: #REGISTRO HORA DE SALIDA
            cursor.execute("SELECT Tag FROM Estación_5")
            tags_registrados_5 = [registro[0] for registro in cursor.fetchall()] #TAGS INCLUIDOS DENTRO DE LA TABLA DE LA ESTACIÓN 1
            index=tags_registrados_5.index(tag_registrado)+1
            print("index= ",index)
            print("lista_ceros: ",lista_ceros_5)
            print("lista_hora: ", lista_hora_5)
            # print(lista_ceros_5[index])
            ultimo_cero_5=False
            if tag_registrado not in tags_detectados_5 and lista_ceros_5[index]==0: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
                try:
                    print("tercer cero")
                    # print(index)
                    cursor.execute("SELECT Hora_entrada FROM Estación_5 WHERE Tag = %s", (tag_registrado,))
                    hora_entrada = cursor.fetchone()[0]
                    fecha, hora = lista_hora_5[index].split(' ')
                    descripcion= def_time(hora_entrada,lista_hora_5[index])
                    cursor.execute(
                            "INSERT INTO Eventos (usuario, evento, descripcion, fecha, hora) VALUES (%s, %s, %s, %s, %s)",
                            ("Estación: " + str(Estación), "Kit armado", "Tiempo de armado: " + descripcion, fecha, hora))
                    ultimo_cero_5=True
                    
                    #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
                except mysql.connector.Error as err:
                    print("Error al actualizar la hora de salida en la tabla de la Estación 5:", err) 

            if tag_registrado not in tags_detectados_5 and lista_ceros_5[index]!=0 and lista_ceros_5[index]!=max_cero:
                print("segundo cero")
                lista_ceros_5[index]=decrementar_lista(lista_ceros_5,index)
            
            if tag_registrado not in tags_detectados_5 and lista_ceros_5[index]==max_cero: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
                try:
                    print("primer cero")
                    #cursor.execute("INSERT INTO fechas (ID, Hora_salida, Estación) VALUES (%s, %s, %s)", (str(tag_registrado), obtener_hora_actual(), int(Estación)))
                    lista_hora_5[index]=(str(obtener_hora_actual()))
                    lista_ceros_5[index]=decrementar_lista(lista_ceros_5,index)
                    #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
                except mysql.connector.Error as err:
                    print("Error al actualizar la hora de salida en la tabla de la Estación 5:", err) 

            if lista_ceros_5[index]==0 and ultimo_cero_5==True:
                lista_ceros_5.pop(index)
                lista_hora_5.pop(index)
                cursor.execute("DELETE FROM Estación_5 WHERE Tag = %s", (tag_registrado,))
                #print("-1 fila estacion1")
                conexion.commit()

            if tag_registrado in tags_detectados_5:
                lista_ceros_5[index]=int(max_cero)

            ultimo_cero_5=False

        for tag_2 in Lector_2: #REGISTRO HORA DE ENTRADA
            
            if tag_2['AntennaID'] == 2:
                tags = tag_2['EPC-96'].decode('utf-8')
                # Asignación de nombre
                nombre_tag_5 = nombres_tags.get(tags, "No registrado")
                
                # Verificar si el tag ya está presente en la tabla de la Estación 1
                cursor.execute("SELECT ID FROM Estación_5 WHERE Tag = %s", (tags,))
                resultado = cursor.fetchone()
                
                if resultado is None:
                    # El tag no está presente en la tabla, entonces se inserta
                    try:
                        # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
                        print(obtener_hora_actual())
                        cursor.execute("INSERT INTO Estación_5 (Tag, Kit, Hora_entrada) VALUES (%s, %s, %s)", (tags, nombre_tag_5, obtener_hora_actual()))
                        conexion.commit()
                        lista_ceros_5.append(int(max_cero))
                        lista_hora_5.append(0)
                        #print(f"Tag '{tags}' insertado en la tabla de la Estación 1 con nombre '{nombre_tag_5}' y hora de entrada registrada.")
                    except mysql.connector.Error as err:
                        print("Error al insertar el tag en la tabla de la Estación 5:", err)
    except Exception as e:
        print("ERROR!")

############
#ESTACIÓN_6#
############

    tags_detectados_6 = [tag['EPC-96'].decode('utf-8') for tag in Lector_2 if tag['AntennaID'] == 3]
    cursor.execute("SELECT Tag FROM Estación_6")
    tags_registrados_6 = [registro[0] for registro in cursor.fetchall()]

    Estación=6
    try:
        for tag_registrado in tags_registrados_6: #REGISTRO HORA DE SALIDA
            cursor.execute("SELECT Tag FROM Estación_6")
            tags_registrados_6 = [registro[0] for registro in cursor.fetchall()] #TAGS INCLUIDOS DENTRO DE LA TABLA DE LA ESTACIÓN 1
            index=tags_registrados_6.index(tag_registrado)+1
            print("index= ",index)
            print("lista_ceros: ",lista_ceros_6)
            print("lista_hora: ", lista_hora_6)
            # print(lista_ceros_6[index])
            ultimo_cero_6=False
            if tag_registrado not in tags_detectados_6 and lista_ceros_6[index]==0: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
                try:
                    print("tercer cero")
                    # print(index)
                    cursor.execute("SELECT Hora_entrada FROM Estación_6 WHERE Tag = %s", (tag_registrado,))
                    hora_entrada = cursor.fetchone()[0]
                    fecha, hora = lista_hora_6[index].split(' ')
                    descripcion= def_time(hora_entrada,lista_hora_6[index])
                    cursor.execute(
                            "INSERT INTO Eventos (usuario, evento, descripcion, fecha, hora) VALUES (%s, %s, %s, %s, %s)",
                            ("Estación: " + str(Estación), "Kit armado", "Tiempo de armado: " + descripcion, fecha, hora))
                    ultimo_cero_6=True
                    
                    #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
                except mysql.connector.Error as err:
                    print("Error al actualizar la hora de salida en la tabla de la Estación 6:", err) 

            if tag_registrado not in tags_detectados_6 and lista_ceros_6[index]!=0 and lista_ceros_6[index]!=max_cero:
                print("segundo cero")
                lista_ceros_6[index]=decrementar_lista(lista_ceros_6,index)
            
            if tag_registrado not in tags_detectados_6 and lista_ceros_6[index]==max_cero: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
                try:
                    print("primer cero")
                    #cursor.execute("INSERT INTO fechas (ID, Hora_salida, Estación) VALUES (%s, %s, %s)", (str(tag_registrado), obtener_hora_actual(), int(Estación)))
                    lista_hora_6[index]=(str(obtener_hora_actual()))
                    lista_ceros_6[index]=decrementar_lista(lista_ceros_6,index)
                    #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
                except mysql.connector.Error as err:
                    print("Error al actualizar la hora de salida en la tabla de la Estación 6:", err) 

            if lista_ceros_6[index]==0 and ultimo_cero_6==True:
                lista_ceros_6.pop(index)
                lista_hora_6.pop(index)
                cursor.execute("DELETE FROM Estación_6 WHERE Tag = %s", (tag_registrado,))
                #print("-1 fila estacion1")
                conexion.commit()

            if tag_registrado in tags_detectados_6:
                lista_ceros_6[index]=int(max_cero)

            ultimo_cero_6=False

        for tag_2 in Lector_2: #REGISTRO HORA DE ENTRADA
            
            if tag_2['AntennaID'] == 3:
                tags = tag_2['EPC-96'].decode('utf-8')
                # Asignación de nombre
                nombre_tag_6 = nombres_tags.get(tags, "No registrado")
                
                # Verificar si el tag ya está presente en la tabla de la Estación 1
                cursor.execute("SELECT Tag FROM Estación_6 WHERE Tag = %s", (tags,))
                resultado = cursor.fetchone()
                
                if resultado is None:
                    # El tag no está presente en la tabla, entonces se inserta
                    try:
                        # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
                        print(obtener_hora_actual())
                        cursor.execute("INSERT INTO Estación_6 (Tag, Kit, Hora_entrada) VALUES (%s, %s, %s)", (tags, nombre_tag_6, obtener_hora_actual()))
                        conexion.commit()
                        lista_ceros_6.append(int(max_cero))
                        lista_hora_6.append(0)
                        #print(f"Tag '{tags}' insertado en la tabla de la Estación 1 con nombre '{nombre_tag_6}' y hora de entrada registrada.")
                    except mysql.connector.Error as err:
                        print("Error al insertar el tag en la tabla de la Estación 6:", err)
    except Exception as e:
        print("ERROR!")
############
#ESTACIÓN_7#
############

    tags_detectados_7 = [tag['EPC-96'].decode('utf-8') for tag in Lector_2 if tag['AntennaID'] == 4]
    cursor.execute("SELECT Tag FROM Estación_7")
    tags_registrados_7 = [registro[0] for registro in cursor.fetchall()]

    Estación=7
    try:
        for tag_registrado in tags_registrados_7: #REGISTRO HORA DE SALIDA
            cursor.execute("SELECT Tag FROM Estación_7")
            tags_registrados_7 = [registro[0] for registro in cursor.fetchall()] #TAGS INCLUIDOS DENTRO DE LA TABLA DE LA ESTACIÓN 1
            index=tags_registrados_7.index(tag_registrado)+1
            print("index= ",index)
            print("lista_ceros: ",lista_ceros_7)
            print("lista_hora: ", lista_hora_7)
            # print(lista_ceros_7[index])
            ultimo_cero_7=False
            if tag_registrado not in tags_detectados_7 and lista_ceros_7[index]==0: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
                try:
                    print("tercer cero")
                    # print(index)
                    cursor.execute("SELECT Hora_entrada FROM Estación_7 WHERE Tag = %s", (tag_registrado,))
                    hora_entrada = cursor.fetchone()[0]
                    fecha, hora = lista_hora_7[index].split(' ')
                    descripcion= def_time(hora_entrada,lista_hora_7[index])
                    cursor.execute(
                            "INSERT INTO Eventos (usuario, evento, descripcion, fecha, hora) VALUES (%s, %s, %s, %s, %s)",
                            ("Estación: " + str(Estación), "Kit armado", "Tiempo de armado: " + descripcion, fecha, hora))
                    ultimo_cero_7=True
                    
                    #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
                except mysql.connector.Error as err:
                    print("Error al actualizar la hora de salida en la tabla de la Estación 7:", err) 

            if tag_registrado not in tags_detectados_7 and lista_ceros_7[index]!=0 and lista_ceros_7[index]!=max_cero:
                print("segundo cero")
                lista_ceros_7[index]=decrementar_lista(lista_ceros_7,index)
            
            if tag_registrado not in tags_detectados_7 and lista_ceros_7[index]==max_cero: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
                try:
                    print("primer cero")
                    #cursor.execute("INSERT INTO fechas (ID, Hora_salida, Estación) VALUES (%s, %s, %s)", (str(tag_registrado), obtener_hora_actual(), int(Estación)))
                    lista_hora_7[index]=(str(obtener_hora_actual()))
                    lista_ceros_7[index]=decrementar_lista(lista_ceros_7,index)
                    #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
                except mysql.connector.Error as err:
                    print("Error al actualizar la hora de salida en la tabla de la Estación 7:", err) 

            if lista_ceros_7[index]==0 and ultimo_cero_7==True:
                lista_ceros_7.pop(index)
                lista_hora_7.pop(index)
                cursor.execute("DELETE FROM Estación_7 WHERE Tag = %s", (tag_registrado,))
                #print("-1 fila estacion1")
                conexion.commit()

            if tag_registrado in tags_detectados_7:
                lista_ceros_7[index]=int(max_cero)

            ultimo_cero_7=False

        for tag_2 in Lector_2: #REGISTRO HORA DE ENTRADA
            
            if tag_2['AntennaID'] == 4:
                print("leyó antena 7")
                tags = tag_2['EPC-96'].decode('utf-8')
                # Asignación de nombre
                nombre_tag_7 = nombres_tags.get(tags, "No registrado")
                
                # Verificar si el tag ya está presente en la tabla de la Estación 1
                cursor.execute("SELECT Tag FROM Estación_7 WHERE Tag = %s", (tags,))
                resultado = cursor.fetchone()
                
                if resultado is None:
                    # El tag no está presente en la tabla, entonces se inserta
                    try:
                        # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
                        print(obtener_hora_actual())
                        cursor.execute("INSERT INTO Estación_7 (Tag, Kit, Hora_entrada) VALUES (%s, %s, %s)", (tags, nombre_tag_7, obtener_hora_actual()))
                        conexion.commit()
                        lista_ceros_7.append(int(max_cero))
                        lista_hora_7.append(0)
                        #print(f"Tag '{tags}' insertado en la tabla de la Estación 1 con nombre '{nombre_tag_7}' y hora de entrada registrada.")
                    except mysql.connector.Error as err:
                        print("Error al insertar el tag en la tabla de la Estación 7:", err)
    except Exception as e:
        print("ERROR!")