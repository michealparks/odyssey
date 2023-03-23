export const randomPointOnCircle = (radius: number, start = 0, end = 2 * Math.PI): [number, number] => {
  const angle = start + Math.random() * (end - start)
  const x = radius * Math.cos(angle)
  const y = radius * Math.sin(angle)
  return [x, y]
}
