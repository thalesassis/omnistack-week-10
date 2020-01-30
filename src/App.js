import React, { useEffect, useState } from 'react';
import api from './services/api';
import Person from './Components/Person/Person';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import './App.scss';

function App() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [result, setResult] = useState('');
  const [techs, setTechs] = React.useState([]);

  const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
  }));

  const classes = useStyles();

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleChange = event => {
    setTechs(event.target.value);
  };

  const names = [
    'ReactJS',
    'React Native',
    'VueJS',
    'NodeJS',
    'PHP',
    'Angular',
    'Python'
  ];
  
  useEffect(() => {
    setUsers([]);
    async function loadUsers() {
      const getUsers = await api.get('/users');
      setUsers(getUsers.data);
    }  
    loadUsers();
  },[]);

  async function handleSubmit(e) {
    e.preventDefault();

    if(techs.length === 0) {
      setResult('At least 1 tech required.');
      return false;
    }
 
    const newUser = {
      username: username,
      techs: techs,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    } 

    const storeUser = await api.put('/user', newUser);
    setResult(storeUser.data.result);

    if(storeUser.data.success) {
      setUsers([...users,storeUser.data.storedUser]);
    }

    setUsername('');
    setLatitude('');
    setLongitude('');
    setTechs([]);
  }
    
  async function removeUser(id, result) {
    const removeUser = await api.delete('/user/'+id);
    setUsers(users.filter(user => user._id !== id));
    result(removeUser.data.result);
  } 

  console.log(process.env.APP_URL);

  return (
    <div id="app">
      <aside>
        <form onSubmit={handleSubmit}>
          <div className="input-block">
            <label htmlFor="">Github username:</label>
            <input required type="text" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          
          <div className="input-block">
            <label htmlFor="">Techs:</label>
            <Select
              labelId="demo-mutiple-chip-label"
              id="demo-mutiple-chip"
              required
              multiple
              value={techs}
              onChange={handleChange}
              input={<Input id="select-multiple-chip" />}
              renderValue={selected => (
                <div className={classes.chips}>
                  {selected.map(value => (
                    <Chip key={value} label={value} className={classes.chip} />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
          {names.map(name => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
          </div>

          <div className="input-block half">
            <label htmlFor="">Latitude:</label>
            <input required type="text" value={latitude} onChange={e => setLatitude(e.target.value)} />
          </div>
           
          <div className="input-block half fright">
            <label htmlFor="">Longitude:</label>
            <input required type="text" value={longitude} onChange={e => setLongitude(e.target.value)} />
          </div>

          <input type="submit" value="Send" />
          {result}
        </form>
      </aside>
      
      <main>
        <ul className="Persons">
          {users.map(user => (
            <Person key={user._id} user={user} remove={removeUser} result={setResult} />
          ))}        
        </ul>    
      </main>
    </div>
  ); 
}

export default App;