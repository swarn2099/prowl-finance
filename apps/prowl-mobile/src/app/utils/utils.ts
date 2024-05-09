import * as auth0 from 'react-native-auth0';

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

export const fetchCredentials = async () => {
  try {
    const credentials: any = await auth0.useAuth0().getCredentials();
    console.log('Access Token:', credentials.accessToken);
    console.log('ID Token:', credentials.idToken);
    console.log('Full Credentials:', credentials);
  } catch (error) {
    console.error('Failed to retrieve credentials:', error);
  }
};
