import React from 'react';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import styles from './BugsFooter.module.css';

export default function BugsFooter() {
  return (
    <div className={styles.container}>
      <Typography variant="body2">
        Showing 1 to 10 of 50 entries
      </Typography>

      <div className={styles.rightControls}>
        <Typography variant="body2">Rows per page:</Typography>
        <Select
          size="small"
          value={5}
          disabled
          className={styles.select}
        >
          <MenuItem value={5}>5</MenuItem>
        </Select>
        <Typography variant="body2">1–5 of 6</Typography>
        <IconButton size="small" disabled>
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <IconButton size="small">
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </div>
    </div>
  );
}


