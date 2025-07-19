import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function humanizeSize(bytes) {
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log2(Number(bytes)) / 10);
  return (Number(bytes) / 1024 ** i).toFixed(1) + sizes[i];
}

export function mimeToExt(mime) {
  const ext = mime.split("/")[1]?.split("+")[0];
  return ext ? ext.toUpperCase() : "";
}

export function secondsUntil({ now, futureDate }) {
  const diff = futureDate.getTime() - now.getTime();
  return Math.max(0, Math.floor(diff / 1000));
}

export function createUTCDate({ dateUTCStr, timeStr }) {
  const date = new Date(dateUTCStr);
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);

  date.setUTCHours(
    date.getUTCHours() + hours,
    date.getUTCMinutes() + minutes,
    date.getUTCSeconds() + seconds,
  );

  return date;
}

export function isWithinWeek({ now, later }) {
  const diffMs = later.getTime() - now.getTime();
  const weekInMs = 7 * 24 * 60 * 60 * 1000;

  return diffMs <= weekInMs;
}

export function humanizeDate(date) {
  const adjustedDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat("en-EN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(adjustedDate);
}
