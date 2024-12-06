import { PhasmoEntity } from "./entity"

function createEntity(modify: (entity: PhasmoEntity)=> void): PhasmoEntity {
  const entity = new PhasmoEntity()
  modify(entity)
  return entity
}

export const GHOST_ENTITIES = [

  createEntity((entity) => {
    entity.name = "Banshee"
    entity.evidences = ['ghost_orb', 'uv', 'dots']
  }),
  createEntity((entity) => { 
    entity.name = "Demon"
    entity.evidences = ['freezing', 'uv', 'writing']
  }),
  createEntity((entity) => {
    entity.name = "Mare"
    entity.evidences = ['ghost_orb', 'spirit_box', 'writing']
  }),
  createEntity((entity) => {
    entity.name = "Revenant"
    entity.evidences = ['ghost_orb', 'freezing', 'writing']
    entity.baseSpeed = 1
  })
  
]
