// creazione alias
type Person = {
  readonly id: number,
  readonly name: string,
  birth_year: number,
  death_year?: number,
  biografy: string,
  image: string
}


type ActressNetionality =
  | "American"
  | "British"
  | "Australian"
  | "israeli-american"
  | "south-African"
  | "French"
  | "Indian"
  | "Israeli"
  | "Spanish"
  | "South-Korea"
  | "Chinese"


type Actress = Person & {
  most_famous_movies: [string, string, string],
  awards: string,
  nationality: ActressNetionality

}
// ritorna un booleano
function isActress(dati: unknown): dati is Actress {
  return (
    // condizione di esistenza dati
    typeof dati === 'object' && dati !== null &&
    // controllo proprieta id
    "id" in dati && typeof dati.id === 'number' &&
    // controllo proprieta name
    "name" in dati && typeof dati.name === 'string' &&
    // controllo anno di nascita
    "birth_year" in dati && typeof dati.birth_year === 'number' &&
    // controllo anno di morte
    "death_year" in dati && typeof dati.death_year === 'number' &&
    // controllo biografia
    "biografy" in dati && typeof dati.biografy === 'string' &&
    // controllo image
    "image" in dati && typeof dati.image === 'string' &&
    "most_famous_movies" in dati && dati.most_famous_movies instanceof Array &&
    dati.most_famous_movies.length === 3 &&
    dati.most_famous_movies.every(m => typeof m === 'string') &&
    "awards" in dati && typeof dati.awards === 'string' &&
    "nationality" in dati && typeof dati.nationality === 'string'

  )
}

async function getActress(id: number): Promise<Actress | null> {
  try {
    const res = await fetch(`http://localhost:3333/actresses/${id}`);
    const dati: unknown = await res.json();
    if (!isActress(dati)) {
      throw new Error('il formato dei dati non è valido')
    }
    return dati;
  } catch (error) {
    if (error instanceof Error) {
      console.error('errore durante il recupero attrice :', error)
    } else {
      console.error('Errore non definito :', error)
    }
    return null;
  }

}

async function getAllActress(): Promise<Actress[]> {
  try {
    const res = await fetch(`http://localhost:3333/actresses/`);
    // controllo risposta chiamata
    if (!res.ok) {
      throw new Error(`Errore durante la chiamta HTTP ${res.status} : ${res.statusText}`);
    }

    const dati: unknown = await res.json();
    if (!(dati instanceof Array)) {
      throw new Error('Formato dei dati non valido, ci si aspetta un array');
    }
    // filtraggio di tutto cio che non è un actress
    const attriciValide: Actress[] = dati.filter(isActress);
    return attriciValide;

  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore durante il recupero delle attrici', error);
    } else {
      console.error('Errore sconosciuto', error);
    }
    return [];
  }
}

async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
  try {
    const promises = ids.map(id => getActress(id));
    return await Promise.all(promises);

  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Errore durante il recupero delle attrici');
    } else {
      console.error('Errore sconoscito:', error);
    }
    return [];
  }
}