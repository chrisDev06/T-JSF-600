import { Link } from "react-router-dom";


const Chat = () => {
    return (
        <div>
            <Link className="div_button" to="/">
                <button class="rounded-button">Quitter</button>
            </Link>
            <h1>Chat</h1>
            <textarea></textarea>
        </div>
    )
}

export default Chat;