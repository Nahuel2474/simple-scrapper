import fs from "fs";
import { SearchProductWithoutImg } from "./scrapper/Search-product.js";


async function run(word) {
  try {
    console.time('proceso');
    const products = await SearchProductWithoutImg(word);
    const filePath =  `./src/data/${word}.json`
    const jsonContent = JSON.stringify(products, null, 2);

    console.log(products)
  fs.writeFileSync(filePath, jsonContent);

    console.log('Productos almacenados en : ' , filePath); 
    console.timeEnd('proceso');
  } catch (error) {
    console.error('Error al obtener productos:', error);
  }
}


