import React from 'react';
import './Person.scss';

function Person(props) { 
    return (
        <li className="Person">
            <button onClick={() => props.remove(props.user._id, props.result) }>Delete</button>
            <div className='img'><img src={props.user.avatar_url} alt="Person" /></div>
            {props.user.location.coordinates[0]} {props.user.location.coordinates[1]}
            <h2>{props.user.username}</h2>
            <p>{props.user.bio == null? '(Sem bio)':props.user.bio}</p>
            <div className="techs">
                {props.user.techs.map((tech,index) => (
                    <span key={props.user._id + "_" + tech}>{tech}</span>
                ))}
            </div>
        </li>
    )
}

export default Person;