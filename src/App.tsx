import { FormEvent, useState } from "react";

type PokemonResponse = {
  name: string;
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
};

function App() {
  const [pokemon, setPokemon] = useState("");
  const [pokemonData, setPokemonData] = useState<PokemonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (pokemon.length === 0) {
      return;
    }

    setLoading(true);
    setError(null); // Reset error state

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`,
      );
      if (!response.ok) {
        throw new Error(
          `Falha em localizar o pokemon: ${response.status} ${response.statusText}`,
        );
      }
      const data = await response.json();

      setPokemonData(data);
    } catch (error: any) {
      setError(`Ocorreu um erro: ${error.message}`);
      setPokemonData(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center">
      <div className="flex flex-col items-start justify-center gap-4">
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="pokemon"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Nome do pokemon
          </label>
          <div className="mt-2 flex items-center justify-center gap-2">
            <input
              type="text"
              name="pokemon"
              id="pokemon"
              value={pokemon}
              onChange={(e) => setPokemon(e.target.value)}
              className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-indigo-600 px-2 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Buscar
            </button>
          </div>
        </form>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {pokemonData && (
          <div>
            <h2 className="text-xl font-bold">{pokemonData.name}</h2>
            <h3 className="mt-2 text-sm text-gray-500">habilidades: </h3>
            <ul>
              {pokemonData?.abilities.map((ability, index) => (
                <li key={index}>{ability.ability.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
