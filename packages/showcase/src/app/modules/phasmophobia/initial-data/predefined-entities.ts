import { PhasmoEntity } from "../models/entity"

function createEntity(modify: (entity: PhasmoEntity)=> void): PhasmoEntity {
  const entity = new PhasmoEntity()
  modify(entity)
  return entity
}

export const GHOST_ENTITIES = [

  createEntity(entity => {
    entity.name = "Banshee"
    entity.evidences = ['ghost_orb', 'uv', 'dots']
    entity.baseSpeed = 1.7
    entity.huntSanityThreshold = 50
  }),
  createEntity(entity => { 
    entity.name = "Demon"
    entity.evidences = ['freezing', 'uv', 'writing']
    entity.baseSpeed = 1.7
    entity.huntSanityThreshold = 70
  }),
  createEntity(entity => {
    entity.name = "Mare"
    entity.evidences = ['ghost_orb', 'spirit_box', 'writing']
    entity.huntSanityThreshold = 60
  }),
  createEntity(entity => {
    entity.name = "Revenant"
    entity.evidences = ['ghost_orb', 'freezing', 'writing']
    entity.baseSpeed = 1
  }),
  createEntity(entity => {
    entity.name = "Deogen"
    entity.evidences = ['spirit_box', 'writing', 'dots']
    entity.baseSpeed = 0.4
    entity.huntSanityThreshold = 40
  }),
  createEntity(entity => {
    entity.name = "Djinn"
    entity.evidences = ['emf_5', 'uv', 'freezing']
  }),
  createEntity(entity => {
    entity.name = "Spirit"
    entity.evidences = ['emf_5', 'spirit_box', 'writing']    
  }),
  createEntity(entity => {
    entity.name = "Ghost"
    entity.evidences = ['spirit_box', 'uv', 'dots']
  }),
  createEntity(entity => {
    entity.name = "Goryo"
    entity.evidences = ['emf_5', 'uv', 'dots']
  }),
  createEntity(entity => {
    entity.name = "Hantu"
    entity.evidences = ['ghost_orb', 'uv', 'freezing']
    entity.baseSpeed = 1.4
  }),
  createEntity(entity => {
    entity.name = "Twins"
    entity.evidences = ['emf_5', 'spirit_box', 'freezing']
    entity.baseSpeed = 1.5
  }),
  createEntity(entity => {
    entity.name = "Mimic"
    entity.evidences = ['uv', 'spirit_box', 'freezing']
    entity.baseSpeed = 1.5
  }),
  createEntity(entity => {
    entity.name = "Moroï"
    entity.evidences = ['writing', 'spirit_box', 'freezing']
    entity.baseSpeed = 1.5
  }),
  createEntity(entity => {
    entity.name = "Myling"
    entity.evidences = ['writing', 'emf_5', 'uv']
  }),
  createEntity(entity => {
    entity.name = "Obake"
    entity.evidences = ['ghost_orb', 'emf_5', 'uv']
  }),
  createEntity(entity => {
    entity.name = "Shade"
    entity.evidences = ['writing', 'emf_5', 'freezing']
    entity.huntSanityThreshold = 35
  }),
  createEntity(entity => {
    entity.name = "Oni"
    entity.evidences = ['dots', 'emf_5', 'freezing']
  }),
  createEntity(entity => {
    entity.name = "Onryo"
    entity.evidences = ['spirit_box', 'ghost_orb', 'freezing']
    entity.huntSanityThreshold = 60
  }),
  createEntity(entity => {
    entity.name = "Poltergeist"
    entity.evidences = ['spirit_box', 'uv', 'writing']
  }),
  createEntity(entity => {
    entity.name = "Raiju"
    entity.evidences = ['emf_5', 'ghost_orb', 'dots']
  }),
  createEntity(entity => {
    entity.name = "Wraith"
    entity.evidences = ['emf_5', 'spirit_box', 'dots']
  }),
  createEntity(entity => {
    entity.name = "Thaye"
    entity.evidences = ['ghost_orb', 'writing', 'dots']
    entity.huntSanityThreshold = 75
    entity.baseSpeed = 2.75
  }),
  createEntity(entity => {
    entity.name = "Yokai"
    entity.evidences = ['ghost_orb', 'spirit_box', 'dots']
  }),
  createEntity(entity => {
    entity.name = "Yurei"
    entity.evidences = ['ghost_orb', 'freezing', 'dots']
  })
]
