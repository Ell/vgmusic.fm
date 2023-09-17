import React from "react";

type ProgressBarProps = {
  children?: React.ReactNode;
  currentProgress: number;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentProgress,
}) => {
  return (
    <div
      className="w-full h-full bg-gray-700"
      style={{
        background: `linear-gradient(
          to right,
          rgb(245, 245, 245) ${currentProgress}%,
          rgb(89, 89, 89) ${currentProgress}%
        )`,
      }}
    />
  );
};
