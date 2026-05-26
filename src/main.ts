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
    isPerson(dati) &&
    // // condizione di esistenza dati
    // typeof dati === 'object' && dati !== null &&
    // // controllo proprieta id
    // "id" in dati && typeof dati.id === 'number' &&
    // // controllo proprieta name
    // "name" in dati && typeof dati.name === 'string' &&
    // // controllo anno di nascita
    // "birth_year" in dati && typeof dati.birth_year === 'number' &&
    // // controllo anno di morte
    // "death_year" in dati && typeof dati.death_year === 'number' &&
    // // controllo biografia
    // "biografy" in dati && typeof dati.biografy === 'string' &&
    // // controllo image
    // "image" in dati && typeof dati.image === 'string' &&
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

// BONUS 1
function createActress(data: Omit<Actress, "id">): Actress {
  return {
    ...data,
    id: Math.floor(Math.random() * 1000),
  }
}

function updateActress(actress: Actress, update: Partial<Actress>): Actress {
  return {
    ...actress,
    ...update,
    id: actress.id,
    name: actress.name

  }
}

// BONUS 2
type ActorsNationality =
  | ActressNetionality
  | "New Zealand"
  | "Hong Kong"
  | "German"
  | "Canadian"
  | "Irish"

type Actor = Person & {
  known_for: [string, string, string],
  awards: [string] | [string, string],
  nationality: ActorsNationality
}

function isPerson(dati: unknown): dati is Person {
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
    "image" in dati && typeof dati.image === 'string'
  )
}

function isActor(dati: unknown): dati is Actor {
  return (
    isPerson(dati) &&
    "known_for" in dati && dati.known_for instanceof Array &&
    dati.known_for.length === 3 &&
    dati.known_for.every(m => typeof m === 'string') &&

    "awards" in dati && dati.awards instanceof Array &&
    (dati.awards.length === 1 || dati.awards.length === 2) &&
    dati.awards.every(m => typeof m === 'string') &&
    "nationality" in dati && typeof dati.nationality === 'string'
  )
}

// funzione getActor
async function getActor(id: number): Promise<Actor | null> {
  try {
    const res = await fetch(`http://localhost:3333/actors/${id}`);
    const dati: unknown = await res.json();
    if (!isActor(dati)) {
      throw new Error('il formato dei dati non è valido')
    }
    return dati;
  } catch (error) {
    if (error instanceof Error) {
      console.error('errore durante il recupero attore :', error)
    } else {
      console.error('Errore non definito :', error)
    }
    return null;
  }

}

// funzione getAllActors
async function getAllActors(): Promise<Actor[]> {
  try {
    const res = await fetch(`http://localhost:3333/actors/`);
    // controllo risposta chiamata
    if (!res.ok) {
      throw new Error(`Errore durante la chiamta HTTP ${res.status} : ${res.statusText}`);
    }

    const dati: unknown = await res.json();
    if (!(dati instanceof Array)) {
      throw new Error('Formato dei dati non valido, ci si aspetta un array');
    }
    // filtraggio di tutto cio che non è un actor
    const attoriValidi: Actor[] = dati.filter(isActor);
    return attoriValidi;

  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore durante il recupero attori', error);
    } else {
      console.error('Errore sconosciuto', error);
    }
    return [];
  }
}

// funzione getActors
async function getActors(ids: number[]): Promise<(Actor | null)[]> {
  try {
    const promises = ids.map(id => getActor(id));
    return await Promise.all(promises);

  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Errore durante il recupero attori');
    } else {
      console.error('Errore sconoscito:', error);
    }
    return [];
  }
}

//funzione createActor
function createActor(data: Omit<Actor, "id">): Actor {
  return {
    ...data,
    id: Math.floor(Math.random() * 1000),
  }
}

// funzione updateActor
function updateActor(actor: Actor, update: Partial<Actor>): Actor {
  return {
    ...actor,
    ...update,
    id: actor.id,
    name: actor.name

  }
}







// BONUS 3
async function createRandomCouple(): Promise<[Actress, Actor] | null> {
  const [actresses, actors] = await Promise.all([getAllActress(), getAllActors()]);
  if (actresses.length === 0 || actors.length === 0) {
    return null;
  }
  const randomActress = actresses[Math.floor(Math.random() * actresses.length)];
  const randomActor = actors[Math.floor(Math.random() * actors.length)];
  return [randomActress, randomActor]
} 