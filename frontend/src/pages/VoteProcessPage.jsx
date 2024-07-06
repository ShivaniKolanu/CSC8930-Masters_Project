import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import LinearProgress from '@mui/material/LinearProgress';
import { ethers } from "ethers";
import { useState } from "react";
import VotingPage from './VotingPage';


const steps = ['Email Verification', 'Face Recognition', 'Submit your vote'];


export default function VoteProcessPage() {


    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const isStepOptional = (step) => {
        return step === 3;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [openSnackBarError, setOpenSnackBarError] = React.useState(false);
    const [emailSent, setEmailSent] = React.useState(false);
    const [entered_otp, OTPVerify] = React.useState('');

    const [alertMessage, setAlertMessage] = React.useState('');
    const [verified, setVerified] = React.useState(false);
    const [recStart, setRecStart] = React.useState(false);
    const [recSuccess, setRecSuccess] = React.useState(false);
    const [recFailed, setRecFailed] = React.useState(false);
    const [verifiedFace, setVerifiedFace] = React.useState(false);

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBar(false);
        setOpenSnackBarError(false);
    };

    const verifyEmail = () => {

        axios.post(`http://localhost:5000/email_verify`, {

            withCredentials: true,


        },
            { withCredentials: true })
            .then(response => {

                if (response.status === 200) {
                    setAlertMessage(response.data.message);
                    setOpenSnackBar(true);
                    setEmailSent(true);


                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

    };

    const checkOTP = () => {

        axios.post(`http://localhost:5000/otp_verify`, {
            entered_otp: entered_otp,
            credentials: 'include'

        },
            { withCredentials: true },
        )
            .then(response => {

                if (response.status === 201) {
                    setAlertMessage(response.data.error);
                    setOpenSnackBarError(true);

                } else if (response.status === 200) {
                    setAlertMessage(response.data.message);
                    setOpenSnackBar(true);
                    setVerified(true);
                }
                else {
                    setAlertMessage('');

                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

    };



    const recognizeFace = async () => {
        setRecStart(true);
        setRecFailed(false);
        setRecSuccess(false);

        const response = await axios.post('http://localhost:5000/recognizer_face_dl');

        if (response.status === 200) {
            setRecStart(false);
            setRecSuccess(true);
            setVerifiedFace(true);

            // navigate("/welcome");
        } else if (response.status === 500) {
            alert("Not Working!");
        } else if (response.status === 201) {
            setRecStart(false);
            setRecFailed(true);


        }
    };

    async function connectToMetamask() {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                setProvider(provider);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const address = await signer.getAddress();
                setAccount(address);
                console.log("Metamask Connected : " + address);
                setIsConnected(true);

                // canVote();
            } catch (err) {
                console.error(err);
            }
        } else {
            console.error("Metamask is not detected in the browser")
        }

    }

    return (
        <Box sx={{ width: '70%', marginLeft: 25, marginRight: 25, marginTop: 5 }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (isStepOptional(index)) {
                        labelProps.optional = (
                            <Typography variant="caption">Optional</Typography>
                        );
                    }
                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {
                activeStep === 0 &&
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>


                    <div className='email-details-container'>

                        <div className='email-details-img'>

                            <img src={require('../assets/email-verify.png')} alt='email-details' />

                        </div>

                        <div className='email-details'>

                            <Alert severity="info">To continue voting, please verify your account first.</Alert> <br />
                            <Button size="medium" variant='contained' onClick={verifyEmail}>Verify Your Email</Button>
                            <br /><br />
                            {
                                emailSent &&
                                <div>
                                    <TextField id="outlined-basic" label="Enter OTP" variant="outlined" value={entered_otp} onChange={(e) => { OTPVerify(e.target.value) }} />
                                    <Button size="small" variant='contained' sx={{ marginLeft: 4, marginTop: 1.5 }} color='error' onClick={checkOTP}>Submit</Button>

                                </div>
                            }
                        </div>

                        <Snackbar
                            open={openSnackBar}
                            autoHideDuration={5000}
                            onClose={handleCloseSnackBar}>

                            <Alert
                                onClose={handleCloseSnackBar}
                                severity="success"
                                variant="filled"
                                sx={{ width: '100%' }}
                            >
                                {alertMessage}
                            </Alert>
                        </Snackbar>

                        <Snackbar
                            open={openSnackBarError}
                            autoHideDuration={5000}
                            onClose={handleCloseSnackBar}>

                            <Alert
                                onClose={handleCloseSnackBar}
                                severity="error"
                                variant="filled"
                                sx={{ width: '100%' }}
                            >
                                {alertMessage}
                            </Alert>
                        </Snackbar>





                    </div>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        {isStepOptional(activeStep) && (
                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                Skip
                            </Button>
                        )}
                        {/* disabled={!verified} */}
                        <Button onClick={handleNext} disabled={!verified} >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </React.Fragment>
            }
            {
                activeStep === 1 &&
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                    <Alert severity="info" >Ensure that you are positioned in an area illuminated with adequate lighting.</Alert>

                    <div className='face-rec-container'>


                        <div className='face-rec-img'>

                            <img src={require('../assets/face_rec_5.gif')} alt='face-rec' />

                        </div>

                        <div className='face-rec'>

                            <Tooltip title="Images will be captured solely for voting purposes and will not be utilized or disclosed elsewhere." placement="top" arrow>
                                <FormControlLabel
                                    required
                                    control={<Checkbox sx={{ marginLeft: 4, size: 'x-small', fontSize: 'x-small' }} />}
                                    sx={{ fontSize: 'small' }}
                                    label={<Typography variant="body3">Please review and accept the terms and conditions to proceed.</Typography>}
                                />
                            </Tooltip>
                            <br />
                            <Button size="medium" variant='contained' onClick={recognizeFace} sx={{ marginTop: 3 }}>Recognize Face</Button>
                            <br />
                            {
                                recStart && recStart === true &&

                                <div>
                                    {recStart}
                                    <LinearProgress sx={{ marginTop: 3 }} color='warning' />
                                    <Alert severity="warning" sx={{ width: 200, marginTop: 2, marginLeft: 18 }}>Recognition in Progress</Alert>
                                </div>

                            }

                            {
                                recSuccess &&
                                <div>
                                    <Alert severity="success" sx={{ width: 430, marginTop: 2, marginLeft: 8 }}>Recognition is successful, Please continue to the next step!</Alert>

                                </div>
                            }

                            {
                                recFailed &&

                                <div>
                                    <Alert severity="error" sx={{ width: 430, marginTop: 2, marginLeft: 8 }}>Recognition is Failed, Please try again!</Alert>

                                </div>

                            }

                        </div>

                    </div>



                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        {/* <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                    >
                    Back
                    </Button> */}
                        <Box sx={{ flex: '1 1 auto' }} />
                        {isStepOptional(activeStep) && (
                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                Skip
                            </Button>
                        )}
                        {/* disabled={!verifiedFace} */}
                        <Button onClick={connectToMetamask} disabled={!verifiedFace} >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </React.Fragment>
            }
            {
                activeStep === 2 &&
                <React.Fragment>
                    <br />
                    {/* <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography> */}
                    {
                        isConnected &&
                        <VotingPage />
                    }
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        {/* <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                    >
                    Back
                    </Button> */}
                        <Box sx={{ flex: '1 1 auto' }} />
                        {isStepOptional(activeStep) && (
                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                Skip
                            </Button>
                        )}

                        <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </React.Fragment>
            }
            {activeStep === steps.length &&
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                        {/* <Button onClick={handleNext}>
                    {activeStep === steps.length ? 'Finish' : 'Next'}
                </Button> */}
                    </Box>
                </React.Fragment>
            }
        </Box>
    );

}