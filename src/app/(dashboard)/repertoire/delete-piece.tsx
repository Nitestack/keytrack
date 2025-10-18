"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";

import DeleteIcon from "@mui/icons-material/Delete";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useSnackbar } from "notistack";

import { api } from "~/trpc/react";

import type { FC } from "react";

const RemovePiece: FC<{
  title: string;
  musicBrainzId: string;
  composer: string;
  arrangement: string | null;
}> = ({ title, musicBrainzId, composer, arrangement }) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate, isPending } = api.repertoire.removePiece.useMutation({
    onSuccess: () => {
      router.push("/repertoire");
      enqueueSnackbar(`Successfully removed "${title}" from the repertoire.`, {
        variant: "success",
      });
      handleClose();
    },
  });

  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }

  function handleDelete() {
    mutate({
      musicBrainzId,
    });
  }

  return (
    <>
      <IconButton color="error" onClick={handleOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog fullWidth open={open} onClose={handleClose}>
        <DialogTitle>Remove piece</DialogTitle>
        <DialogContent>
          Remove <span className="font-bold">{title}</span>
          {arrangement ? ` (${arrangement})` : ""} by{" "}
          <span className="font-bold">{composer}</span> from your repertoire?
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleDelete} loading={isPending}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RemovePiece;
