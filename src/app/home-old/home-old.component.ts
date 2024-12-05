import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips'
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import { MatListModule } from '@angular/material/list';;
import { MatDividerModule } from '@angular/material/divider';
import { JokesOldService } from '../jokes-old.service';
import { IJoke } from '../interfaces/joke.interface';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject, catchError, of, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

const MAT_DEPS = [MatChipsModule, MatCardModule, MatListModule, MatDividerModule, MatProgressBarModule, MatButtonModule]

@Component({
  selector: 'app-home-old',
  imports: [AsyncPipe, ...MAT_DEPS],
  templateUrl: './home-old.component.html',
  styleUrl: './home-old.component.scss'
})
export class HomeOldComponent implements OnInit {
  #jokesService = inject(JokesOldService);
  #destoryRef = inject(DestroyRef);

  $jokeTypes = toSignal<string[]>(this.#jokesService.getJokeTypesLegacy());
  $availableJokes = signal<IJoke[]>([]);
  $isJokesLoading = signal(false);
  $errorMessage = signal('');
  activeJokeType$ = new BehaviorSubject<string | null>(null);
 
  constructor() {
    effect(() => {
      const jokeTypes = this.$jokeTypes();
      if (jokeTypes && jokeTypes.length) {
        this.activeJokeType$.next(jokeTypes[0]);
      }
    })
  }

  ngOnInit(): void {
    this.activeJokeType$.pipe(
      takeUntilDestroyed(this.#destoryRef),
      tap(() => {
        this.$isJokesLoading.set(true);
        this.$errorMessage.set('');
        this.$availableJokes.set([]);
      }),
      switchMap(type => {
        return (type
          ? this.#jokesService.getJokesByTypeLegacy(type)
          : of([])
        ).pipe(
          catchError((error) => {
            this.$errorMessage.set(error.message);
            return of([])
          }),
          tap({ complete: () => this.$isJokesLoading.set(false) }),
        )
      })
    ).subscribe({
      next: (jokes) => {
        this.$availableJokes.set(jokes);
      }
    })
  }

  reload() {
    this.activeJokeType$.next(this.activeJokeType$.value)
  }
}
