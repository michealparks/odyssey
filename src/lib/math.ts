export const randomPointOnCircle = (radius: number, start = 0, end = 2 * Math.PI): [number, number] => {
  const angle = start + Math.random() * (end - start)
  const x = radius * Math.cos(angle)
  const y = radius * Math.sin(angle)
  return [x, y]
}

export const summation = (start: number, end: number) => {
  let sum = 0

  for (let i = start; i <= end; i += 1) {
    sum += i
  }

  return sum
}
