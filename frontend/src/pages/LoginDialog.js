// FormDialog.js
import React, {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import EmailIcon from '@mui/icons-material/Email';
import Box from '@mui/material/Box';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockIcon from '@mui/icons-material/Lock';
import {IconButton, InputAdornment } from '@mui/material';
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';




function LoginDialog(props) {
    axios.defaults.withCredentials = true
    const navigate = useNavigate();
    const { isOpen, handleClose } = props;
    const [password,setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [email,setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    
    const handleCloseBackdrop = () => {
      setOpenBackdrop(false);
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const login = () => {

        axios.post('http://localhost:5000/login', {
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
                setAlertMessage('');
                
            }

        })
        .catch(error => {
            console.error('Error:', error);
        });

    };


    return (
        <Dialog
        open={isOpen}
        onClose={handleClose}
        >
        {/* <DialogTitle>Login</DialogTitle> */}
        <DialogContent sx = {{height: 250, width: 250}}>
            <br/>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                <b>LOGIN</b>
                </Typography>
                <div>
                    <Divider  sx={{height: 4, width: 145}} color="red"/>
                </div>
            </CardContent>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <EmailIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                <TextField required id="standard-required" label="Email" variant="standard" value = {email} onChange={(e) => {setEmail(e.target.value); setEmailError(false);}} error={emailError} helperText={emailError ? 'Email is required' : ''}/>
                
            </Box>
            <Box sx={{display: 'flex', alignItems: 'flex-end', marginTop:1 }}>
                <LockIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                <TextField required id="standard-required" label="Enter Password" value = {password} onChange={(e) => {setPassword(e.target.value)}} variant="standard" type={showPassword ? 'text' : 'password'}
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
            {alertOpen && (
                <Alert severity="error" sx={{ marginTop: 2 }} onClose={handleCloseAlert}>
                {alertMessage}
                </Alert>
            )}
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" onClick={login}>Login</Button>
        </DialogActions>
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
                        {"Login Successful"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                        <Alert severity="success" sx={{ marginTop: 2 }} onClose={handleCloseAlert}>
                                        Logged in Successfully, Redirecting to your dashboard!
                        </Alert>
                        <Typography variant="body1">
                                Redirecting in 3 seconds
                        </Typography>
                        </DialogContentText>
                    </DialogContent>

                </Dialog>

            </div>
        </Dialog>

        
    );
}

export default LoginDialog;
