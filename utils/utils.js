// utils/utils.js (updated)
// Function to filter data based on a search query
window.filterData = function(data, query, fields) {
    return data.filter(row => {
        const normalizedQuery = query.toLowerCase();
        return fields.some(field => {
            const value = row[field];

            if (typeof value === 'string') {
                return value.toLowerCase().includes(normalizedQuery);
            } else if (typeof value === 'number') {
                return value.toString().toLowerCase().includes(normalizedQuery);
            } else {
                return false; // Handle other types as needed
            }
        });
    });
}

// Function to sort data based on a given key
window.sortData = function(data, sortBy, sortOrder = 'asc') {
    return data.sort((a, b) => {
        let comparison = 0;
        const fieldA = a[sortBy];
        const fieldB = b[sortBy];

        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
            comparison = fieldA.localeCompare(fieldB);
        } else {
            comparison = fieldA - fieldB;
        }

        return sortOrder === 'desc' ? comparison * -1 : comparison;
    });
}
