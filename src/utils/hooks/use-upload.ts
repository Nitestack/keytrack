"use client";

import { useCallback, useState } from "react";

import axios from "axios";

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export function useScoreUpload() {
  const [progress, setProgress] = useState<UploadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadPdf = useCallback(async (musicBrainzId: string, file: File) => {
    setIsUploading(true);
    setError(null);
    setProgress({ loaded: 0, total: file.size, percentage: 0 });

    const formData = new FormData();
    formData.append("musicBrainzId", musicBrainzId);
    formData.append("type", "pdf");
    formData.append("file", file);

    try {
      await axios.post("/api/uploads/score", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total ?? file.size;
          const loaded = progressEvent.loaded;
          const percentage = Math.round((loaded / total) * 100);

          setProgress({
            loaded,
            total,
            percentage,
          });
        },
      });

      setProgress({ loaded: file.size, total: file.size, percentage: 100 });
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.error ?? err.message)
        : "Upload failed";
      setError(message);
      throw new Error(message);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const uploadImages = useCallback(
    async (musicBrainzId: string, files: File[]) => {
      setIsUploading(true);
      setError(null);

      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      setProgress({ loaded: 0, total: totalSize, percentage: 0 });

      const formData = new FormData();
      formData.append("musicBrainzId", musicBrainzId);
      formData.append("type", "images");
      files.forEach((file) => formData.append("files", file));

      try {
        await axios.post("/api/uploads/score", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total ?? totalSize;
            const loaded = progressEvent.loaded;
            const percentage = Math.round((loaded / total) * 100);

            setProgress({
              loaded,
              total,
              percentage,
            });
          },
        });

        setProgress({ loaded: totalSize, total: totalSize, percentage: 100 });
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? (err.response?.data?.error ?? err.message)
          : "Upload failed";
        setError(message);
        throw new Error(message);
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  return {
    uploadPdf,
    uploadImages,
    progress,
    isUploading,
    error,
  };
}
