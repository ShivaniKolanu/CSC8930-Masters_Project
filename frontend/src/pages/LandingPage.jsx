import '../App.css';
import React, { useState, useEffect } from 'react';

import axios from 'axios';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Alert, Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import {useNavigate} from "react-router-dom";



export default function LandingPage(){

    const navigate = useNavigate();

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [studentData, setStudentData] = useState(null); // State to store user data
    const [electionData, setElectionData] = useState(null);
    const [faceRegData, setFaceRegData] = useState(null);

    const [openDialog, setOpenDialog] = useState(false);
    const [load, setLoad] = useState(false);
    const [successMsg, setSuccessMsg] = useState(false);

    const handleClickOpen = () => {
        setOpenDialog(true);
      };
    
      const handleClose = () => {
        setOpenDialog(false);
      };


    useEffect(() => {

        axios.get(`http://localhost:5000/student-data`, {
            headers: {
                accept: "application/json",
            },
        },
        {withCredentials: true},
        )
        .then(response => {
            
            if(response.status === 200){
                const data = response.data.data;
                setStudentData(data);
                
            }

        })
            .catch(error => {
            console.error('Error:', error);
        });

        axios.get(`http://localhost:5000/election-details`, {
            headers: {
                accept: "application/json",
            },
        },
        {withCredentials: true},
        )
        .then(response => {
            
            if(response.status === 200){
                const data = response.data.data;
                
                setElectionData(data);
                
                
            }

        })
            .catch(error => {
            console.error('Error:', error);
        });

        axios.get(`http://localhost:5000/face_register`, {
            headers: {
                accept: "application/json",
            },
        },
        {withCredentials: true},
        )
        .then(response => {
            
            if(response.status === 200){
                const data = response.data.data;
                setFaceRegData(data);                
            }

        })
            .catch(error => {
            console.error('Error:', error);
        });



        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array to run effect only once on component mount


    const registerFace = async () => {
        setLoad(true);
        const response = await axios.post('http://localhost:5000/register_face_dl');
        if(response.status === 200){

            setSuccessMsg(true);
            setTimeout(() => {
                navigate('/welcome');
            }, 5000);

        }
    }

    const voteNow = () => {
        navigate('/vote-online');
    }


    return(
        <Box className='landing-main'>
            <Box className='landing-header'>
                <Tabs value={value} onChange={handleChange} indicatorColor="secondary">
                    <Tab label="Personal Info" />
                    <Tab label="Elections" />
                    {/* <Tab label="Face Register"  /> */}
                    <Button variant="text" sx={{height: 40, marginTop: 0.5, marginLeft: 2}} onClick={handleClickOpen}>
                        Face Register
                    </Button>
                    <Button
                        className={`rainbow rainbow-1 ${!faceRegData || !faceRegData.face_register_status ? '' : 'slide-animation'}`}
                        variant="contained"
                        sx={{ height: 40, marginLeft: 80 }}
                        onClick={voteNow}
                        disabled={!faceRegData || !faceRegData.face_register_status}
                        >
                        Vote Now!
                    </Button>

                </Tabs>
            </Box>
            <Typography component="div" role="tabpanel">
                {value === 0 && studentData && 
                    <Box p={3}>
                        <br/><br/>
                        <br/>
                        <div class="profile-page">
                            <div class="content">
                                <div class="content__cover">
                                    <div class="content__avatar"></div>
                                    <div class="content__bull"><span></span><span></span><span></span><span></span><span></span></div>
                                </div>

                                <div class="content__title" >
                                    <h1>{studentData['first_name']} {studentData['last_name']}</h1><span>Student</span>
                                </div>
                                <div class="content__description" >
                                   <b> <p>{studentData['college']} <br/>
                                   {studentData['degree']}; {studentData['program']}</p> </b>
                                    <p> <b>Email: </b> {studentData['email']} <br/>
                                    <b>DOB:</b> {studentData['dob']} <br/>
                                    <b>Eligible to vote: YES </b></p>                 
                                </div>
                            </div>
                        </div>
                    </Box>
                }
                {value === 1 && electionData &&
                    <Box p={3}>
                        {/* <h1>Elections Content</h1> */}
                        {/* {electionData[0]['elections_title']} */}
                        <br/><br/>
                        <br/>
                        <div className='election-details-container'>

                            <div className='details-img'>

                                <img src = {require('../assets/election_details.png')} alt='election-details'/>

                            </div>

                            <div className='election-details'>
                                {electionData.map((election, index) => (
                                    <Accordion key={index} defaultExpanded={index === 0}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index + 1}-content`} id={`panel${index + 1}-header`}>
                                        <div className="accordion-header">
                                            <Typography >{election['elections_title']} | {election['elections_date']}</Typography>
                                        </div>                                    
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography sx={{float:'left'}}>
                                        Election Start Time: {election['elections_start_time']} <br/>
                                        Election End Time: {election['elections_end_time']} <br/><br/>
                                        {election['info']}
                                        </Typography>
                                    </AccordionDetails>
                                    </Accordion>
                                ))}
                            </div>
                            
                        </div>
                        

                    </Box>
                }

                {
                    faceRegData && faceRegData.face_register_status &&

                    <Dialog open={openDialog} onClose={handleClose}> 
                        <DialogTitle>Face Register</DialogTitle> 
                        <DialogContent>
                        <DialogContentText>
                            Dear {studentData['first_name']} {studentData['last_name']}, <br/> 
                            Thank you for submitting your face data! <br/> Your information has been successfully submitted. You can now proceed to cast your vote, or return to the dashboard for more options. Your contribution makes a difference!
                            <br/> <br/>
                            Have an issue or want to resubmit the face data?  <Button>Reach out to us</Button>
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        
                        </DialogActions>
                    </Dialog>

                }

                {
                    faceRegData && faceRegData.face_register_status === false && 
                    <Dialog open={openDialog} onClose={handleClose} sx={{height: 'fit-content'}}>

                        <DialogTitle sx={{marginLeft: 1}}>Face Register</DialogTitle>

                        <DialogContent>

                            <Tooltip title="Images will be captured solely for voting purposes and will not be utilized or disclosed elsewhere." placement="top" arrow>
                                <FormControlLabel required control={<Checkbox sx={{marginLeft: 4}}/>} label="Please review and accept the terms and conditions to proceed." />
                            </Tooltip>                       

                            <br/>
                            <br/>
                            <Alert severity="info">Ensure that you are positioned in an area illuminated with adequate lighting.</Alert>

                            <Button onClick={registerFace} sx={{marginLeft: 25}}>Register My Face</Button>
                            <br/>
                            {load && 
                                <div>
                                    <CircularProgress sx={{marginLeft: 30}}/>
                                </div>
                                
                            }

                            {successMsg &&
                                <Alert severity='success'>
                                    Your data is successfully submitted, redirecting to the main page!
                                </Alert>

                            }

`

                        </DialogContent>

                                                                    
                    </Dialog>
                }

                
            </Typography>
        </Box>

    );
}