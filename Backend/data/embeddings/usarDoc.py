import sys

from langchain_chroma import Chroma
from langchain_ollama.embeddings import OllamaEmbeddings

# Definir la base de datos y las colecciones
persist_directory = "./chroma_db"
colecciones = ["antonio", "codigo", "nonebot"]

# Cargar el modelo de embeddings
try:
    embeddings = OllamaEmbeddings(model="nomic-embed-text")
except Exception as e:
    print(f"Error al cargar el modelo de embeddings: {e}")
    sys.exit(1)

# Inicializar las conexiones con cada colección
db_collections = {}
for collection in colecciones:
    try:
        db_collections[collection] = Chroma(
            persist_directory=persist_directory,
            embedding_function=embeddings,
            collection_name=f"{collection}_collection",
        )
    except Exception as e:
        print(f"Error al conectar con la colección {collection}: {e}")


# Función para realizar búsquedas en una colección específica
def buscar_embeding(query, collection_name, top_k=2):
    try:
        if collection_name in db_collections:
            resultados = db_collections[collection_name].similarity_search(
                query, k=top_k
            )
            if resultados:
                return {"collection": collection_name, "results": resultados}
            else:
                return {
                    "collection": collection_name,
                    "document": "No se encontraron resultados.",
                }
        else:
            return {"error": f"La colección '{collection_name}' no existe."}

    except Exception as e:
        print(f"Error al realizar la búsqueda en {collection_name}: {e}")
        return None
