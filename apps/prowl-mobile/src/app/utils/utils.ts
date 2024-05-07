export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  // Function to append the ordinal suffix to the day number
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  const parts = formattedDate.split(' ');
  const day = parseInt(parts[1]);
  const ordinalDay = `${day}${getOrdinalSuffix(day)}`;

  return `${parts[0]} ${ordinalDay}`; // e.g., May 5th
};
