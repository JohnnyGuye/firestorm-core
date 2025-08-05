import { Achievement } from "../models";

function createAchievement(modify: (entity: Achievement) => void): Achievement {
    const achievement = new Achievement()
    modify(achievement)
    return achievement
}

export const ACHIEVEMENTS = [
    createAchievement(a => {
        a.id = "1"
        a.description = "The first achievement"
        a.name = "First!"
    }),
    createAchievement(a => {
        a.id = "2"
        a.description = "The second achievement"
        a.name = "Second"
    }),
    createAchievement(a => {
        a.id = "3"
        a.description = "Well..."
        a.name = "What is it even for?"
    }),
    createAchievement(a => {
        a.id = "4"
        a.description = "Earned at random"
        a.name = "You got it out of cheer luck"
    }),
    createAchievement(a => {
        a.id = "5"
        a.description = "Mad respect."
        a.name = "Mad respect"
    })

]