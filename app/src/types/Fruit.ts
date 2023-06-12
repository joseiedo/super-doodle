export interface Fruit {
  id: number;
  positionY: number;
  positionX: number;
}

export function isFruit(value: unknown): value is Fruit {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Fruit).id === 'number' &&
    typeof (value as Fruit).positionY === 'number' &&
    typeof (value as Fruit).positionX === 'number'
  );
}
