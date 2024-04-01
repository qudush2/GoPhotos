export default function Temp() {
  return (
    <div className="px-20">
      hey!
      <form
        action="/api/create-checkout-session"
        className="border-2 border-black p-2 w-1/6 my-5 bg-blue-300 flex justify-center"
        method="POST"
      >
        <button type="submit">Checkout</button>
      </form>
    </div>
  );
}
