import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#f1f1f1', padding: '20px 0', position: 'relative', bottom: 0, width: '100%' }}>
      <Container>
        <Typography variant="body2" color="textSecondary" align="center">
          Powered by{' '}
          <Link href="https://bro-web.ro" target="_blank" rel="noopener" color="primary">
            Bro Web
          </Link>
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center" sx={{ marginTop: 1 }}>
          &copy; {new Date().getFullYear()} Funktastika Invite App. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
