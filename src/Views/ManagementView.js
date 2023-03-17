import React, { useContext, useEffect, useState } from 'react'
import { MainContext } from '../MainContext';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import BuildIcon from '@mui/icons-material/Build';

import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

import MaintenanceDialog from './MaintenanceDialog';

import rooms from '../Data/rooms.json'


function ManagementView() {
    const [isLoading, setIsLoading] = useState(true); // loading
    const [idFilter, setidFilter] = useState(""); // filter
    const [roomsObject, setRoomsObject] = useState({});
    const [cleanedCheck, setCleanedCheck] = useState(false); // cleaned checkbox
    const [maintenanceDialogue, setMaintenanceDialogue] = useState(false);
    const [currentKey, setCurrentKey] = useState(-1); // key for maintenance dialog
    const [maintenanceChecked, setMaintenanceChecked] = useState(false);

    const { managementView, setManagementView, firestone } = useContext(MainContext);
    const collectionRef = firestone.collection('room');

    useEffect(() => {
        getRoomObject();
    }, []);

    const sendTestPayload = () => {
        Object.keys(rooms).map((index) => {
            const docRef = collectionRef.doc(index);
            docRef.set(rooms[index], { merge: true })
                .then(() => {
                    console.log(`Document  updated successfully!`);
                })
                .catch((error) => {
                    console.error(`Error updating document : `, error);
                });
        })

    }

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

    // method to send the maintenance notes
    const sendMaintenanceNotes = (index, value) => {
        let newObject = roomsObject[index];
        newObject["Maintenance Notes"] = value;
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

    // method to filter room numbers based on clean status
    const filteredClean = (filteredObject) => {
        return Object.keys(filteredObject).filter((id) => {
            return (
                roomsObject[filteredObject[id]]["Cleaned"] === "Cleaned"
            );
        });
    };

    // method to filter room numbers based on maintenance records being present
    const filteredMaintenanceRecords = (filteredObject) => {
        return Object.keys(filteredObject).filter((id) => {
            return (
                roomsObject[filteredObject[id]]["Maintenance Notes"] != ""
            );
        });
    };


    const openMaintenanceDialog = (key) => {
        setMaintenanceDialogue(true);
        setCurrentKey(key);
    }
    if (isLoading && Object.keys(roomsObject).length == 0) {
        return (
            <div>Loading...</div>
        )
    }
    else {
        let filteredRoomList = filteredData(idFilter); // get filtered data
        if (cleanedCheck) {
            filteredRoomList = filteredClean(filteredRoomList)
        }
        if (maintenanceChecked) {
            filteredRoomList = filteredMaintenanceRecords(filteredRoomList)
        }
        return (
            <div style={{ backgroundColor: "#edf1fc", borderRadius: "5px" }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '2%' }}>
                    <Button size="small" color="primary" style={{ borderRadius: '3px', marginTop: '2%', backgroundColor: 'lightblue', padding: '1%', marginLeft: 'auto' }}
                        onClick={() => setManagementView(!managementView)}
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
                    <FormGroup>
                        <FormControlLabel control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }} checked={cleanedCheck}
                            onChange={() => { setCleanedCheck(!cleanedCheck) }}
                        />} label="Cleaned Rooms" />
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }} checked={maintenanceChecked}
                            onChange={() => { setMaintenanceChecked(!maintenanceChecked) }}
                        />} label="Maintenance Rooms" />
                    </FormGroup>
                </div>
                <div style={{ marginTop: '2%', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', rowGap: '10px', columnGap: '10px', marginBottom: '10%', }}>
                    {
                        Object.keys(filteredRoomList).map((key, index) => {
                            return (
                                <Card sx={{ width: 275, margin: '1em' }} style={{ backgroundColor: "lightsteelblue", marginTop: '5%' }}>
                                    <CardContent>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="h4">
                                                {roomsObject[filteredRoomList[key]]["Room Number"]}
                                            </Typography>
                                            <Typography variant="h6" color={roomsObject[filteredRoomList[key]]["Cleaned"] === "Cleaned" ? "green" : "red"} style={{ display: 'flex', alignItems: 'center' }}>
                                                {(roomsObject[filteredRoomList[key]]["Cleaned"])}
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
                                        {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: "5%" }}>
                                            <Typography variant="h6" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10%' }}>
                                                Status:
                                            </Typography>
                                            <Typography variant="h6" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10%' }}>
                                                {(roomsObject[filteredRoomList[key]]["Cleaned"])}
                                            </Typography>

                                        </div> */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: "5%" }}>
                                            <Typography variant="h6" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                Maintenance:
                                            </Typography>
                                            <Button size="small" color="primary" style={{ borderRadius: '3px', marginTop: '2%', marginRight: '10%', backgroundColor: 'lightblue', padding: '1em' }}
                                                onClick={() => openMaintenanceDialog(filteredRoomList[key])}
                                            >Notes</Button>

                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })
                    }
                    {maintenanceDialogue &&
                        <MaintenanceDialog
                            maintenanceDialogue={maintenanceDialogue}
                            setMaintenanceDialogue={setMaintenanceDialogue}
                            currentKey={currentKey}
                            roomsObject={roomsObject}
                            setRoomsObject={setRoomsObject}
                            sendMaintenanceNotes={sendMaintenanceNotes}
                        />
                    }
                </div>
            </div >
        )
    }
}

export default ManagementView