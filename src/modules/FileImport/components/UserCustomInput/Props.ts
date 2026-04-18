/**
 * Iterates over a matrix of string to estimate the headers of a CSV based on the first row with all non-empty values. It iterates up to 30 rows before giving up and leaving for the user to decide.
 * @param data A matrix of strings representing the CSV data, where each inner array is a row and each string is a cell value.
 * @return The index of the estimated header row, or 1 if no such row is found. The index is 1-based, meaning the first row is considered row 1.
 */
export const estimateHeaders = (data: string[][]): number => {
    for (let i = 0; i < Math.min(30, data.length); i++) {
        const row = data[i];
        if (row.every(cell => cell !== undefined && cell !== null && cell.trim() !== "")) {
            return i + 1; // Return 1-based index
        }
    }
    return 1; // Default to 1 if no header row is found
};

/**
 * Estimates the starting line of data in a CSV by finding the first row that has at least three non-empty values after the header row. It iterates up to 30 rows after the header before giving up and defaulting to the line immediately after the header.
 * @param data A matrix of strings representing the CSV data, where each inner array is a row and each string is a cell value.
 * @param headerLine The 1-based index of the header line, which is used as a reference point for finding the data start line.
 * @return The index of the estimated data start line, or headerLine + 1 if no such row is found. The index is 1-based.
 */
export const estimateDataStartLine = (data: string[][], headerLine: number): number => {
    for (let i = headerLine; i < Math.min(headerLine + 30, data.length); i++) {
        const row = data[i];
        if (row.filter(cell => cell !== undefined && cell !== null && cell.trim() !== "").length >= 3) {
            return i + 1; // Return 1-based index
        }
    }
    return headerLine + 1; // Default to the line immediately after the header if no data start line is found
};
