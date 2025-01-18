export default function NotFound() {
  return (
    <div className="w-fit m-auto pt-8 md:pt-16 text-center">
      <p className="text-6xl">404</p>
      <p className="text-2xl">Ten zasób nie istnieje</p>

      <br />

      <p className="text-xl">A tu kotek:</p>
      <div className="mt-2 overflow-hidden w-fit rounded-3xl">
        <img
          //   src="https://cataas.com/cat/gif?position=center&width=500&height=500"
          src="https://cataas.com/cat/gif"
          alt="Błendowy Koteł"
        />
      </div>
    </div>
  );
}
