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

import rooms from '../Data/rooms.json'


function MaintenanceDialog(props) {
    const { maintenanceDialogue, setMaintenanceDialogue, currentKey, roomsObject, sendMaintenanceNotes } = props;
    return (
        <div>
            <Dialog
                open={maintenanceDialogue}
                onClose={() => setMaintenanceDialogue(false)}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <DialogContentText>
                        Maintenance Notes
                    </DialogContentText>
                    <BuildIcon ></BuildIcon>
                </DialogContent>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button size="small" color="primary" style={{ borderRadius: '3px', marginTop: '2%', backgroundColor: 'lightblue', padding: '1em', width: "5%" }}
                        onClick={() => sendMaintenanceNotes(currentKey, "")}
                    >Clear</Button>
                </div>
                <TextField
                    placeholder="Notes"
                    value={roomsObject[currentKey]["Maintenance Notes"]}
                    onChange={(e) => sendMaintenanceNotes(currentKey, e.target.value)}
                    data-tut="reactour__filter"
                    style={{ padding: '1em' }}
                    multiline
                    rows={4}
                />
            </Dialog>
        </div>




    )
}

export default MaintenanceDialog