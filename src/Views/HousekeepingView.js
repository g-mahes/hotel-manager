import React, { useContext, useEffect, useState } from 'react'
import { MainContext } from '../MainContext';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import TextField from "@mui/material/TextField";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'




function HousekeepingView() {
    const [isLoading, setIsLoading] = useState(true); // loading
    const [idFilter, setidFilter] = useState(""); // filter
    const [roomsObject, setRoomsObject] = useState({});
    const [isChecked, setIsChecked] = useState(false);

    const { housekeepingView, setHousekeepingView, firestone } = useContext(MainContext);
    const collectionRef = firestone.collection('room');

    useEffect(() => {
        getRoomObject();
    }, []);


    // method to get Room Collection from Firestone
    const getRoomObject = () => {
        collectionRef.get().then((querySnapshot) => {
            let data = {}
            querySnapshot.forEach((doc) => {
                data[doc.id] = doc.data();
            });
            console.log(data);
            setRoomsObject(data);
            setIsLoading(false);
        });
    }

    // method to post updated Room Object back to Firestore
    const sendCheckedCleaned = (index) => {
        setIsChecked(!isChecked);
        if (roomsObject[index]["Cleaned"] === "Not Cleaned") {
            roomsObject[index]["Cleaned"] = "Cleaned";
        }
        else {
            roomsObject[index]["Cleaned"] = "Not Cleaned";
        }
        const docRef = collectionRef.doc(index);
        docRef.set(roomsObject[index], { merge: true })
            .then(() => {
                console.log(`Document  updated successfully!`);
            })
            .catch((error) => {
                console.error(`Error updating document : `, error);
            });
    }

    // method to set the room type after selecting from dropdown
    const sendRoomType = (index, value) => {
        let newObject = roomsObject[index];
        newObject["Type"] = value;
        setRoomsObject((prevState) => ({ ...prevState, [index]: newObject }));
        const docRef = collectionRef.doc(index);
        docRef.set(roomsObject[index], { merge: true })
            .then(() => {
                console.log(`Document  updated successfully!`);
            })
            .catch((error) => {
                console.error(`Error updating document : `, error);
            });
    }

    // method to filter room numbers based on search
    const filteredData = (filter) => {
        return Object.keys(roomsObject).filter((id) => {
            return (
                roomsObject[id]["Room Number"].toString().includes(filter.toString())
            );
        });
    };


    if (isLoading && Object.keys(roomsObject).length == 0) {
        return (
            <div>Loading...</div>
        )
    }
    else {
        let filteredRoomList = filteredData(idFilter); // get filtered data
        return (
            <div style={{ backgroundColor: "#edf1fc", borderRadius: "5px" }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '2%' }}>
                    <Button size="small" color="primary" style={{ borderRadius: '3px', marginTop: '2%', backgroundColor: 'lightblue', padding: '1%' }}
                        onClick={() => setHousekeepingView(!housekeepingView)}
                    >Back to Home</Button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: '5%' }}>
                    <TextField
                        placeholder="Search Room Number"
                        value={idFilter}
                        onChange={(e) => setidFilter(e.target.value)}
                        data-tut="reactour__filter"
                        style={{ padding: '1em' }}
                    />
                </div>
                <div style={{ marginTop: '2%', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', rowGap: '10px', columnGap: '10px', marginBottom: '10%' }}>
                    {
                        Object.keys(filteredRoomList).map((key, index) => {

                            return (
                                <Card sx={{ width: 275, margin: '1em' }} style={{ backgroundColor: "lightsteelblue", marginTop: '1%' }}>
                                    <CardContent>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="h4">
                                                {roomsObject[filteredRoomList[key]]["Room Number"]}
                                            </Typography>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: "5%" }}>
                                            <Typography variant="h6" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10%' }}>
                                                Type:
                                            </Typography>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Select</InputLabel>
                                                <Select
                                                    labelId="typeSelect"
                                                    id="demo-simple-select"
                                                    value={roomsObject[filteredRoomList[key]]["Type"]}
                                                    label="Select"
                                                    onChange={(e) => { sendRoomType(filteredRoomList[key], e.target.value) }}
                                                    style={{ marginRight: '5%' }}
                                                >
                                                    <MenuItem value={"Stay Over"}>Stay Over</MenuItem>
                                                    <MenuItem value={"Checkout"}>Checkout</MenuItem>
                                                    <MenuItem value={"Weekly"}>Weekly</MenuItem>
                                                    <MenuItem value={"New Customer"}>New Customer</MenuItem>
                                                    <MenuItem value={"Rent Due"}>Rent Due</MenuItem>
                                                    <MenuItem value={"None"}>None</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: "5%" }}>
                                            <FormGroup>
                                                <FormControlLabel control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }} checked={roomsObject[filteredRoomList[key]]["Cleaned"] === "Cleaned"}
                                                    onChange={() => { sendCheckedCleaned(filteredRoomList[key]) }}
                                                />} label="Cleaned" />
                                            </FormGroup>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })
                    }
                </div>
            </div >


        )
    }
}

export default HousekeepingView
