import OpenAI from "openai";
import dotenv from "dotenv";
import axios from 'axios';

dotenv.config();



const openAIApikey = process.env.OPEN_AI_API_KEY;

console.log(openAIApikey);

class OpenAIUtils{
    constructor(){
        this.openai = new OpenAI({ apiKey:  openAIApikey });

    }

    async consulta_chatGPT(){

        const consultaOpenAI_chatGPT = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Das respuestas concisas en español de 2 párrafos"},
                { role:"user", content: "Como juego tenis" }
            ]
        });
        return consultaOpenAI_chatGPT.choices[0].message;

    }

    async generador_embeddings(texto){

        try {
            
            const response = await axios.post(
                'https://api.openai.com/v1/embeddings',
                {
                    model: 'text-embedding-3-small',
                    input: texto,
                },
                {
                    headers: {
                        Authorization: `Bearer ${openAIApikey}`,
                    },
                }
            )

            const embedding = response.data.data[0].embedding;

            return embedding;

        } catch (error) {
            
        }

    }

    async sugerenciaPropiedades(prompt){

        const response = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `Eres un asistente inmobiliario que ayuda a encontrar a los clientes la mejor casa de acuerdo con sus.\n
                    
                    condiciones, debes dar una respuesta que contenga los siguientes datos:\n
                    - Ubicación\n
                    - Precio\n
                    - Tamaño\n
                    - sugerencia: un texto con los detalles de la recomencación. debe comenzar con: necesitas un ... con ... que satisface tus necesidades de....

                    la respuesta debe ser concisa y no debe exceder los 90 tokens, al igual que simplificada, 

                    Devuelve la respuesta en un JSON con los datos especificados.
                    
                    `},
                {
                    role: "user",
                    content: prompt,
                },
            ],
            response_format: {
                "type": "json_object"
            },
            max_completion_tokens: 120,
        });

        return JSON.parse(response.choices[0].message.content);
    }

    redactarPrompt = (usuario) => {
        
        return `Analiza que tipo de propiedad se ajusta a una persona con ${usuario.edad} años, un presupuesto de ${usuario.presupuesto} y que le guste ${usuario.gustos}`;

    }
}

export default OpenAIUtils;