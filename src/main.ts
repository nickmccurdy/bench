import Bench from "tinybench"

const bench = new Bench()

bench
  .add("switch 1", () => {
    let a = 1
    let b = 2
    const c = a
    a = b
    b = c
  })
  .add("switch 2", () => {
    let a = 1
    let b = 10
    a = b + a
    b = a - b
    a = b - a
  })

await bench.run()

console.table(
  bench.tasks.map(({ name, result }) => ({
    "Task Name": name,
    "Average Time (ps)": result?.mean! * 1000,
    "Variance (ps)": result?.variance! * 1000,
  })),
)
