const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function setupProductAndPrice() {
    // Create Product
    const product = await stripe.products.create({
      name: 'Amazing Product',
      description: 'Description of the amazing product',
    });

    // Create Price for the Product
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 2000,
      currency: 'usd',
    });

    console.log(`Product ID: ${product.id}`);
    console.log(`Price ID: ${price.id}`);

return {product, price}
}

