import React from "react";
import { contractAbi, contractAddress } from "../constant/constant";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContentText from '@mui/material/DialogContentText';
import { useNavigate } from "react-router-dom";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const VotingPage = (props) => {

    useEffect(() => {
        getCandidates();
        getCandidatesData();

    }, []);

    const [account, setAccount] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [provider, setProvider] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [number, setNumber] = useState('');
    const [candidatesData, setCandidatesData] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [manfiestoInfo, setManifesto] = useState(null);
    const [canName, setCandidateName] = useState(null);
    const [voted, setVoted] = useState(false);
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [load, setLoad] = useState(false);
    const navigate = useNavigate();


    const handleClickOpenDialog = (manifesto, candidate_name) => {
        setManifesto(null);
        setCandidateName(null);
        setOpenDialog(true);
        // Do something with manifesto data
        setManifesto(manifesto);
        setCandidateName(candidate_name);

    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setVoted(false);
    };


    async function vote(id) {

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contractInstance = new ethers.Contract(
                contractAddress, contractAbi, signer
            );

            // Get current gas price
            const gasPrice = await provider.getGasPrice();

            // Estimate gas limit
            const estimateGas = await contractInstance.estimateGas.vote(id);

            // Set up transaction options
            const overrides = {
                gasLimit: estimateGas.mul(2), // Multiply by 2 to ensure enough gas
                gasPrice: gasPrice,
            };

            // Sign and send transaction
            const tx = await contractInstance.vote(id, overrides);
            // need to add here
            setLoad(true);
            console.log("6");
            console.log(load);
            await tx.wait();
            console.log("7");

            // Update state
            setVoted(true);
            console.log("Set Voted");
            console.log(voted);
            setOpenBackdrop(true);

            // Redirect after a delay
            setTimeout(() => {
                navigate('/results');
            }, 3000);
        } catch (error) {
            console.error('Error while voting:', error);
        } finally {
            setLoad(false);
        }
    }

    async function getCandidatesData() {

        axios.post(`http://localhost:5000/candidates_data`, {
            elections_details_id: 1,
            credentials: 'include'

        },
            { withCredentials: true },
        )
            .then(response => {

                if (response.status === 200) {
                    const data = response.data.data;
                    setCandidatesData(data);

                }

            })
            .catch(error => {
                console.error('Error:', error);
            });

    };

    async function getCandidates() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(
            contractAddress, contractAbi, signer
        );
        const candidatesList = await contractInstance.getAllVotesofCandidates();
        const formattedCandidates = candidatesList.map((candidate, index) => {
            return {
                index: index,
                name: candidate.name,
                voteCount: candidate.voteCount.toNumber()
            }
        });
        setCandidates(formattedCandidates);
    }

    async function handleNumberChange(e) {
        setNumber(e.target.value);
    }
    const handleCloseAlert = () => {
        // setAlertOpen(false);
        setVoted(false);
    };
    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    };

    return (

        <div>
            <h2 style={{ fontFamily: '"Georgia", serif' }}>University President Election</h2>
            {candidatesData &&
                <Grid container spacing={3}>
                    {candidatesData.map((cardData, i) => (

                        <Grid item xs={12} sm={6} md={4} key={i}>
                            <Card sx={{ maxWidth: 345 }}>
                                <CardMedia
                                    component="img"
                                    alt={`candidates_${cardData.candidate_id}`}
                                    height="200"
                                    image={require(`../assets/candidate_${cardData.candidate_id}.jpg`)}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div" style={{ fontFamily: '"Lucida Handwriting", cursive' }}>
                                        {cardData.candidate_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {cardData.candidate_email} <br />
                                        Running To Be: <span style={{ color: 'blue' }} >{cardData.running_to_be}</span>
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" variant="contained" sx={{ marginLeft: 3 }} onClick={() => handleClickOpenDialog(cardData.manifesto, cardData.candidate_name)}>View Manifesto</Button>
                                    <Button size="small" variant="contained" color="error" sx={{ textAlign: 'center' }} onClick={() => vote(cardData.candidate_id - 1)}>Vote</Button>

                                </CardActions>

                            </Card>
                        </Grid>


                    ))}
                </Grid>
            }
            <BootstrapDialog
                onClose={handleCloseDialog}
                aria-labelledby="customized-dialog-title"
                open={openDialog}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title" style={{ fontFamily: 'monospace' }}>
                    {canName} - View Manifesto
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleCloseDialog}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Typography gutterBottom component="div" style={{ fontFamily: 'monospace' }}>
                        {manfiestoInfo && <ul>
                            {manfiestoInfo.split('\\n').map((line, index) => {
                                const parts = line.split(':');
                                const boldPart = parts[0].trim();
                                const restPart = parts.slice(1).join(':').trim();
                                return (
                                    <React.Fragment key={index}>
                                        {boldPart && restPart && (
                                            <li>
                                                <strong>{boldPart}</strong>: {restPart}
                                            </li>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </ul>
                        }
                    </Typography>
                </DialogContent>



            </BootstrapDialog>
            {
                load && load === true &&
                <div>
                    <Dialog open={load}>
                        <DialogTitle id="alert-dialog-title">
                            {"In Progress"}
                        </DialogTitle>
                        <DialogContent>
                            <Alert severity="warning" sx={{ marginTop: 2 }} onClose={handleCloseAlert}>
                                Voting is in progress, Please wait!
                            </Alert>
                            <CircularProgress sx={{ marginLeft: 18, marginTop: 2 }} />
                        </DialogContent>
                    </Dialog>
                </div>
            }
            {
                voted && voted === true &&
                <div className='register-success-dialog'>
                    <Dialog
                        open={voted}
                        onClose={handleCloseDialog}
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
                            {"Voted Successful"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <Alert severity="success" sx={{ marginTop: 2 }} onClose={handleCloseAlert}>
                                    Voted Successfully, Redirecting to results page!
                                </Alert>
                                <Typography variant="body1">
                                    Redirecting in 3 seconds
                                </Typography>
                            </DialogContentText>
                        </DialogContent>

                    </Dialog>

                </div>

            }


        </div>

    );


};



export default VotingPage;