import "./style.css";

const component = () => {
	const div = document.createElement("div");
	div.innerText = "hello world";
	return div;
};

document.body.appendChild(component());
