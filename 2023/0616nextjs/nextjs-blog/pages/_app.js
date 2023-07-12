import "../styles/globals.css";

export default function App({ Component, pageProps }) {
	console.log(1);
	return <Component {...pageProps} />;
}
