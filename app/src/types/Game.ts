import { Fruit, isFruit } from './Fruit';
import { Player, isPlayer } from './Player';

export interface Game {
  id: number;
  players: Player[];
  fruit: Fruit;
  width: number;
  height: number;
}

export function isGame(value: unknown): value is Game {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Game).id === 'number' &&
    Array.isArray((value as Game).players) &&
    (value as Game).players.every(isPlayer) &&
    isFruit((value as Game).fruit)
  )
}
