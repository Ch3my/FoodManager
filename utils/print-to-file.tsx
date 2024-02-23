import { shareAsync } from 'expo-sharing';
import * as Print from 'expo-print';

export const printToFile = async (html: string) => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html });
    // console.log('File has been saved to:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };