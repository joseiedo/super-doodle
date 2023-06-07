export interface Player {
  id: number;
  positionY: number;
  positionX: number;
}

export function isPlayer(value: unknown): value is Player {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Player).id === 'number' &&
    typeof (value as Player).positionY === 'number' &&
    typeof (value as Player).positionX === 'number'
  );
}
