export const quickSort = (array, key) => {
    if (array.length <= 1) {
      return array;
    }
  
    const pivot = array[array.length - 1];
    const left = [];
    const right = [];
  
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i][key].toLowerCase() < pivot[key].toLowerCase()) {
        left.push(array[i]);
      } else {
        right.push(array[i]);
      }
    }
  
    return [...quickSort(left, key), pivot, ...quickSort(right, key)];
  };






// // Sample participant class/structure
// // class Participant {
// //     constructor(name, id, role) {
// //         this.name = name;
// //         this.id = id;
// //         this.role = role;
// //     }
// // }

// // QuickSort implementation for participants
// export function quickSortParticipants(participants, left = 0, right = participants.length - 1) {
//     console.log('quick sort :',participants);
//     if (left < right) {
//         const pivotIndex = partition(participants, left, right);
//         quickSortParticipants(participants, left, pivotIndex - 1);
//         quickSortParticipants(participants, pivotIndex + 1, right);
//     }
//     return participants;
// }

// function partition(participants, left, right) {
//     const pivot = participants[right].name.toLowerCase();
//     let i = left - 1;

//     for (let j = left; j < right; j++) {
//         if (participants[j].name.toLowerCase() <= pivot) {
//             i++;
//             // Swap elements
//             [participants[i], participants[j]] = [participants[j], participants[i]];
//         }
//     }

//     // Place pivot in correct position
//     [participants[i + 1], participants[right]] = [participants[right], participants[i + 1]];
//     return i + 1;
// }

// // Example usage
// // const participants = [
// //     new Participant("John Doe", "123", "host"),
// //     new Participant("Alice Smith", "456", "participant"),
// //     new Participant("Bob Johnson", "789", "participant"),
// //     new Participant("Zara Williams", "101", "co-host"),
// //     new Participant("Charlie Brown", "112", "participant")
// // ];

// // Sort participants
// // console.log("Before sorting:");
// // console.log(participants.map(p => p.name));

// // const sortedParticipants = quickSortParticipants(participants);

// console.log("\nAfter sorting:");
// // console.log(sortedParticipants.map(p => p.name));

// // Utility function to get sorted participant list
// // function getSortedParticipantsList(participants) {
// //     return quickSortParticipants([...participants]); // Create a copy to avoid modifying original
// // }

// // Example with search functionality
// // function findParticipant(participants, name) {
// //     const sortedList = getSortedParticipantsList(participants);
// //     const targetName = name.toLowerCase();
    
// //     // Binary search since list is now sorted
// //     let left = 0;
// //     let right = sortedList.length - 1;

// //     while (left <= right) {
// //         const mid = Math.floor((left + right) / 2);
// //         const midName = sortedList[mid].name.toLowerCase();

// //         if (midName === targetName) {
// //             return sortedList[mid];
// //         } else if (midName < targetName) {
// //             left = mid + 1;
// //         } else {
// //             right = mid - 1;
// //         }
// //     }
// //     return null;
// // }