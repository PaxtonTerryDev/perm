export function logObject(object: Object, name?: string, dividers: boolean = true) {
  if (dividers) console.log("------------------------")
  if (name) console.log(`${name}:`)
  console.dir(object, { depth: null });
  if (dividers) console.log("------------------------")
}
