import { ChangeDetectionStrategy, Component, inject, linkedSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { JokesOldService } from '../jokes-old.service';

const MAT_DEPS = [MatChipsModule, MatCardModule, MatListModule, MatDividerModule, MatProgressBarModule, MatButtonModule]

@Component({
  selector: 'app-home-new',
  imports: [...MAT_DEPS],
  templateUrl: './home-new.component.html',
  styleUrl: './home-new.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeNewComponent {
  #jokesService = inject(JokesOldService);

  $jokeTypes = this.#jokesService.getTypesResource();

  $activeJokeType = linkedSignal<string[] | undefined, string | undefined>({
    source: this.$jokeTypes.value,
    computation: (types) => types?.[0] || undefined,
  })

  $jokes = this.#jokesService.jokesByTypeResource(this.$activeJokeType);

  reload() {
    this.$jokes.reload();
  }
}
