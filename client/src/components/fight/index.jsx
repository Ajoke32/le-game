import { useState, useEffect } from 'react';
import { Box, Button, Divider, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { getFighters } from '../../services/domainRequest/fightersRequest';
import { createFight, getFights } from '../../services/domainRequest/fightRequest';
import NewFighter from '../newFighter';
import Fighter from '../fighter';

export default function Fight() {
    const [fighters, setFighters] = useState([]);
    const [fights, setFights] = useState([]);
    const [fighter1, setFighter1] = useState(null);
    const [fighter2, setFighter2] = useState(null);
    const [isFightStarting, setIsFightStarting] = useState(false);

    useEffect(() => {
        getFighters().then((data) => {
            if (data && !data.error) {
                setFighters(data);
            }
        });
        getFights().then((data) => {
            if (data && !data.error) {
                setFights(data);
            }
        });
    }, []);

    const onCreate = (fighter) => {
        setFighters((prev) => [...prev, fighter]);
    };

    const fighter1List = fighter2 ? fighters.filter((f) => f.id !== fighter2.id) : fighters;
    const fighter2List = fighter1 ? fighters.filter((f) => f.id !== fighter1.id) : fighters;

    const getFighterName = (id) => {
        return fighters.find((fighter) => fighter.id === id)?.name || 'Unknown fighter';
    };

    const onStartFight = async () => {
        if (!fighter1 || !fighter2 || isFightStarting) {
            return;
        }

        setIsFightStarting(true);
        const data = await createFight({ fighter1: fighter1.id, fighter2: fighter2.id });

        if (data && !data.error) {
            setFights((prev) => [data, ...prev]);
        }

        setIsFightStarting(false);
    };

    return (
        <Box sx={{ mt: 4 }}>
            <NewFighter onCreated={onCreate} />
            <Paper elevation={2} sx={{ width: '70%', mx: 'auto', mt: 3, display: 'flex', alignItems: 'flex-start' }}>
                <Fighter selectedFighter={fighter1} onFighterSelect={setFighter1} fightersList={fighter1List} />
                <Divider orientation="vertical" flexItem />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, pt: 2 }}>
                    <Button variant="contained" color="secondary" disabled={!fighter1 || !fighter2 || isFightStarting} onClick={onStartFight}>
                        {isFightStarting ? 'Fighting...' : 'Start Fight'}
                    </Button>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Fighter selectedFighter={fighter2} onFighterSelect={setFighter2} fightersList={fighter2List} />
            </Paper>
            <Paper elevation={2} sx={{ width: '70%', mx: 'auto', mt: 3, p: 2 }}>
                <Typography variant="h6" gutterBottom>Fight History</Typography>
                <List dense disablePadding>
                    {fights.map((fight) => (
                        <ListItem key={fight.id} divider>
                            <ListItemText
                                primary={`${getFighterName(fight.fighter1)} vs ${getFighterName(fight.fighter2)}`}
                                secondary={`${fight.log.length} round${fight.log.length === 1 ? '' : 's'}`}
                            />
                        </ListItem>
                    ))}
                    {!fights.length && (
                        <ListItem>
                            <ListItemText primary="No fights yet" />
                        </ListItem>
                    )}
                </List>
            </Paper>
        </Box>
    );
}
