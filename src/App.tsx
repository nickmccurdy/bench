import { useState } from "react";
import Bench, { Fn } from "tinybench";
import initialValues from "./initialValues.json";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const AsyncFunction = (async () => {}).constructor as new (
	...args: string[]
) => Fn;

function isNotNull(value: unknown): value is NonNullable<unknown> {
	return value !== null;
}

export default function App() {
	const [{ name, tasks }, setState] = useState(initialValues);
	const isValid = new Set(tasks.map((task) => task.name)).size === tasks.length;
	const [results, setResults] = useState(
		new Array<Record<string, string | number>>(),
	);

	return (
		<>
			<h1>Bench</h1>
			<form
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				onSubmit={async (event) => {
					event.preventDefault();

					const bench = new Bench();

					for (const { name, source } of tasks) {
						bench.add(name, new AsyncFunction(source));
					}

					await bench.warmup();
					await bench.run();

					setResults(bench.table().filter(isNotNull));
				}}
			>
				<button
					type="button"
					onClick={() => {
						setState(initialValues);
					}}
				>
					Reset
				</button>
				<br />

				<h2>Name</h2>
				<input
					value={name}
					onChange={(event) => {
						setState(({ tasks }) => ({ name: event.target.value, tasks }));
					}}
				/>

				<h2>Tasks</h2>
				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Source</th>
							<th />
						</tr>
					</thead>

					<tbody>
						{tasks.map((task, index) => (
							<tr key={index}>
								<td>
									<input
										value={task.name}
										onChange={(event) => {
											setState(({ name, tasks }) => ({
												name,
												tasks: [
													...tasks.slice(0, index),
													{ ...tasks[index], name: event.target.value },
													...tasks.slice(index + 1),
												],
											}));
										}}
									/>
								</td>

								<td>
									<textarea
										value={task.source}
										onChange={(event) => {
											setState(({ name, tasks }) => ({
												name,
												tasks: [
													...tasks.slice(0, index),
													{ ...tasks[index], source: event.target.value },
													...tasks.slice(index + 1),
												],
											}));
										}}
									/>
								</td>

								<td>
									<button
										type="button"
										onClick={() => {
											setState(({ name, tasks }) => ({
												name,
												tasks: [
													...tasks.slice(0, index),
													...tasks.slice(index + 1),
												],
											}));
										}}
									>
										X
									</button>
								</td>
							</tr>
						))}
					</tbody>

					<tfoot>
						<tr>
							<td colSpan={3}>
								<button
									className="fluid"
									type="button"
									onClick={() => {
										setState(({ name }) => ({
											name,
											tasks: [...tasks, { name: "", source: "" }],
										}));
									}}
								>
									Add
								</button>
							</td>
						</tr>
					</tfoot>
				</table>

				{!isValid && <p>Task names must be unique</p>}
				<button type="submit" disabled={!isValid}>
					Run
				</button>

				{results.length ? (
					<>
						<h2>Results</h2>
						<table>
							<thead>
								<tr>
									{Object.keys(results[0]).map((key) => (
										<th key={key}>{key}</th>
									))}
								</tr>
							</thead>

							<tbody>
								{results.map((result) => (
									<tr key={result["Task Name"]}>
										{Object.entries(result).map(([key, value]) => (
											<td key={key}>{value}</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</>
				) : null}
			</form>

			<p>
				<a href="https://github.com/nickmccurdy/bench">Source on GitHub</a>
			</p>
		</>
	);
}
