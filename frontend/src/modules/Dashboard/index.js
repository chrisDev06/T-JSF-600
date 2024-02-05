import React, { useEffect, useState } from 'react'
import Avatar from "../../assets/avatar.png"
import Input from '../../components/input'


const Dashboard = () => {

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')))
    const [conversations, setConversations] = useState([])
    const [messages, setMessages] = useState({})

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user:detail'))
        const fetchConversations = async () => {
            const res = await fetch(`http://localhost:8000/api/conversations/${loggedInUser?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const resData = await res.json()
            setConversations(resData)
        }
        fetchConversations()
    }, [])


    const fetchMessages = async (conversationId, user) => {
        const res = await fetch(`http://localhost:8000/api/message/${conversationId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify({ conversationId, senderId: user?.id, message: 'Hello', receiverId: '' })
        });
        const resData = await res.json()
        console.log('resdata => ', resData);
        setMessages({ messages: resData, receiver: user })
    }

    return (
        <div className='w-screen flex'>
            <div className='w-[25%] border h-screen bg-slate-100'>
                <div className='flex items-center my-8 mx-14'>
                    <div className='border border-primary p-[2px] rounded-full'>
                        <img src={Avatar} width={75} height={75} />
                    </div>
                    <div className='ml-8'>
                        <h3 className='text-2xl'>{user?.fullName}</h3>
                        <p className='text-lg font-light'>Mon compte</p>
                    </div>
                </div>
                <hr />
                <div className='ml-14 mt-6'>
                    <div className='text-primary text-lg'>Messages</div>
                    <div>
                        {
                            conversations.length > 0 ?
                                conversations.map(({ conversationId, user }) => {
                                    return (
                                        <div className='flex items-center py-8 border-b border-b-gray-300'>
                                            <div className='cursor-pointer flex items-center' onClick={() =>
                                                fetchMessages(conversationId, user)}>
                                                <div>
                                                    <img src={Avatar} width={60} height={60} />
                                                </div>
                                                <div className='ml-6'>
                                                    <h3 className='text-lg font-semibold'>{user?.fullName}</h3>
                                                    <p className='text-sm font-light text-gray-600'>{user?.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }) : <div className='text-sm text-lg font-semibold my-auto'>Pas de conversation</div>
                        }
                    </div>
                </div>
            </div>
            <div className='w-[50%] border h-screen bg-white flex flex-col items-center'>
                <div className='w-[75%] bg-slate-100 h-[80px] m-4 rounded-full flex items-center px-14 shadow-lg'>
                    <div className='cursor-pointer'><img src={Avatar} width={60} height={60} /></div>
                    <div className='ml-6 mr-auto'>
                        <h3 className='text-lg'>TrouDuCul a ruru</h3>
                        <p className='text-sm font-light text-gray-600'>online</p>
                    </div>
                    <div className='cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-phone-outgoing" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" /><path d="M15 9l5 -5" /><path d="M16 4l4 0l0 4" /></svg>
                    </div>
                </div>
                <div className='h-[75%] w-full overflow-scroll shadow-sm'>
                    <div className='p-14'>
                        {
                            messages?.messages?.length > 0 ?
                                messages.messages.map(({ message, user: { id } = {} }) => {
                                    return (
                                        <div className={`max-w-[40%] rounded-b-xl p-4  mb-6 ${id === user?.id ? 'text-white bg-primary rounded-tl-xl ml-auto' : ' bg-[#e1edff] rounded-tr-xl'} `}>
                                            {message}
                                        </div>
                                    )
                                }) : <div className='text-center text-lg font-semibold mt-24'>Pas de message</div>
                        }
                    </div>
                </div>
                <div className='p-14 w-full flex items-center'>
                    <Input
                        placeholder='Tapez un message ...'
                        className='w-[75%]'
                        inputClassName='p-4 border shadow-md rounded-full focus:ring-0 focus:border-0 outline-none'
                    />
                    <div className='ml-4 p-4 p-2 cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-send" width="30" height="30" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 14l11 -11" /><path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" /></svg>
                    </div>
                    <div className='cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-plus" width="30" height="30" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M9 12h6" /><path d="M12 9v6" /></svg>
                    </div>
                </div>
            </div>
            <div className='w-[25%] border h-screen'>

            </div>
        </div>
    )
}

export default Dashboard
