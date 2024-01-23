import { useState } from "react"
import Button from "../../components/button"
import Input from "../../components/input"

const Form = ({
    isSignInPage = true,
}) => {

    const [data, setData] = useState({
        ...(!isSignInPage && {
            fullName: ''
        }),
        email: '',
        password: ''
    })

    return (
        <div className="bg-white w-[600px] h-[800px] shadow-lg rounded-lg flex flex-col justify-center items-center">
            <div className="text-4xl font-extrabold">Bienvenue {isSignInPage && 'de retour'}</div>
            <div className="text-xl font-light mb-14">{isSignInPage ? 'Bon retour' : 'Inscrit toi pour commencer'}</div>
            <form className="flex flex-col items-center w-full" onSubmit={() => console.log('Submitted')}>
                {!isSignInPage && <Input label="Full name" name="name" placeholder="Entrer votre nom" className="mb-6" value={data.fullName} onChange={(e) => setData({ ...data, fullName: e.target.value })} />}
                <Input label="Email address" name="email" placeholder="Entrer votre email" type="email" className="mb-6" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                <Input label="password" name="password" placeholder="Entrer votre mot de passe" className="mb-14" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />
                <Button label={isSignInPage ? 'Connection' : 'Inscription'} className="w-1/2 mb-2" type="submit" />
            </form>
            <div>{isSignInPage ? 'Pas encore de compte ?' : 'Déjà un compte ?'} <span className='text-primary cursor-pointer underline'>{isSignInPage ? 'Inscription' : 'Connexion'}</span>.</div>
        </div >
    )
}

export default Form