import { useState } from "react"
import Button from "../../components/button"
import Input from "../../components/input"
import { Navigate, useNavigate } from "react-router-dom"

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

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        console.log('data :>> ', data);
        e.preventDefault()
        const res = await fetch(`http://localhost:8000/api/${isSignInPage ? 'login' : 'register'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (res.status === 400) {
            alert('Please fill all required fields')
        } else {
            const resData = await res.json()
            if (resData.token) {
                localStorage.setItem('user:token', resData.token)
                localStorage.setItem('user:detail', JSON.stringify(resData.user))
                navigate('/')
            }
        }
    }

    return (
        <div className="bg-light h-screen flex items-center justify-center">
            <div className="bg-white w-[600px] h-[800px] shadow-lg rounded-lg flex flex-col justify-center items-center">
                <div className="text-4xl font-extrabold">Bienvenue {isSignInPage && 'de retour'}</div>
                <div className="text-xl font-light mb-14">{isSignInPage ? 'Bon retour' : 'Inscrit toi pour commencer'}</div>
                <form className="flex flex-col items-center w-full" onSubmit={(e) => handleSubmit(e)}>
                    {!isSignInPage && <Input label="Full name" name="name" placeholder="Entrer votre nom" className="mb-6 w-[50%]" value={data.fullName} onChange={(e) => setData({ ...data, fullName: e.target.value })} />}
                    <Input label="Email address" name="email" type="email" className="mb-6 w-[50%]"
                        placeholder="Entrer votre email"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })} />
                    <Input label="password" name="password" className="mb-14 w-[50%]"
                        placeholder="Entrer votre mot de passe"
                        value={data.password}
                        onChange={(e) => setData({ ...data, password: e.target.value })} />
                    <Button label={isSignInPage ? 'Connection' : 'Inscription'} className="w-1/2 mb-2" type="submit" />
                </form>
                <div>
                    {isSignInPage ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
                    <span className='text-primary cursor-pointer underline' onClick={() => { navigate(`/users/${isSignInPage ? 'sign_up' : 'sign_in'}`) }}>
                        {isSignInPage ? 'Inscription' : 'Connexion'}
                    </span>.
                </div>

            </div >
        </div>
    )
}

export default Form