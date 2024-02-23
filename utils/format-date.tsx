export default function formatDate(date: Date): string {
    if (typeof date == "string") {
      return date
    }
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() returns zero-based index
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }