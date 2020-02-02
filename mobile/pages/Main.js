import React, { useState,useEffect } from 'react';
import { StyleSheet, Image, View, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {requestPermissionsAsync, getCurrentPositionAsync} from 'expo-location';
import MultiSelect from 'react-native-multiple-select';
import api from '../services/api';

function Main({navigation}) {
    const [currentRegion, setCurrentRegion] = useState(null);
    const [multiSelect, setMultiSelect] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isHidden, setIsHidden] = useState(false);

    useEffect(()=> { 
        async function loadInitialPosition() { 
            const { granted } = await requestPermissionsAsync();

            if(granted) {
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true
                });

                const {latitude, longitude } = coords;

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                })

                let searchFor = {
                    techs: [],
                    longitude: longitude,
                    latitude: latitude
                }
                searchUser(searchFor);
            }
        }
        loadInitialPosition();
    },[])

    if(!currentRegion) {
        return null;
    }

    async function searchUser(searchFor) {
        try {
            setIsHidden(false);
            const usersList = await api.post("/users", searchFor);
            console.log(usersList); 
            setUsers(usersList.data);
            setIsHidden(true);
        } catch(e) {
            console.log(e);
        }
    }

    function onSelectedItemsChange(selectedItems) {
        setSelectedItems(selectedItems);

        let searchFor = {
            techs: selectedItems,
            longitude: currentRegion.longitude,
            latitude: currentRegion.latitude
        }
        searchUser(searchFor);
    };
    
    const items = [{
        id:'ReactJS',
        name:'ReactJS'
    },{
        id:'React Native',
        name:'React Native'
    },{
        id:'VueJS',
        name:'VueJS'
    },{
        id:'PHP',
        name:'PHP'
    },{
        id:'Angular',
        name:'Angular'
    },{
        id:'Python',
        name:'Python'
    }];

    return (
    <>
    <MapView initialRegion={currentRegion} style={{ flex:1 }}>
        {users.map(user => (
        <Marker key={user._id} coordinate={{ latitude: user.location.coordinates[1], longitude: user.location.coordinates[0] }}>
            <Image style={styles.avatar} source={{ uri: user.avatar_url }} />

            <Callout onPress={() => {
                navigation.navigate('Profile', { github_user: user.username });
            }}>
                <View style={styles.callout}>
                    <Text style={styles.userName}>{user.username}</Text>
                    <Text style={styles.userBio}>{user.bio != null ? user.bio : '(sem bio)'}</Text>
                    <View style={{flexDirection: 'row',height:'auto'}}>
                    {user.techs.map(tech => (
                        <Text key={user._id+"_"+tech} style={styles.tech}>{tech}</Text>
                    ))}
                    </View>
                </View>
            </Callout>
        </Marker>
        ))}
    </MapView>

    <View style={[styles.loading, isHidden ? styles.loadingHide:{} ]} >
        <View style={styles.loadingIcon}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Carregando...</Text>
        </View>
    </View>
    
    <View style={styles.searchBox}>
        <View style={styles.multiSelectBox}>
            <MultiSelect
            hideTags
            items={items}
            uniqueKey="id"
            onChangeInput={searchUser}
            onSelectedItemsChange={onSelectedItemsChange}
            ref={(component) => { setMultiSelect(component) }}
            selectedItems={selectedItems}
            selectText="Escolha as tecnologias"
            searchInputPlaceholderText="Procurar..."
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            selectedItemTextColor="green"
            selectedItemIconColor="green"
            itemTextColor="#000"
            displayKey="name"
            submitButtonColor="#000"
            submitButtonText="Fechar"
            styleInputGroup={{ paddingTop: 10, paddingBottom: 10, paddingRight: 20 }}
            styleMainWrapper={styles.searchWrapper}
            styleDropdownMenuSubsection={styles.searchInput}
            />
        </View>
        <KeyboardSpacer topSpacing={40} />
    </View>

    </>
    )
} 

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },
    loadingHide: {
        width: 0,
        height: 0,
    },
    loadingIcon: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingText: {
        fontSize: 16,
        marginTop: 10,
        color: '#FFFFFF'
    },
    tech: {
        backgroundColor: '#000000',
        color: '#FFFFFF',
        padding: 3,
        fontSize: 12, 
        borderRadius: 5,
        marginTop: 3,
        marginRight: 3
    },
    multiSelectBox: {
        flex: 1,
        marginLeft: 0,
        backgroundColor: 'transparent'
    },
    searchBox: { 
        flex: 1,
        position: 'absolute',
        left: 15,
        right: 15,
        bottom: 10,
        zIndex: 5,
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },
    searchWrapper: {
        backgroundColor: 'transparent'
        
    },
    searchInput: {
        flex: 1,
        paddingLeft: 15,
        borderRadius: 10,
        padding: 0,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4
        },
        backgroundColor: '#FFFFFF',
        elevation: 2,
    },
    loadButton: {
        width: 40,
        height: 40,
        elevation: 2,
        backgroundColor: '#000',
        borderRadius: 34,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4
        },
        elevation: 2,
    }, 
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 54,
        borderWidth: 1,
        borderColor: '#FFF'
    },
    callout: {
        width: 260
    },
    userName: {
        fontWeight: 'bold'
    }
});

export default Main;