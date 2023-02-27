import { Box, Typography } from "@mui/material";

type Props = {};

function NoPlannerOverlay({}: Props) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100%"
      textAlign="center"
    >
      <Box>
        <Typography variant="h4">No planner selected</Typography>
        <Typography variant="body1">
          Please select a planner to view its transactions
        </Typography>
      </Box>
    </Box>
  );
}

export default NoPlannerOverlay;
