import '../App.css';
import React, {useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import {useNavigate} from "react-router-dom";
import LoginDialog from './LoginDialog';

export default function WelcomePage(){

    const navigate = useNavigate();
    
    const handleRegisterClick = () => {
        navigate('/register');
    };

    const [dialogOpen, setDialogOpen] = useState(false);

    const dialogClickOpen = () => {
        setDialogOpen(true);
    };

    const dialogClose = () => {
        setDialogOpen(false);
    };


    return(
        <div className='welcome-main'>
            <div className='header'>
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
            
            <div className='full-screen-image'>
                <br/><br/><br/>
                <div className='top-card'>

                    <Card sx={{ maxWidth: 500, backgroundColor: 'transparent', borderColor: 'transparent'  }} variant='outlined'>

                        <CardContent>
                            <Typography gutterBottom variant="h3" className="animated-text" sx={{fontFamily:'serif'}}>
                                Let Your Voice Be Heard
                            </Typography>
                            <Typography variant="h1" color='black' className='txt' sx={{fontFamily:'serif'}}>
                            Vote Now!
                            </Typography>
                            <Button size="large" variant="contained" color='error' onClick={handleRegisterClick}>Register</Button>
                            <Button size="large" variant='outlined' sx={{marginLeft:2}} href="#info-head">Learn More</Button>
                        </CardContent>
                    </Card>
                </div>                
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