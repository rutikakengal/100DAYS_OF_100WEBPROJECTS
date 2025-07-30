// Wraps the entire app
// props is properties passed to the component 
export default function Layout(props) {
    // Declaring children, header and footer to return it directly
    const { children } = props;
    const header = (
        <header>
            <h1 className="text-gradient">Cognitive Workout Tracker</h1>
            <p><strong>The 30 days Workout Planner & Tracker</strong></p>
        </header>
    )
    const footer = (
        <footer>
            <p>Built By{" "}<a href="https://github.com/Abhishek-7504/" target="_blank">Abhishek</a><br />Styled With{" "}
            <a href="https://github.com/jamezmca/full-stack-course/blob/main/2_brogram/src/fanta.css" 
            target="_blank"> 
                FantaCSS
            </a></p>
        </footer>
    )
    return (
        <>
        {header}
        {children}
        {footer}
        </>
    )
}