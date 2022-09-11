export function objKeys<O extends object>(o: O): Array<keyof O> {
  return Object.keys(o) as Array<keyof O>
}
export function objEntries<O extends object, K extends keyof O>(
  o: O
): [K, O[K]][] {
  return Object.entries(o) as [K, O[K]][]
}
export function objValues<O extends object>(o: O) {
  return Object.values(o) as Array<O[keyof O]>
}
