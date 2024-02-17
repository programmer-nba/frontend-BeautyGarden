export const formatThaiDate = (isoDateString) => {
    const isoDate = new Date(Date.parse(isoDateString));
    
    if (isNaN(isoDate)) {
        // Handle invalid date string
        return "Invalid Date";
    }
    
    // Convert to Buddhist Era (BE) by adding 543 years
    const thaiYear = isoDate.getUTCFullYear() + 543;
    
    const formattedDate = isoDate.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC" // Specify the UTC time zone
    });
    
    // Construct the final formatted date in "dd/mm/yyyy" format
    const [month, day, year] = formattedDate.split('/');
    const formattedThaiDate = `${day}/${month}/${thaiYear}`;
    
    return formattedThaiDate;
}