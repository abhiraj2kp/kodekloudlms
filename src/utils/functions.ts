const createQueryParams = (params: any) => {
  const newObj: any = {};
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      newObj[key] = value;
    }
  }
  return Object.entries(newObj)
    .map((e) => e.join('='))
    .join('&');
};

function secondsToHours(seconds: number) {
  if (typeof seconds !== 'number' || isNaN(seconds)) {
    return '0';
  }
  const hours = seconds / 3600;
  return Math.floor(hours * 100) / 100;
}
function capitalizeFirstChar(str: string) {
  if (typeof str !== 'string' || str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function formatSecondsToHHMMSS(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number) => String(num).padStart(2, '0');

  if (hours) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

export { createQueryParams, secondsToHours, capitalizeFirstChar, formatSecondsToHHMMSS };
