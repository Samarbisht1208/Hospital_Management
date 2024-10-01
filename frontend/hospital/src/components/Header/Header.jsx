import React from 'react';

const Header = ({ group }) => {
    let header = null
    if (group){
        if (group[0] == 1){
            header = 'Doctor'
        } else {
            header = 'Patient'
        }
    }
    return (
        <header className="header">
            <h1>{group ? `Welcome Our ${header}` : 'Please Login First'}</h1>
        </header>
    );
};

export default Header;
