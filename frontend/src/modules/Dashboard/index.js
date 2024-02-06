import React, { useEffect, useState } from 'react'
import Avatar from "../../assets/avatar.png"
import Input from '../../components/input'


const Dashboard = () => {

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')) || {});
    const [conversations, setConversations] = useState([])
    const [messages, setMessages] = useState({})
    const [message, setMessage] = useState('')
    const [users, setUsers] = useState([])
    console.log('users => ', users)

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

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch(`http://localhost:8000/api/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const resData = await res.json()
            setUsers(resData)
        }
        fetchUsers()
    }, [users])

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
        setMessages({ messages: resData, receiver: user, conversationId })
    }

    const sendMessage = async (e) => {
        const res = await fetch(`http://localhost:8000/api/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                conversationId: messages?.conversationId,
                senderId: user?.id,
                message,
                receiverId: messages?.receiver?.receiverId
            })
        });
        const resData = await res.json()
        console.log('resData => ', resData);
        setMessage('')
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
                {
                    messages?.receiver?.fullName &&

                    <div className='w-[75%] bg-slate-100 h-[80px] m-4 rounded-full flex items-center px-14 shadow-lg'>
                        <div className='cursor-pointer'><img src={Avatar} width={60} height={60} /></div>
                        <div className='ml-6 mr-auto'>
                            <h3 className='text-lg'>{messages?.receiver?.fullName}</h3>
                            <p className='text-sm font-light text-gray-600'>{messages?.receiver?.email}</p>
                        </div>
                        <div className='cursor-pointer'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-phone-outgoing" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" /><path d="M15 9l5 -5" /><path d="M16 4l4 0l0 4" /></svg>
                        </div>
                    </div>
                }
                <div className='h-[75%] w-full overflow-scroll shadow-sm'>
                    <div className='p-14'>
                        {messages.messages && messages.messages.length > 0 ? (
                            messages.messages.map((messageData, index) => (
                                <div key={index} className={messageData.user.id === user?.id ? 'text-right max-w-[45%] bg-primary rounded-b-xl rounded-tl-xl ml-auto p-4 text-white mb-6' : 'max-w-[45%] bg-[#e1edff] rounded-b-xl rounded-tr-xl p-4 mb-6 text-left'}>
                                    <p>{messageData.message}</p>
                                    <p className='text-xs font-light'>{messageData.user.fullName}</p>
                                </div>
                            ))
                        ) : (
                            <div className='text-center text-lg font-semibold mt-24'>Pas de message</div>
                        )}
                    </div>
                </div>
                {
                    messages?.receiver?.fullName &&
                    <div className='p-14 w-full flex items-center'>
                        <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder='Tapez un message ...'
                            className='w-[75%]'
                            inputClassName='p-4 border shadow-md rounded-full focus:ring-0 focus:border-0 outline-none'
                        />
                        <div className={`ml-4 p-2 cursor-pointer bg-slate-100 rounded-full ${!message && 'pointer-events-none'}`} onClick={() => sendMessage()}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-send" width="30" height="30" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 14l11 -11" /><path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" /></svg>
                        </div>
                        <div className={`ml-4 p-2 cursor-pointer bg-slate-100 rounded-full ${!message && 'pointer-events-none'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-plus" width="30" height="30" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M9 12h6" /><path d="M12 9v6" /></svg>
                        </div>
                    </div>
                }
            </div>
            <div className='w-[25%] border h-screen px-8 py-16'>
                <div className='text-primary text-lg'>People</div>
                <div>
                    {
                        users.length > 0 ?
                            users.map(({ userId, users }) => {
                                console.log("user --> : ", users)
                                return (
                                    <div className='flex items-center py-8 border-b border-b-gray-300' key={userId}>
                                        <div className='cursor-pointer flex items-center' onClick={() =>
                                            fetchMessages('new', users)}>
                                            <div>
                                                <img src={Avatar} width={60} height={60} />
                                            </div>
                                            <div className='ml-6'>
                                                <h3 className='text-lg font-semibold'>{users?.fullName}</h3>
                                                <p className='text-sm font-light text-gray-600'>{users?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : <div className='text-sm text-lg font-semibold my-auto'>Pas de conversation</div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Dashboard
