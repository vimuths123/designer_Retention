import React from 'react'

const PreviousCht = () => {
    return (
        <>
            <button className="new-chat mt-3" id="sidebarNewChat_btn" onClick={newChatClk}>
                + New Chat
            </button>

            <div className="mt-4">
                {/* <p className="tyni-heading1 mx-3 ">Today</p> */}
                <p className="tyni-heading1 mx-3 ">Previous Chats</p>
                <ul className="text-start">
                    {userChats?.map((item, index) => (
                        <li className='hover-pointer' key={item.id} onClick={() => getOldChat(item.chatkey)}>
                            <span className="custom-li-style" key={item.id}></span> {truncateString(item.prompt, 22)}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default PreviousCht