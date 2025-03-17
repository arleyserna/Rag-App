import PineConeUtils from "./utils/PineConeUtils.js";
import OpenAIUtils from "./utils/OpenAIUtils.js"
import fs from 'fs'
import { Pinecone } from "@pinecone-database/pinecone";

const propiedades = JSON.parse(fs.readFileSync('data/propiedades.json','utf-8'));


const openAIUtils = new OpenAIUtils();
const pineConeUtils = new PineConeUtils();


const procesarListaEmbeddings = async () => {

    for(const propiedad of propiedades){
        
        const texto = `${propiedad.titulo}, ubicación en la ${propiedad.ubicacion}, con ${propiedad.habitaciones} habitaciones  y  ${propiedad.banos} banos, tiene un tamaño de ${propiedad.tamano} de ${propiedad.area}, y un precio de ${propiedad.precio}`;
        
        //const embedding = await openAIUtils.generador_embeddings(texto);

        //const result = await pineConeUtils.almacenarDatos()

        let embedding = await openAIUtils.generador_embeddings(texto);

        propiedad.values = embedding;
        
    }

    // crea un nuevo array con el formato que espera Pinecone
    const productosFormatoEmbedding = propiedades.map((producto) =>{
        return{
            id: producto.id,
            values: producto.values,
            metadata: { titulo: producto.titulo,}
        };
    });

    console.log(productosFormatoEmbedding);
    return productosFormatoEmbedding;

    
    
};

const guardarDatos = async () => {
    const datosProcesados = await procesarListaEmbeddings();
    pineConeUtils.almacenarDatos(datosProcesados);
}

guardarDatos();