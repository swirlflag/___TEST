const path = require("path");
import { defineConfig } from "vite";

export default defineConfig({
    server: {
        host: true
    },
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `
                    @import "@/styles/_preload.scss";
                `,
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./"),
		},
	},
});
