<script lang="ts">

    import {onMount} from 'svelte';
    import {writable} from 'svelte/store';
    // import json file
    import data from './assets/data/products.json';

    const categories = (data as unknown) as Category[];

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

    const selectedCategory = writable(categories[0]);

    function selectCategory(category: Category) {
        selectedCategory.set(category);
    }

    interface ShoppingCartItem {
        product: Product;
        amount?: number;
        quantity?: number;
    }

    const shoppingCart = writable([] as ShoppingCartItem[]);

    function updateQuantity(product: Product, quantity: number) {
        if (!product.pricePerItem) {
            return;
        }
        shoppingCart.update((items) => {
            const existingItem = items.find((item) => item.product === product);
            if (existingItem && existingItem.quantity !== undefined) {
                existingItem.quantity = quantity;
                if (existingItem.quantity <= 0) {
                    return items.filter((item) => item !== existingItem);
                }
                return items;
            } else {
                return [...items, {
                    product: product,
                    quantity: quantity
                }];
            }
        });
    }

    function updateAmount(product: Product, amount: number) {
        if (!product.pricePer100g) {
            return;
        }
        shoppingCart.update((items) => {
            const existingItem = items.find((item) => item.product === product);
            if (existingItem && existingItem.amount) {
                existingItem.amount = amount;
                return items;
            } else {
                return [...items, {
                    product: product,
                    amount: amount
                }];
            }
        });
    }

</script>
<div class="text-custom-400 bg-white rounded-md">
    <div class="grid grid-cols-6 auto-rows-min gap-4">
        <div class="col-start-1 row-start-1">
            <h2>Kategorien</h2>
        </div>
        <div class="col-start-1 row-start-2">
            <div class="bg-custom-200 rounded-md">
                {#each categories as category}
                    <div class="p-0.5">
                        <div class="{category.name === $selectedCategory.name ? 'font-bold' : ''} cursor-pointer ext-custom-400"
                             on:click={() => selectCategory(category)}>
                            <span>{category.name}</span>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
        <div class="col-start-2 col-span-4 row-start-1">
            <h2>{$selectedCategory.name}</h2>
        </div>
        <div class="col-start-2 col-span-4 row-start-2">
            <div class="grid grid-cols-3 gap-4">
                {#each $selectedCategory.products as product}
                    <div class="bg-custom-200 p-2 text-custom-400 rounded-md">
                        <h4>{product.name}</h4>
                        {#if (product.pricePerItemStr)}
                            <p>Preis pro Stück: {product.pricePerItem?.toFixed(2)}€</p>
                        {:else}
                            <p>Preis pro 100g: {product.pricePer100g?.toFixed(2)}€</p>
                        {/if}
                        <hr>
                        {#if product.pricePerItem}
                            <div id="button-row">
                                <input id="quantity" type="number" min="0"
                                       class="w-1/4"
                                       value={$shoppingCart.find(item => item.product === product)?.quantity ?? 0}
                                       on:change={(e) => updateQuantity(product, (e.target as HTMLInputElement).valueAsNumber)}/>
                                <label for="quantity">Stk</label>
                            </div>
                        {:else if product.pricePer100g}
                            <div id="button-row">
                                <input id="amount" type="number" min="0"
                                       class="w-1/4"
                                       step="100"
                                       value={$shoppingCart.find(item => item.product === product)?.amount ?? 0}
                                       on:change={(e) => updateAmount(product, (e.target as HTMLInputElement).valueAsNumber)}/>
                                <label for="amount">g</label>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
        <div class="col-start-6 row-start-1">
            <h2>Warenkorb</h2>
        </div>
        <div class="col-start-6 row-start-2">
            <div class="bg-custom-200 text-custom-400 rounded-md p-2">
                {#each $shoppingCart as item, index}
                    <div class="">
                        <h4>{item.product.name}</h4>
                        {#if item.quantity !== undefined}
                                <span>{item.quantity} Stk x {item.product.pricePerItem?.toFixed(2)}
                                    € - {(item.quantity * (item.product.pricePerItem ?? 0)).toFixed(2)}€</span>
                        {:else if item.amount !== undefined}
                                <span>{item.amount}
                                    g - {((item.amount / 100) * (item.product.pricePer100g ?? 0)).toFixed(2)}
                                    €</span>
                        {/if}
                    </div>

                    {#if index !== $shoppingCart.length - 1}
                        <hr class="text-custom-400 border-custom-400 text-center h-1 border-dashed">
                    {/if}
                {/each}
                {#if $shoppingCart.length === 0}
                    <span>Der Warenkorb ist leer</span>
                {/if}
                <hr class="text-custom-400 border-custom-400 text-center h-1 border-double">
                <p>Gesamt: {($shoppingCart.reduce((acc, item) => {
                    if (item.quantity !== undefined) {
                        return acc + item.quantity * (item.product.pricePerItem ?? 0);
                    } else if (item.amount !== undefined) {
                        return acc + (item.amount / 100) * (item.product.pricePer100g ?? 0);
                    }
                    return acc;
                }, 0)).toFixed(2)}€</p>
                <button class="bg-custom-400 text-custom-200 rounded-md p-2"
                        disabled={$shoppingCart.length === 0}>
                    Kaufen
                </button>
            </div>
        </div>
    </div>
</div>


<style global lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>
