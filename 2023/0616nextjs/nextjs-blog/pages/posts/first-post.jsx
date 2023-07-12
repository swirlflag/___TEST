import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import Layout from "../../components/layout";
import Alert from "../../components/Alert";

const FirstPost = () => {
	return (
		<>
			<Layout>
				<Head>
					<title>first</title>
				</Head>
				<Script
					src="https://connect.facebook.net/en_US/sdk.js"
					strategy="lazyOnload"
					onLoad={() =>
						console.log(
							`script loaded correctly, window.FB has been populated`
						)
					}
				/>
				<Alert type="success">alert texst</Alert>
				<h1>First Post</h1>
				<Link href="/">go home</Link>
				<br />
				<Image
					src="/image/image.png"
					width="408"
					height="351"
					alt="test"
				/>
			</Layout>
		</>
	);
};
export default FirstPost;
