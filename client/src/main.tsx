import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./styles/index.css";
import {ThemeProvider} from "@/theme";
import {Provider} from "react-redux";
import {CookiesProvider} from "react-cookie";
import store from "@/store";



ReactDOM.createRoot(document.getElementById("root")!).render(
    <CookiesProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Provider store={store}>
                <App/>
            </Provider>
        </ThemeProvider>
    </CookiesProvider>
);