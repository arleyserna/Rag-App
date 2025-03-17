import PineConeUtils from "./utils/PineConeUtils.js";
import OpenAIUtils from "./utils/OpenAIUtils.js";

const pineConeUtils = new PineConeUtils();
const openai = new OpenAIUtils();


const usuario = {
    edad: 20,
    presupuesto: 1000000000,
    gustos: 'la Los caballos, el agua',
};

const prompt = openai.redactarPrompt(usuario);

console.log(prompt);


const sugerencia = await openai.sugerenciaPropiedades(prompt);

console.log(sugerencia);

const embeddings = await openai.generador_embeddings(sugerencia.sugerencia);

console.log(embeddings);

const resultados = await pineConeUtils.buscarDatos(embeddings);

console.log(resultados);
//pineConeUtils.buscarDatos()