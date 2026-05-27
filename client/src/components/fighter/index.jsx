import { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography, Chip } from '@mui/material';

export default function Fighter({ fightersList, onFighterSelect, selectedFighter }) {
    const [value, setValue] = useState('');

    const handleChange = (event) => {
        const fighter = fightersList.find((f) => f.id === event.target.value) || null;
        setValue(event.target.value);
        onFighterSelect(fighter);
    };

    return (
        <Box sx={{ p: 2, flex: 1 }}>
            <FormControl fullWidth size="small">
                <InputLabel>Select Fighter</InputLabel>
                <Select value={value} label="Select Fighter" onChange={handleChange}>
                    <MenuItem value=""><em>None</em></MenuItem>
                    {fightersList.map((f) => (
                        <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            {selectedFighter && (
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">{selectedFighter.name}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={`Power: ${selectedFighter.power}`} color="error" size="small" />
                        <Chip label={`Defense: ${selectedFighter.defense}`} color="primary" size="small" />
                        <Chip label={`Health: ${selectedFighter.health}`} color="success" size="small" />
                    </Box>
                </Box>
            )}
        </Box>
    );
}
