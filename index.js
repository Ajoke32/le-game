import { app } from "./app.js";

const port = 3333;
app.listen(port, () => {
  console.log(`listening on http://localhost:${port}/`);
});

export { app };
