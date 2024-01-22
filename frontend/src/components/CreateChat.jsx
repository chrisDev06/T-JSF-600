import { Link } from "react-router-dom";
import "./styles.css";


const CreateChat = () => {
    return (
        <div>
            <h1>CreateChat</h1>
            <input type="text" placeholder="Le nom du salon" />
            <Link className="div_button" to="/Chat">
                <button class="rounded-button">Créer</button>
            </Link>
        </div>
    )
}

export default CreateChat;