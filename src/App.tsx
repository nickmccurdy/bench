import { useState } from "react";
import Bench from "tinybench";
import initialValues from "./initialValues.json";

export default function App() {
	const [{ name, tasks }, setState] = useState(initialValues);
	const isValid = new Set(tasks.map((task) => task.name)).size === tasks.length;

	return (
		<>
			<h1>Bench</h1>
			<form
				onSubmit={async (event) => {
					event.preventDefault();

					const bench = new Bench();

					for (const { name, source } of tasks) {
						bench.add(name, new Function(source) as () => unknown);
					}

					await bench.run();

					console.table(
						bench.tasks.map(({ name, result }) => ({
							"Task Name": name,
							/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
							"Average Time (ps)": result?.mean! * 1000,
							"Variance (ps)": result?.variance! * 1000,
							/* eslint-enable @typescript-eslint/no-non-null-asserted-optional-chain */
						})),
					);
				}}
			>
				<button type="button" onClick={() => setState(initialValues)}>
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
			</form>

			<p>
				<a href="https://github.com/nickmccurdy/bench">Source on GitHub</a>
			</p>
		</>
	);
}
