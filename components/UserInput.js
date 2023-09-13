import React from 'react'

const UserInput = (props) => {

    const { message } = props;

    return (
        <div>
            <p
                className="m-0 p-4 "
                style={{ backgroundColor: "#fff", color: "#000" }}
            >
                {message}
                
            </p>
        </div>
    )
}

export default UserInput