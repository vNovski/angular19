import { HttpClient } from '@angular/common/http';
import { inject, Injectable, resource, ResourceLoaderParams, ResourceRef, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { IJoke } from './interfaces/joke.interface';

@Injectable({
  providedIn: 'root'
})
export class JokesOldService {
  #httpClient = inject(HttpClient);
  #jokesByTypeResource: ResourceRef<IJoke[]> | null = null;
  
  constructor() { }

  getJokeTypesLegacy(): Observable<string[]> {
    return this.#httpClient.get<string[]>('https://official-joke-api.appspot.com/types')
  }
  getJokesByTypeLegacy(type: string): Observable<IJoke[]> {
    return this.#httpClient.get<IJoke[]>(`https://official-joke-api.appspot.com/jokes/${type}/ten`)
  }

  getTypesResource(): ResourceRef<string[]> {
    return resource<string[], undefined>({
      loader: () => fetch('https://official-joke-api.appspot.com/types').then((res) => res.json())
    })
  }

  jokesByTypeResource($type: WritableSignal<string | undefined>) {
    if (!this.#jokesByTypeResource) {
      this.#jokesByTypeResource = resource<IJoke[], string | undefined>({ request: $type, loader: this.jokesLoader });
    }
    return this.#jokesByTypeResource;
  }

  private async jokesLoader({ request: type, abortSignal }: ResourceLoaderParams<string | undefined>): Promise<IJoke[]> {
    const responce = await fetch(`https://official-joke-api.appspot.com/jokes/${type}/ten`, { signal: abortSignal });

    if (!responce.ok) {
      throw Error(`${responce.status}: ${responce.statusText || 'Something went wrong!'}`)
    }

    return responce.json();
  }
}