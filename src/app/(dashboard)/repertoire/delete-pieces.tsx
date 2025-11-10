"use client";

import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useDisclosure } from "@heroui/use-disclosure";

import { Trash } from "lucide-react";

import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";

import type { FC } from "react";

const RemovePieces: FC<{
  title: string;
  musicBrainzId: string;
  composer: string;
  arrangement: string | null;
}> = ({ title, musicBrainzId, composer, arrangement }) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const router = useRouter();

  const { mutate, isPending } = api.repertoire.removePiece.useMutation({
    onSuccess: () => {
      router.refresh();
      addToast({
        title: `Successfully removed "${title}" from the repertoire.`,
        color: "success",
      });
      onClose();
    },
  });

  function handleDelete() {
    mutate({
      musicBrainzId,
    });
  }

  return (
    <>
      <Button isIconOnly color="danger" onPress={onOpen}>
        <Trash size={16} />
      </Button>
      <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Remove piece</ModalHeader>
          <ModalBody>
            <p>
              Remove <span className="font-bold">{title}</span>
              {arrangement ? ` (${arrangement})` : ""} by{" "}
              <span className="font-bold">{composer}</span> from your
              repertoire?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleDelete}
              isLoading={isPending}
            >
              Ok
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RemovePieces;
