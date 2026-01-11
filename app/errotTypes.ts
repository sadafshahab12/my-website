import React from "react";

export enum ErrorVariant {
  CRITICAL = "critical",
  WARNING = "warning",
  INFO = "info",
  MAINTENANCE = "maintenance",
  SUCCESS = "success", // While rare for error pages, useful for specific flows
}

export interface ErrorAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export interface ErrorCardProps {
  title: string;
  description: string;
  code?: string | number;
  variant?: ErrorVariant;
  primaryAction?: ErrorAction;
  secondaryAction?: ErrorAction;
  supportEmail?: string;
  illustration?: React.ReactNode; // Optional custom illustration override
}
