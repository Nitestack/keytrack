import { PageContainer } from "@toolpad/core/PageContainer";
import Alert from "@mui/material/Alert";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import AddPiece from "~/app/(dashboard)/repertoire/add-piece";
import { api } from "~/trpc/server";

export default async function RepertoirePage() {
  const pieces = await api.repertoire.getPieces();
  return (
    <PageContainer
      slotProps={{
        header: {
          slotProps: {
            toolbar: {
              children: <AddPiece />,
            },
          },
        },
      }}
    >
      {pieces.length > 0 ? (
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {pieces.map((piece) => (
            <ListItemButton href={`/repertoire/${piece.id}`} key={piece.id}>
              <ListItemText primary={piece.title} secondary={piece.composer} />
            </ListItemButton>
          ))}
        </List>
      ) : (
        <Alert variant="outlined" severity="info">
          Your repertoire is currently empty.
          <br />
          Click the <span className="font-bold">+ Add</span> button to get
          started.
        </Alert>
      )}
    </PageContainer>
  );
}
