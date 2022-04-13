import { renderToString } from "react-dom/server";

const Greet = () => <h1>Hello, world!</h1>;
console.log(renderToString(<Greet />));
