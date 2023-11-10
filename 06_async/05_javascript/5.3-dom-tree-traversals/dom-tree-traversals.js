function countLi() {
    
    const list = document.querySelectorAll('ul li');
  
    // Loop through each li element
    list.forEach((li) => {
      // Find all descendant li elements within this li
      const elements = li.querySelectorAll('li');
  
      // Check if there are any descendant li elements
      if (elements.length > 0) {
        // Create a Text node to hold the count in parentheses
        const count = document.createTextNode(` (${elements.length})`);
        
        // Append the Text node to the li element
        li.insertBefore(count, li.firstChild.nextSibling);
      }
    });
  }
  
  // Call the function to count and add descendant counts
  countLi();