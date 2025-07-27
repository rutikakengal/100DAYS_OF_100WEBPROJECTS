export default function Hero() {
    return (
        <>
            {/* The content in the landing page should be engaging, should address
            the pain points and suggest solutions for it. This makes the content effective */}
            <h5>Your perfect workout companion...</h5>
            {/* OL is Ordered List, LI is List Item  */}
            <ol className="benefits-list"> 
                <li>Effective and efficient workout guide 📘</li>
                <li>Acts as your personal trainer 🏋️‍♂️</li>
                <li>Helps you track your workout 📊</li>
                <li>Aids in maintaining your consistency 📅</li>
                <li>Become a lifetime GymBro 🤝</li>
            </ol>
            <h3><b>Rules to be followed</b></h3>
            <ul className="rules-list">
                <li className="rule-item">
                    <p><b>Reps</b></p>
                    <p>Doing the right amount of repetitions comfortable for your body, following{" "} 
                       <abbr title="3 seconds down - 2 seconds pause - 3 seconds up">3-2-3 tempo</abbr></p>
                    {/* abbr tag is abbreviation tag, it underlines the content. Hovering over it displays 
                    the content embedded inside the abbreviation */}
                </li>
                <li className="rule-item">
                    <p><b>Rest Days</b></p>
                    <p>Listen to your body and take rest when necessary</p>
                </li>
                <li className="rule-item">
                    <p><b>Weight</b></p>
                    <p>Choose the weight which allows you to complete your full set in proper form. Follow <abbr title="Increase weights gradually week-by-week to stimulate muscle growth">progressive overloading</abbr> to maximize growth</p>
                </li>
                <li className="rule-item">
                    <p><b>Diet and Water</b></p> 
                    <p>A balanced diet along with emphasis on <abbr title="Ideal protein intake is 2 grams per kilogram of your bodyweight">protein intake</abbr> is required<br />
                    <abbr title="4 to 5 litres of daily water intake ensures you are hydrated properly">Water intake</abbr> is also essential for proper growth and recovery</p>
                </li>
            </ul>
            <h3><b>The Training Plan</b></h3>
            <p>This plan follows the principles of progressive overload, ensuring that you continually challenge your muscles to promote growth and strength.</p>
            <p><b><i>Push &rarr; Pull &rarr; Legs &rarr; Repeat</i></b></p> 
            {/* b is for bold, i is for italics, p is paragraph tag, "&rarr;" is for right arrow symbol*/}
            <p>This split ensures that your workout is effective and efficient, allowing for optimal recovery and muscle growth 🏆</p>
        </>
    )
}