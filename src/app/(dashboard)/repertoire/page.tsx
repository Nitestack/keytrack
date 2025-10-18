import { PageContainer } from "@toolpad/core/PageContainer";
import Alert from "@mui/material/Alert";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import Link from "next/link";

import AddPiece from "~/app/(dashboard)/repertoire/add-piece";
import DeletePiece from "~/app/(dashboard)/repertoire/delete-piece";
import RepertoireFilter from "~/app/(dashboard)/repertoire/filter";
import RepertoireGridItem from "~/app/(dashboard)/repertoire/grid-item";
import { api } from "~/trpc/server";

export default async function RepertoirePage() {
  const pieces = await api.repertoire.getPieces();

  return (
    <PageContainer
      slotProps={{
        header: {
          title: "Overview",
          slotProps: {
            toolbar: {
              children: <AddPiece />,
            },
          },
        },
      }}
    >
      {pieces.length > 0 ? (
        <RepertoireFilter
          listView={
            <List sx={{ width: "100%" }}>
              {pieces.map((piece) => (
                <ListItem
                  component={Paper}
                  secondaryAction={
                    <DeletePiece
                      musicBrainzId={piece.musicBrainzId}
                      title={piece.musicBrainzPiece.title}
                      composer={piece.musicBrainzPiece.composer.name}
                      arrangement={piece.musicBrainzPiece.arrangement}
                    />
                  }
                  key={piece.musicBrainzId}
                  sx={{
                    ":hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                  elevation={1}
                >
                  <ListItemText
                    primary={
                      <div className="flex flex-col">
                        {piece.musicBrainzPiece.title}
                        {piece.musicBrainzPiece.arrangement && (
                          <Typography variant="caption" color="text.secondary">
                            Arrangement {piece.musicBrainzPiece.arrangement}
                          </Typography>
                        )}
                      </div>
                    }
                    secondary={piece.musicBrainzPiece.composer.name}
                    slotProps={{
                      root: {
                        component: Link,
                        // @ts-expect-error link
                        href: `/repertoire/${piece.musicBrainzId}`,
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          }
          gridView={
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-2">
              {pieces.map((piece) => (
                <RepertoireGridItem
                  key={piece.musicBrainzId}
                  musicBrainzId={piece.musicBrainzId}
                  title={piece.musicBrainzPiece.title}
                  arrangement={piece.musicBrainzPiece.arrangement}
                  composer={piece.musicBrainzPiece.composer.name}
                  pdfUrl={piece.pdfUrl}
                />
              ))}
            </div>
          }
        />
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
