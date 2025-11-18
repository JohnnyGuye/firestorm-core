import { ChangeDetectionStrategy, Component } from "@angular/core";
import { PlaygroundSection } from "../pg-section";
import { PlaygroundSectionComponent } from "@components/playground-section";
import { MatButtonModule } from "@angular/material/button";
import { Achievement, User } from "@modules/phasmophobia/models";
import { PlaygroundModelMarkdownComponent } from "@components/playground-model-markdown";

@Component({
    selector: 'firestorm-pg-section-achievements',
    imports: [
        PlaygroundSectionComponent,
        MatButtonModule,
        PlaygroundModelMarkdownComponent
    ],
    template: `
<firestorm-playground-section [title]="'Achievements'">

    <button description mat-flat-button (click)="fetchAll()">
        <span>Fetch the datas</span>
    </button>

    <p description>
        ...
    </p>

    <firestorm-playground-model-markdown description [data]="achievements" [repo]="achievementsRepository"></firestorm-playground-model-markdown>
    <firestorm-playground-model-markdown description [data]="users" [repo]="usersRepository"></firestorm-playground-model-markdown>

</firestorm-playground-section>
`,
    changeDetection: ChangeDetectionStrategy.Default
})
export class PgSectionAchievementsComponent extends PlaygroundSection {

    protected get achievementsRepository() {
        return this.firestormService.achievementsRepository
    }

    protected get usersRepository() {
        return this.firestormService.usersRepository
    }

    achievements: Achievement[] = []

    users: User[] = []

    async fetchAll() {
        await this.fetchAchievements()
        await this.fetchUsers()
    }

    async fetchAchievements() {
        
        const achievements = await this.achievementsRepository.getAllAsync()

        this.achievements = achievements
        
    }

    async fetchUsers() {

        const users = await this.usersRepository.getAllAsync()

        this.users = users

    }

}