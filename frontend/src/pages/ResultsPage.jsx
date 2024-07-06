import { useEffect, useState } from "react";
import { contractAbi, contractAddress } from "../constant/constant";
import { ethers } from "ethers";
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, Card, CardContent, Dialog, Grid } from "@mui/material";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import { BarChart } from '@mui/x-charts/BarChart';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { PieChart } from '@mui/x-charts/PieChart';


export default function ResultsPage() {

    const navigate = useNavigate();
    useEffect(() => {

        getCandidates();
        getCandidatesData();

    }, []);



    const [provider, setProvider] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [data, setData] = useState([]);
    const [candidatesData, setCandidatesData] = useState(null);
    const [barData, setBarData] = useState([]);
    const [pieData, setPieData] = useState([]);

    useEffect(() => {
        if (candidatesData && data.length > 0) {
            BarChartData(data);

        }
    }, [candidatesData, data]);

    useEffect(() => {
        if (candidatesData && data.length > 0) {
            PieChartData(data);

        }
    }, [candidatesData, data]);

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
                    data.sort((a, b) => a.candidate_id - b.candidate_id);
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
                id: candidate.id.toNumber(),
                voteCount: candidate.voteCount.toNumber()
            }
        });
        setCandidates(formattedCandidates);

        Progress(formattedCandidates);
        // console.log(formattedCandidates);
        // if (formattedCandidates.length > 0 && candidatesData.length > 0){
        //     BarChartData(formattedCandidates);
        // }

        if (data.length > 0) {
            BarChartData(data);
        }


    }



    function BarChartData(dataAvailable) {
        // console.log(dataAvailable[0].voteCount);
        // barData = [];
        let candidateNames = [];
        let candidateVotes = [];

        for (let i = 0; i < dataAvailable.length; i++) {
            // console.log(candidatesData[i].candidate_name); // Output candidate names to console
            candidateNames.push(candidatesData[i].candidate_name); // Add candidate names to the array
            candidateVotes.push(dataAvailable[i].voteCount);
        }

        // Assign the array of candidate names to barData['candidateName']
        barData['candidateNames'] = candidateNames;
        barData['candidateVotes'] = candidateVotes;

        console.log(barData);




    }

    function PieChartData(dataAvailable) {


        const newData = [];
        for (let i = 0; i < dataAvailable.length; i++) {
            const item = {
                id: i,
                value: dataAvailable[i].voteCount,
                label: candidatesData[i].candidate_name // Generating label as series A, series B, etc.
            };
            newData.push(item);
        }
        setPieData(newData);

        console.log(newData);
    }



    function LinearProgressWithLabel(props) {
        return (

            <Box sx={{ display: 'flex', alignItems: 'center' }}>

                <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress color="tertiary" variant="determinate" {...props} sx={{ height: 12 }} />
                </Box>
                <Box sx={{ minWidth: 30 }}>
                    <Typography variant="body2" color="text.secondary">{`${Math.round(
                        props.value,
                    )}%`}</Typography>
                </Box>
            </Box>
        );
    }

    LinearProgressWithLabel.propTypes = {
        /**
         * The value of the progress indicator for the determinate and buffer variants.
         * Value between 0 and 100.
         */
        value: PropTypes.number.isRequired,
    };

    function Progress(data) {
        let full_votes = 0;

        for (let i = 0; i < data.length; i++) {

            full_votes = full_votes + data[i]['voteCount'];
        }

        for (let i = 0; i < data.length; i++) {
            const percentage = Math.round((data[i]['voteCount'] * 100) / full_votes);
            data[i].percentage = percentage;
        }


        setData(data);
        // BarChartData(data);
    };


    function getColorForPercentage(percentage, candidatesData) {
        if (!candidatesData || candidatesData.length === 0) {
            return "warning"; // Return a default color if candidatesData is empty or undefined
        }

        // Extract an array of percentages from candidatesData
        const percentages = candidatesData.map(candidate => candidate.percentage);

        // Remove any NaN values from the percentages array
        const validPercentages = percentages.filter(value => !isNaN(value));

        // Check if there are valid percentages
        if (validPercentages.length === 0) {
            return "warning"; // Return a default color if there are no valid percentages
        }

        const highestPercentage = Math.max(...validPercentages);
        const lowestPercentage = Math.min(...validPercentages);

        if (percentage === highestPercentage) {
            return "success"; // Green color for the highest percentage
        } else if (percentage === lowestPercentage) {
            return "error"; // Red color for the lowest percentage
        } else {
            return "warning"; // Yellow color for other percentages
        }
    }

    function home() {
        navigate('/welcome');
    }
    const [chartDialogOpen, setChartDialogOpen] = useState(false);
    const [piechartDialogOpen, setPieChartDialogOpen] = useState(false);

    const chartDialogClickOpen = () => {
        setChartDialogOpen(true);
    };

    const piechartDialogClickOpen = () => {
        setPieChartDialogOpen(true);
    };



    const chartDialogClose = () => {
        setChartDialogOpen(false);
        setPieChartDialogOpen(false);
    };


    return (

        <div style={{ background: '#f5f5f5' }}>
            <br />
            <h2 style={{ fontFamily: '"Georgia", serif' }}>Spotlight on the Results</h2>
            <div className="results-head">
                <div className="results-alert">
                    <Alert severity="success" variant="filled" sx={{ maxWidth: 500, marginLeft: 5 }}>You have voted successfully. Thank you for your support!</Alert>

                </div>
                <Button onClick={chartDialogClickOpen}>Visualize - BarChart</Button>
                <Button onClick={piechartDialogClickOpen}>Visualize - PieChart</Button>

            </div>
            <Dialog open={piechartDialogOpen} onClose={chartDialogClose} maxWidth="lg">
                <DialogTitle id="alert-dialog-title">
                    {"Visualization of Results - PieChart"}
                </DialogTitle>
                <DialogContent>
                    <PieChart
                        series={[
                            {
                                data: pieData,
                                highlightScope: { faded: 'global', highlighted: 'item' },
                                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            },
                        ]}
                        width={600}
                        height={200}
                    />
                </DialogContent>
            </Dialog>
            <Dialog open={chartDialogOpen} onClose={chartDialogClose} maxWidth="xl">
                <DialogTitle id="alert-dialog-title">
                    {"Visualization of Results - BarChart"}
                </DialogTitle>
                <DialogContent>
                    <BarChart
                        xAxis={[
                            {
                                id: 'barCategories',
                                data: barData['candidateNames'],
                                scaleType: 'band',
                            },
                        ]}
                        series={[
                            {
                                data: barData['candidateVotes'],
                            },
                        ]}
                        width={700}
                        height={300}
                    />

                </DialogContent>
            </Dialog>

            <Grid container spacing={2} sx={{ marginLeft: 3, marginTop: 1 }}>
                {candidatesData &&
                    data.map((candidate, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Card sx={{ maxWidth: 500, maxHeight: 120 }}>
                                <CardContent>
                                    <div className="results-container">
                                        <div className="data-img">
                                            <img src={require(`../assets/candidate_${candidatesData[index].candidate_id}.jpg`)} alt={`Candidate ${index + 1}`} />
                                        </div>
                                        <div className="data-details">
                                            <Typography variant="h5" component="div">
                                                {candidatesData[index].candidate_name}
                                            </Typography>
                                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                Votes: {candidate.voteCount}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box sx={{ width: '75%' }}>
                                                    <LinearProgress variant="determinate" value={candidate.percentage} sx={{ height: 22 }} color={getColorForPercentage(candidate.percentage, data)} />
                                                </Box>
                                                <Box sx={{ minWidth: 35, marginLeft: 1 }}>
                                                    <Typography variant="body2" color="text.secondary">{`${candidate.percentage}%`}</Typography>
                                                </Box>
                                            </Box>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
            </Grid>

            <Button variant="contained" sx={{ marginTop: 3 }} onClick={home}>Return to Home</Button>
        </div>





    );
}