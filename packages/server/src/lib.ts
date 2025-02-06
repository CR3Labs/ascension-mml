/**
 * Check if a point is inside a cube. Useful for validating if a user is actually in the correct location.
 *
 * @param point
 * @param center
 * @param size
 * @returns
 */
export function isPointInCube(
  point: { x: number; y: number; z: number },
  center: { x: number; y: number; z: number },
  size: number,
) {
  const halfSize = size / 2;

  return (
    point.x >= center.x - halfSize &&
    point.x <= center.x + halfSize &&
    point.y >= center.y - halfSize &&
    point.y <= center.y + halfSize &&
    point.z >= center.z - halfSize && // Check z coordinate
    point.z <= center.z + halfSize // Check z coordinate
  );
}
