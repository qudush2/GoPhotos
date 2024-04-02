// to be used later to automatically manage transfers

// import Stripe from "stripe";

// const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
//   apiVersion: "2023-10-16",
// });

// async function transferFundsToPhotographer(amount : number, photographerStripeAccountId : string) {
//     try {
//       const transfer = await stripe.transfers.create({
//         amount: amount, // Amount in cents
//         currency: 'usd',
//         destination: photographerStripeAccountId,
//         // You can add a description or metadata here if needed
//       });
//       console.log('Transfer successful:', transfer);
//     } catch (error) {
//       console.error('Transfer failed:', error);
//     }
//   }