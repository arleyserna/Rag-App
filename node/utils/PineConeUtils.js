import {Pinecone} from '@pinecone-database/pinecone';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const pineConeApikey = process.env.PINECONE_API_KEY;

console.log("imprimiendo API Key de Pinecone");

console.log(pineConeApikey);

class PineConeUtils{

    constructor(){
        try {
            
            this.pinecone = new Pinecone({
                    apiKey: pineConeApikey
            });

            this.index = this.pinecone.index('mi-app-rag');

            
        } catch (error) {
            console.log(`Error al crear la instancia de Pinecone:`, error);
        }

    }

    async almacenarDatos(data){
        try {
            await this.index.upsert(data);
            console.log(`datos almacenados en Pinecone`);
        } catch (error) {
            console.log(`Error al almacenar los datos en Pinecone:`, error);
        }
        
    }
    async buscarDatos(queryFormatoEmbeddings){
        try {
            const queryResponse = await this.index.query({
                vector: queryFormatoEmbeddings,
                topK: 2,
                includeValues: false,
                includeMetadata: true,
            });
            return queryResponse.matches;
        } catch (error) {
            console.log(`Error al buscar los datos en Pinecone:`, error);
            return []
        }
    }
};

export default PineConeUtils;