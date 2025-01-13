import json
import os
import sys

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_ollama.embeddings import OllamaEmbeddings

from data.embeddings.utils.leer_archivos import leer_archivos

# Definimos los directorios
directorio = "data/info"
persist_directory = "./chroma_db"
archivos_guardados_path = "data/embeddings/json/archivos_guardados.json"
archivos_guardados = {}

# Comprobamos que el directorio donde se guarda la info exista
if not os.path.isdir(directorio):
    print("El directorio donde se guarda la info no existe.")
    sys.exit(1)

# Cargar el modelo de embeddings de Ollama
try:
    embeddings = OllamaEmbeddings(model="nomic-embed-text")
except Exception as e:
    print(f"Error al cargar el modelo de embeddings: {e}")
    sys.exit(1)

# Crear un diccionario para las bases de datos por carpeta
db_collections = {}

# Configuración del splitter
try:
    text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
        chunk_size=500, chunk_overlap=50
    )
except ImportError:
    print(
        "El paquete `tiktoken` no está instalado. Instálalo con: `pip install tiktoken`."
    )
    sys.exit(1)

# Recorrer cada subcarpeta en `data/info`
for carpeta in os.listdir(directorio):
    ruta_carpeta = os.path.join(directorio, carpeta)

    # Solo procesar directorios
    if os.path.isdir(ruta_carpeta):
        print(f"📦 Procesando carpeta: {carpeta}")

        # Crear una colección por carpeta
        try:
            db_collections[carpeta] = Chroma(
                persist_directory=persist_directory,
                embedding_function=embeddings,
                collection_name=f"{carpeta}_collection",
            )
        except Exception as e:
            print(f"Error al crear la colección para {carpeta}: {e}")
            continue

        # Cargar archivos guardados específicos para cada carpeta
        carpeta_guardados_path = (
            f"{archivos_guardados_path.replace('.json', f'_{carpeta}.json')}"
        )
        try:
            if os.path.exists(carpeta_guardados_path):
                with open(carpeta_guardados_path, "r", encoding="utf-8") as f:
                    archivos_guardados = json.load(f)
            else:
                archivos_guardados = {}
        except json.JSONDecodeError as e:
            print(f"Error al leer el archivo JSON para {carpeta}: {e}")
            continue

        # Procesar documentos con leer_archivos
        try:
            doc = leer_archivos(
                ruta_carpeta, text_splitter, archivos_guardados, carpeta_guardados_path
            )
        except Exception as e:
            print(f"Error al leer los archivos de {carpeta}: {e}")
            continue

        # Si hay documentos, añadir a la colección
        if doc:
            try:
                # Preparar textos y metadatos
                textos = [documento.page_content for documento in doc]
                metadata = [documento.metadata for documento in doc]
                ids = [
                    f"{documento.metadata['hash_document']}_{documento.metadata['fragment_index']}"
                    for documento in doc
                ]

                # Eliminar vectores antiguos
                for file, data in archivos_guardados.items():
                    previous_hash = data.get("previous_hash")
                    if previous_hash:
                        db_collections[carpeta].delete(where={"hash": previous_hash})

                # Agregar los nuevos documentos
                db_collections[carpeta].add_texts(
                    texts=textos, metadata=metadata, ids=ids
                )

                # Guardar la nueva versión del archivo de control
                with open(carpeta_guardados_path, "w", encoding="utf-8") as f:
                    json.dump(archivos_guardados, f, ensure_ascii=False, indent=4)

                print(
                    f"✅ {len(doc)} fragmentos añadidos a la colección '{carpeta}_collection'."
                )

            except Exception as e:
                print(f"❌ Error al añadir documentos en la colección {carpeta}: {e}")
        else:
            print(f"ℹ️ No se encontraron documentos nuevos en {carpeta}.")

print("✅ Proceso completado.")
