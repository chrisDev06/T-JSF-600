import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const Home = () => {
    return (
        <div>
            <Navbar />
            <div style={{ backgroundColor: 'red' }}>
                <Link className="div_button" to="/CreateChat">
                    <button class="rounded-button">Créer</button>
                </Link>
                <Link className="div_button" to="/Chat">
                    <button class="rounded-button">Rejoindre</button>
                </Link> 
            </div>
            <div style={{ backgroundColor: 'blue' }}>

            </div>
        </div>
    )

}

export default Home;