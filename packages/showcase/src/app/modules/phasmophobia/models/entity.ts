import { Collection, Ignore } from "@jiway/firestorm-core";

export const EVIDENCES = ['ghost_orb', 'emf_5', 'freezing', 'uv', 'writing', 'dots', 'spirit_box'] as const
export type Evidences = typeof EVIDENCES[number]

@Collection({ collection: 'entity' })
export class PhasmoEntity {

  @Ignore()
  id: string = ""

  name: string = ""

  evidences: Evidences[] = []

  baseSpeed: number = 1.7
  
}