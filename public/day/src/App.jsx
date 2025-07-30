// Steps for building with React: Component Tree, static content, styling and interactivity
// This App.jsx file is the main entry point for the React application(It's like the main thing).
import Grid from "./components/Grid";
import Layout from "./components/Layout";
import Hero from './components/Hero';

// Communication between different components is done using Properties.
// There are 2 types: Attribute Style and Children Style.
// Attribute Style is when you pass data as attributes to the component, like <MyComponent title="Welcome" count={5} />
// Children Style is when you pass data as children to the component, like <MyComponent><

function App() {
    return (
        <Layout>
            <main>
                <Hero />
                 {/* Grid component to display workout cards */}
                <Grid /> {/* Self closing tag*/}
            </main>
        </Layout>
    )
}
export default App 