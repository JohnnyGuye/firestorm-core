import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { FirestormService } from "@modules/phasmophobia";
import { PhasmoEntity } from "@modules/phasmophobia/models";
import { MarkdownComponent, MarkdownModule } from "ngx-markdown";

@Component({
  standalone: true,
  templateUrl: 'playground.page.html',
  imports: [
    MatButtonModule,
    MarkdownModule
  ]
})
export class PlaygroundPage {

  private firestormSrv = inject(FirestormService)

  private get repo() {
    return this.firestormSrv.entityRepository
  }

  public retrievedEntities: PhasmoEntity[] = []

  public retrievedEntitiesAsJson: string = ""

  public doc: boolean = false
  public switch(doc?: boolean) {
    if (doc === undefined) doc = this.doc
    if (doc) {
      const docs = this.repo.modelsToDocuments(this.retrievedEntities)
      this.retrievedEntitiesAsJson = JSON.stringify(docs, undefined, 2)
    } else {
      const models = this.retrievedEntities
      this.retrievedEntitiesAsJson = JSON.stringify(models, undefined, 2)
    }
    this.doc = !this.doc
  }

  public async retrieveEntities() {
    
    const entities = await this.firestormSrv.entityRepository.findAllAsync()
    this.retrievedEntities = entities

    this.switch(true)

    if (entities.length) return entities

    const banshee = new PhasmoEntity()
    banshee.id = "banshee"
    banshee.name = "Banshee"
    banshee.evidences = ['ghost_orb', 'uv', 'dots']

    const demon = new PhasmoEntity()
    demon.id = "demon"
    demon.name = "Demon"
    demon.evidences = ['freezing', 'uv', 'writing']

    return await this.firestormSrv.entityRepository.createMultipleAsync(banshee, demon)
  }

  hello = 
`const entities 
  = await this.firestormSrv
              .entityRepository
              .findAllAsync()
`
}