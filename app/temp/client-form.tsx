"use client"
import React from 'react';

// This is a client-side component
export default function ClientForm() {

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Your form submission logic here
    const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
      }); 
      console.log('you pressed the checkout button')
      console.log(response)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const { url } = await response.json();
      window.location.href = url; // Redirect the user to the Stripe checkout page
  };

  return (
    <form onSubmit={handleSubmit} className="border-2 border-black p-2 w-1/6 my-5 bg-blue-300 flex justify-center" method="POST">
      <button type="submit">Checkout</button>
    </form>
  );
}