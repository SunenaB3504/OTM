function initCandyShare() {
    const totalCandies = 12;
    const friends = 3;
    const correctPerBowl = totalCandies / friends;
    const candiesContainer = document.getElementById('candies');
    const bowls = document.querySelectorAll('.bowl');
    const result = document.getElementById('candy-result');

    // Generate candies
    for (let i = 0; i < totalCandies; i++) {
        const candy = document.createElement('img');
        candy.src = 'assets/images/candy.png'; // Replace with actual candy image
        candy.draggable = true;
        candy.id = `candy-${i}`;
        candy.addEventListener('dragstart', (e) => e.dataTransfer.setData('text', e.target.id));
        candiesContainer.appendChild(candy);
    }

    // Drag and drop handlers
    bowls.forEach(bowl => {
        bowl.addEventListener('dragover', (e) => e.preventDefault());
        bowl.addEventListener('drop', (e) => {
            e.preventDefault();
            const candyId = e.dataTransfer.getData('text');
            const candy = document.getElementById(candyId);
            if (candy) e.target.appendChild(candy);
        });
    });

    // Check distribution
    document.getElementById('check-candy').addEventListener('click', () => {
        let correct = true;
        bowls.forEach(bowl => {
            const candiesInBowl = bowl.querySelectorAll('img').length;
            if (candiesInBowl !== correctPerBowl) correct = false;
        });
        if (correct) {
            points += 20; // Assuming 'points' is a global variable from the website
            result.textContent = 'Great job! You shared the candies equally!';
            result.style.color = 'green';
            checkBadge('Candy Sharer'); // Assuming 'checkBadge' is an existing function
            // Optional audio feedback: readText('Great job! You shared the candies equally!');
        } else {
            result.textContent = `Not quite! Each friend should have ${correctPerBowl} candies.`;
            result.style.color = 'red';
            // Optional audio feedback: readText('Not quite! Try again.');
        }
        updateProgress(); // Assuming 'updateProgress' is an existing function
    });
}

// Initialize when game is loaded
initCandyShare();