import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

interface Product {
    name: string;
    pricePerItemStr: string;
    pricePer100gStr: string;

    pricePerItem?: number;
    pricePer100g?: number;
}

interface Category {
    name: string;
    products: Product[];
}

const inputFilePath = path.join(__dirname, 'input', 'products.csv');
const outputFilePath = path.join(__dirname,'output', 'products.json');

fs.mkdirSync(outputFilePath);

const categories: Category[] = [];
let currentCategory: Category | null = null;

fs.createReadStream(inputFilePath)
    .pipe(csv.default({ separator: ',' }))
    .on('data', (row) => {
        const id = row['id'];
        const name = row['name'];
        const productPricePerItem = row['pricePerItem'];
        const productPricePer100g = row['pricePer100g'];

        if (!id) {
            if (currentCategory) {
                categories.push(currentCategory);
            }
            currentCategory = { name: name?.trim(), products: [] };
        }

        if (id && name && (productPricePerItem || productPricePer100g)) {
            const product: Product = {
                name: name?.trim(),
                pricePerItemStr: productPricePerItem?.trim() || null, // " 0,64 € "
                pricePer100gStr: productPricePer100g?.trim() || null, // " 0,64 € "
                pricePerItem: parseFloat(productPricePerItem?.replace(' €', '').replace(',', '.').trim()),
                pricePer100g: parseFloat(productPricePer100g?.replace(' €', '').replace(',', '.').trim())
            }

            if (currentCategory) {
                currentCategory.products.push(product);
            }
        }
    })
    .on('end', () => {
        if (currentCategory) {
            categories.push(currentCategory);
        }
        fs.writeFileSync(outputFilePath, JSON.stringify(categories, null, 2));
        console.log('CSV file successfully processed and JSON file created.');
    });