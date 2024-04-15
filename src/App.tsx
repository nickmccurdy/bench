import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import Bench from "tinybench";
import initialValues from "./initialValues.json";

export default function App() {
	return (
		<>
			<h1>Bench</h1>
			<Formik
				initialValues={initialValues}
				validate={({ tasks }) => {
					if (new Set(tasks.map((task) => task.name)).size < tasks.length) {
						return {
							tasks: "Task names must be unique",
						};
					}
				}}
				onSubmit={async (values) => {
					const bench = new Bench();

					for (const { name, source } of values.tasks) {
						// eslint-disable-next-line no-new-func
						bench.add(name, new Function(source) as () => any);
					}

					await bench.run();

					console.table(
						bench.tasks.map(({ name, result }) => ({
							"Task Name": name,
							"Average Time (ps)": result?.mean! * 1000,
							"Variance (ps)": result?.variance! * 1000,
						})),
					);
				}}
			>
				{({ isValid, values }) => (
					<Form>
						<input type="reset" />
						<br />

						<h2>Name</h2>
						<Field name="name" />

						<h2>Tasks</h2>
						<FieldArray name="tasks">
							{({ push, remove }) => (
								<table>
									<thead>
										<tr>
											<th>Name</th>
											<th>Source</th>
											<th />
										</tr>
									</thead>

									<tbody>
										{values.tasks.map((_, index) => (
											<tr key={index}>
												<td>
													<Field name={`tasks.${index}.name`} />
												</td>

												<td>
													<Field name={`tasks.${index}.source`} as="textarea" />
												</td>

												<td>
													<button type="button" onClick={() => remove(index)}>
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
													onClick={() => push({ name: "", source: "" })}
												>
													Add
												</button>
											</td>
										</tr>
									</tfoot>
								</table>
							)}
						</FieldArray>

						<ErrorMessage name="tasks" />
						<button type="submit" disabled={!isValid}>
							Run
						</button>
					</Form>
				)}
			</Formik>

			<p>
				<a href="https://github.com/nickmccurdy/bench">Source on GitHub</a>
			</p>
		</>
	);
}
