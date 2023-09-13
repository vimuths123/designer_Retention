import Image from 'next/image';
import React from 'react'

const AiInput = (props) => {

    const { message, image } = props;

    return (
        <div>
            <p className="p-4">
                {message}
            </p>

            {image && (
                <Image
                    src={image}
                    className="p-2"
                    width={400}
                    height={450}
                    alt="Picture 2"
                    id="sidebar-right-img"
                />
            )}

        </div>
    )
}

export default AiInput