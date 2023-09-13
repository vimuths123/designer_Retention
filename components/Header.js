import React from 'react'

const Header = ({ name, image }) => {
    return (
        <>
            <header style={{ backgroundColor: "#F7F9FF" }}>
                <div className="header p-2" style={{ backgroundColor: "#F7F9FF" }}>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="container-fluid">
                            <a className="navbar-brand" href="#">
                                <img
                                    src="/designerr-logo.png"
                                    alt="Logo"
                                    width="72%"
                                    height="auto"
                                    className="d-inline-block align-text-top"
                                />
                            </a>

                            <div
                                className="collapse navbar-collapse d-flex justify-content-end"
                                id="navbarSupportedContent"
                            >
                                <div className="d-flex justify-content-end">
                                    <img
                                        src={image}
                                        alt="Logo"
                                        width="50"
                                        height="50"
                                        className="d-inline-block align-text-top rounded-circle"
                                    />
                                    <p style={{ fontSize: 16, fontWeight: 'bold', height: 50, lineHeight: '50px', marginLeft: 10 }}>
                                        {name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>
        </>
    )
}

export default Header