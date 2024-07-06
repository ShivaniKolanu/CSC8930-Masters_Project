import '../App.css';
import React, { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import PasswordIcon from '@mui/icons-material/Password';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {IconButton, InputAdornment } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {useNavigate} from "react-router-dom";
import LoginDialog from './LoginDialog';

export default function RegisterPage(){
    axios.defaults.withCredentials = true
    const navigate = useNavigate();
    const [email,setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertOpenSuccess, setAlertOpenSuccess] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [responseStatus, setResponseStatus] = useState(false);
    const [otp,setOTP] = useState('');
    const [password,setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    // 0 -> -5, 3 -> -3

 
  
    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const handleCloseBackdrop = () => {
      setOpenBackdrop(false);
    };

    const [dialogOpen, setDialogOpen] = useState(false);

    const dialogClickOpen = () => {
        setDialogOpen(true);
    };

    const dialogClose = () => {
        setDialogOpen(false);
    };


    const logInUser = () => {
        if(email.length === 0){
            setEmailError(true);
        }
        else{
            axios.post(`http://localhost:5000//set/register_send_otp`, {
                email: email,
                credentials: 'same-origin',
                withCredentials: true,
                credentials: 'include'
                
            },
            {withCredentials: true})
            .then(response => {
                if (response.status === 201) {
                  setAlertMessage(response.data.error);
                  setAlertOpen(true);
                } else if(response.status === 200){
                    setAlertMessage(response.data.message);
                    setAlertOpenSuccess(true);
                    
                    
                }
                else{
                    setAlertOpen(false); // Close the alert if request was successful
                    setAlertOpenSuccess(false);
                    setAlertMessage('');
                }
            })
              .catch(error => {
                console.error('Error:', error);
            });
       
        }
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
        setAlertOpenSuccess(false);
    };

    const checkOTP = () => {

        axios.post(`http://localhost:5000//get/verify_otp`, {
                otp: otp,
                credentials: 'include'
                
        },
        {withCredentials: true},
        )
        .then(response => {
            
            if (response.status === 201) {
                setAlertMessage(response.data.error);
                setAlertOpen(true);
            } else if(response.status === 200){
                setAlertMessage(response.data.message);
                setAlertOpenSuccess(true);
                setResponseStatus(true);
                
            }
            else{
                setAlertOpen(false); // Close the alert if request was successful
                setAlertOpenSuccess(false);
                setAlertMessage('');
                
            }
        })
            .catch(error => {
            console.error('Error:', error);
        });
        
    };

    const register = () => {

        axios.post('http://localhost:5000/register', {
                email: email,
                password: password
                
        })
        .then(response => {
            
            if (response.status === 201) {
                setAlertMessage(response.data.error);
                setAlertOpen(true);
            } else if(response.status === 200){
                setAlertMessage(response.data.message);
                // setAlertOpenSuccess(true);
                setOpenDialog(true);
                setOpenBackdrop(true);
                setTimeout(() => {
                    navigate('/main-landing');
                }, 3000);
                
            }
            else{
                setAlertOpen(false); // Close the alert if request was successful
                setAlertOpenSuccess(false);
                setAlertMessage('');
                
            }
        })
            .catch(error => {
            console.error('Error:', error);
        });
        
    };

    return(
        <div class = "register-main">

            <div className='register-header'>

                <Stack direction="row" spacing={3} sx = {{float: 'right', marginRight: 10}}>
                    <Button variant="contained" color='error' onClick={dialogClickOpen}>
                        Vote Now
                    </Button>
                    <LoginDialog isOpen={dialogOpen} handleClose={dialogClose} />
                    <Button variant="outlined" href="#contact-head">
                        Contact
                    </Button>
                    <Button variant="outlined" href="#about-head">
                        About Us
                    </Button>
                </Stack>


            </div>

            <div className='register-form'>
                <br/><br/><br/><br/><br/>

                <Card sx={{ maxWidth: 500, height:500 }} variant='outlined'>
   
                        <CardContent>
                            <Typography gutterBottom variant="h4" component="div">
                            <b>REGISTER</b>
                            </Typography>
                            <div>
                                <Divider  sx={{height: 4, width: 145, marginLeft:20}} color="red"/>
                            </div>
                        </CardContent>
                        
                        {/* eslint-disable-next-line */}
                        <a href='#'> Already have an account?</a>

                        <div className='register-internal-form'>

                            <FormControl>
                                <br/>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <EmailIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                    <TextField required id="standard-required" label="Email" variant="standard" value = {email} onChange={(e) => {setEmail(e.target.value); setEmailError(false);}} error={emailError} helperText={emailError ? 'Email is required' : ''}/>
                                    
                                </Box>
                                <Button size="small" variant='contained' onClick={logInUser} sx={{marginTop: 2, width: '100px', marginLeft:8}}>Send OTP</Button>
                                
                                <Box sx={{ visibility: alertOpen || alertOpenSuccess ? 'visible' : 'hidden' }}>
                                    {alertOpen && (
                                        <Alert severity="error" sx={{ marginTop: 2 }} onClose={handleCloseAlert}>
                                        {alertMessage}
                                        </Alert>
                                    )}
                                    {alertOpenSuccess && (
                                        <Alert severity="success" sx={{ marginTop: 2 }} onClose={handleCloseAlert}>
                                        {alertMessage}
                                        </Alert>
                                    )}
                                </Box>

                                <Box sx={{display: 'flex', alignItems: 'flex-end', marginTop:1 }}>
                                    <PasswordIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                    <TextField required id="standard-required" label="Enter OTP" value = {otp} onChange={(e) => {setOTP(e.target.value)}} variant="standard" />
                                    
                                </Box>
                                <Button size="small" variant='contained' onClick={checkOTP} sx={{marginTop: 2, width: '100px', marginLeft:8}}>Enter OTP</Button>

{/* visibility: responseStatus ? 'visible' : 'hidden', */}
                                
                                <Box sx={{visibility: responseStatus ? 'visible' : 'hidden',display: 'flex', alignItems: 'flex-end', marginTop:1 }}>
                                    <LockIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                    <TextField required id="standard-required" label="Create Password" value = {password} onChange={(e) => {setPassword(e.target.value)}} variant="standard" type={showPassword ? 'text' : 'password'}
                                    InputProps={{
                                        endAdornment: (
                                          <InputAdornment position="end">
                                            <IconButton
                                              onClick={handleTogglePasswordVisibility}
                                              edge="end"
                                            >
                                              {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                          </InputAdornment>
                                        ),
                                      }} 
                                    />
                                    
                                </Box>
                                <Button size="small" variant='contained' onClick={register} sx={{visibility: responseStatus ? 'visible' : 'hidden',marginTop: 2, width: '100px', marginLeft:8}}>Register</Button>                                
                            </FormControl>

                        </div>
                           
                        
                    </Card>
            </div>

            <div className='register-success-dialog'>
                <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                                    <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={openBackdrop}
                    onClick={handleCloseBackdrop}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                    <DialogTitle id="alert-dialog-title">
                        {"Registration Successful"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                        <Alert severity="success" sx={{ marginTop: 2 }} onClose={handleCloseAlert}>
                                        You are Registered Successfully, Redirecting to your dashboard!
                        </Alert>
                        <Typography variant="body1">
                                Redirecting in 3 seconds
                        </Typography>
                        </DialogContentText>
                    </DialogContent>

                </Dialog>

            </div>

            <div className='info'>
            {/* eslint-disable-next-line */}
                <a name = 'info-head'><h1>Features</h1></a>
                <div className='info-cards'>
                    <Card sx={{ maxWidth: 345 }} variant='outlined'>
                        <CardMedia
                            sx={{ height: 140 }}
                            image={require('../assets/ethereum.jpeg')}
                            title="green iguana"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                            Ethereum Based Technology
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                            Blockchain, as a decentralized ledger, offers transparency, anonymity, and verifiability. It serves as an incorruptible and tamper-resistant record of all votes cast, providing a robust safeguard against any attempts to compromise the integrity of the election.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Share</Button>
                            <Button size="small">Learn More</Button>
                        </CardActions>
                    </Card>

                    <Card sx={{ maxWidth: 345, marginLeft:6 }} variant='outlined'>
                        <CardMedia
                            sx={{ height: 140 }}
                            image={require('../assets/face_rec.jpg')}
                            title="green iguana"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                            Face Recognition System
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                            The system employs a two-step verification process. Firstly, users are required to undergo OTP authentication, and secondly, Face Recognition technology is employed, ensuring that only legitimate voters can participate in the electoral process.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Share</Button>
                            <Button size="small">Learn More</Button>
                        </CardActions>
                    </Card>
                    <Card sx={{ maxWidth: 345, marginLeft:6 }} variant='outlined'>
                        <CardMedia
                            sx={{ height: 140 }}
                            image={require('../assets/fast_easy.jpg')}
                            title="green iguana"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                            Faster Voting & Easy To Use
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                            The system harnesses the power of Machine Learning and other advanced analytical tools to present real-time election results. Through graphical representations and data-driven insights, it aims to enhance the transparency and accessibility of the electoral outcomes.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Share</Button>
                            <Button size="small">Learn More</Button>
                        </CardActions>
                    </Card>
                </div>
            </div>

            <div className='about' >
                {/* eslint-disable-next-line */}
                <a name = 'about-head'>

                    <h1 style={{ transform: "rotate(270deg)" }}>About</h1>
                </a>
                <div>
                    <Divider orientation="vertical" color="black"/>
                </div>
                <div className='about-data'>
                <br/>
                    <Card sx={{ maxWidth: 550}} variant='contained' >
    
                        <CardContent>
                            
                            <Typography variant="body1" color="text.secondary">
                            The Online Voting System using Blockchain provides a user-friendly interface that enables individuals from around the world 
                            to cast their votes conveniently. The platform aims to eliminate the need for physical presence, mitigating 
                            issues related to voter turnout caused by logistical constraints. By leveraging modern authentication 
                            measures, the system employs a two-step verification process. Firstly, users are required to undergo 
                            OTP authentication, and secondly, Face Recognition technology is employed, ensuring that only legitimate 
                            voters can participate in the electoral process.
                            </Typography>
                        </CardContent>

                    </Card>
                    <br/>
                </div>
                
            </div>
            <div className='contact'>
                {/* eslint-disable-next-line */}
                <a name = 'contact-head'>
                    <Card sx={{  marginTop:6}} variant='outlined'>

                        <CardContent>
                            <div className='contact-content'>
                                <Card sx={{  marginTop:6, maxWidth:300, height:200, backgroundColor:'#f5f5f5', marginLeft: 15}} variant='outlined'>
                                    <CardContent sx={{  marginTop:3, width: 200}}>
                                        <LocationOnIcon/>
                                        <Typography gutterBottom variant="h5" component="div">
                                        Address
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            55 Gilmer Street SE <br/> Atlanta, GA 30303
                                        </Typography>
                                    </CardContent>

                                </Card>

                                <Card sx={{  marginTop:6, maxWidth:300, height:200, backgroundColor:'#f5f5f5', marginLeft: 20}} variant='outlined'>
                                    <CardContent sx={{  marginTop:3, width: 200}}>
                                        <EmailIcon/>
                                        <Typography gutterBottom variant="h5" component="div">
                                        Email
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Reach us at <br/> admin@yodha.dev
                                        </Typography>
                                    </CardContent>

                                </Card>
                                <Card sx={{  marginTop:6, maxWidth:500, height:200, backgroundColor:'#f5f5f5', marginLeft: 20}} variant='outlined'>
                                    <CardContent sx={{  marginTop:3, width: 200}}>
                                        <PhoneIcon/>
                                        <Typography gutterBottom variant="h5" component="div">
                                        Phone
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Call Us at <br/> (470) 999-0245
                                        </Typography>
                                    </CardContent>

                                </Card>

                            </div>

                            
                            
                        </CardContent>

                    </Card>
                </a>
            </div>
            <div className='footer'>

                <footer>
                    <p>&copy; {new Date().getFullYear()} Yodha. All rights reserved.</p>
                </footer>

            </div>



        </div>
    );

    
}