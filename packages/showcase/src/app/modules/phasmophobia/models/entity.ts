import { Collection } from "@jiway/firestorm-core";

export const EVIDENCES = ['ghost_orb', 'emf_5', 'freezing', 'uv', 'writing', 'dots', 'spirit_box'] as const
export type Evidences = typeof EVIDENCES[number]

/**
 * Represents the blueprint for a ghost entity in phasmophobia
 */
@Collection({ collection: 'playgrounds/phasmophobia/entities' })
export class PhasmoEntity {

  /**
   * Id of the entity
   */
  id: string = ""

  /**
   * Name of the entity
   */
  name: string = ""

  /**
   * Evidences the entity provides as its signature
   */
  evidences: Evidences[] = []

  /**
   * Base speed of the entity (in m/s)
   */
  baseSpeed: number = 1.7
  
}