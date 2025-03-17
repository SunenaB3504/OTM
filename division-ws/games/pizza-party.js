document.addEventListener('DOMContentLoaded', function() {
    // Make these values configurable for different problems
    let totalSlices = 10;
    let slicesPerPizza = 8;
    let selectedSlices = 0;
    let wholePizzasCreated = 0;

    const pizzaSlicesDiv = document.getElementById('pizza-slices');
    const wholePizzasDiv = document.getElementById('whole-pizzas');
    const pizzaQuestion = document.getElementById('pizza-question');
    const resetButton = document.getElementById('reset-pizza');
    const newProblemButton = document.getElementById('new-pizza-problem');
    
    // Show loading indicator initially
    pizzaSlicesDiv.innerHTML = '<div class="loading-indicator">Loading pizza slices...</div>';
    
    // Basic image paths to try - simplified
    const pizzaSliceImagePaths = [
        'assets/images/pizza-slice.png',
        '../assets/images/pizza-slice.png',
        '../../assets/images/pizza-slice.png'
    ];
    
    const wholePizzaImagePaths = [
        'assets/images/whole-pizza.png',
        '../assets/images/whole-pizza.png',
        '../../assets/images/whole-pizza.png'
    ];
    
    let workingSlicePath = null;
    let workingPizzaPath = null;
    
    // Find working image paths once on load
    function findWorkingImagePaths(callback) {
        testImagePath(pizzaSliceImagePaths, function(slicePath) {
            workingSlicePath = slicePath;
            testImagePath(wholePizzaImagePaths, function(pizzaPath) {
                workingPizzaPath = pizzaPath;
                callback();
            });
        });
    }
    
    // Find the first working image path
    function testImagePath(paths, callback) {
        let pathIndex = 0;
        
        function tryNextPath() {
            if (pathIndex >= paths.length) {
                // None of the paths worked, use fallback
                callback(null);
                return;
            }
            
            const img = new Image();
            img.onload = function() {
                // This path works
                callback(paths[pathIndex]);
            };
            
            img.onerror = function() {
                // Try next path
                pathIndex++;
                tryNextPath();
            };
            
            img.src = paths[pathIndex];
        }
        
        tryNextPath();
    }
    
    // Initialize the game with current problem values
    function initializeGame() {
        selectedSlices = 0;
        wholePizzasCreated = 0;
        
        // Clear containers
        pizzaSlicesDiv.innerHTML = '';
        wholePizzasDiv.innerHTML = '';
        document.getElementById('pizza-result').innerHTML = '';
        
        // Update the problem text
        pizzaQuestion.textContent = `If you have ${totalSlices} pizza slices and each whole pizza needs ${slicesPerPizza} slices, how many whole pizzas can you make? How many slices will be left over?`;
        
        // Reset the select values to default (NOT the correct answers)
        const wholePizzasSelect = document.getElementById('whole-pizzas-select');
        const remainingSlicesSelect = document.getElementById('remaining-slices-select');
        
        // Always set to default values instead of the correct answers
        wholePizzasSelect.selectedIndex = 0; // Set to first option (0)
        remainingSlicesSelect.selectedIndex = 0; // Set to first option (0)
        
        // Generate pizza slices
        for (let i = 0; i < totalSlices; i++) {
            if (workingSlicePath) {
                // Create image element
                const sliceImg = document.createElement('img');
                sliceImg.src = workingSlicePath;
                sliceImg.alt = 'Pizza Slice';
                sliceImg.className = 'pizza-slice';
                sliceImg.id = `slice-${i+1}`;
                
                // Add click handler
                sliceImg.addEventListener('click', handleSliceClick);
                pizzaSlicesDiv.appendChild(sliceImg);
            } else {
                // Use SVG fallback
                const fallbackSlice = document.getElementById('fallback-slice').cloneNode(true);
                fallbackSlice.id = `slice-${i+1}`;
                fallbackSlice.style.display = 'inline-block';
                fallbackSlice.addEventListener('click', handleSliceClick);
                pizzaSlicesDiv.appendChild(fallbackSlice);
            }
        }
    }
    
    // Helper function to set select value if option exists
    function setSelectValueIfExists(selectElement, value) {
        // Check if the option exists
        let optionExists = false;
        for(let i = 0; i < selectElement.options.length; i++) {
            if(selectElement.options[i].value == value) {
                optionExists = true;
                break;
            }
        }
        
        // Set the value if option exists, otherwise select first option
        if(optionExists) {
            selectElement.value = value;
        } else {
            selectElement.selectedIndex = 0;
        }
    }
    
    // Handle click on pizza slice
    function handleSliceClick() {
        selectedSlices++;
        this.style.display = 'none'; // Hide the selected slice
        
        if (selectedSlices === slicesPerPizza) {
            // Create a whole pizza
            wholePizzasCreated++;
            selectedSlices = 0;
            
            // Find working whole pizza image or use fallback
            testImagePath(wholePizzaImagePaths, function(workingPizzaPath) {
                if (workingPizzaPath) {
                    const pizzaImg = document.createElement('img');
                    pizzaImg.src = workingPizzaPath;
                    pizzaImg.alt = 'Whole Pizza';
                    pizzaImg.className = 'whole-pizza';
                    wholePizzasDiv.appendChild(pizzaImg);
                } else {
                    // Use SVG fallback
                    const fallbackPizza = document.getElementById('fallback-whole').cloneNode(true);
                    fallbackPizza.style.display = 'inline-block';
                    wholePizzasDiv.appendChild(fallbackPizza);
                }
            });
        }
    }
    
    // Check the child's answer
    function checkAnswer() {
        const wholePizzas = parseInt(document.getElementById('whole-pizzas-select').value, 10);
        const remainingSlices = parseInt(document.getElementById('remaining-slices-select').value, 10);

        const correctWholePizzas = Math.floor(totalSlices / slicesPerPizza); // 1
        const correctRemainingSlices = totalSlices % slicesPerPizza; // 2

        const resultElement = document.getElementById('pizza-result');
        
        if (wholePizzas === correctWholePizzas && remainingSlices === correctRemainingSlices) {
            resultElement.textContent = 'Great job! You got it right!';
            resultElement.style.color = '#4CAF50'; // Green for correct
            
            // Add division formula to help understanding
            const divisionFormula = document.createElement('div');
            divisionFormula.innerHTML = `
                <div style="margin-top: 10px; padding: 8px; background-color: #e8f5e9; border-radius: 6px; display: inline-block;">
                    <strong>Division Formula:</strong> ${totalSlices} ÷ ${slicesPerPizza} = ${correctWholePizzas} remainder ${correctRemainingSlices}
                    <br><span style="font-size: 0.9em; color: #388e3c;">Total slices ÷ Slices per pizza = Whole pizzas with remainder</span>
                </div>
            `;
            resultElement.appendChild(divisionFormula);
        } else {
            resultElement.textContent = `Not quite. You should have ${correctWholePizzas} whole pizza(s) and ${correctRemainingSlices} slice(s) left.`;
            resultElement.style.color = '#F44336'; // Red for incorrect
        }
    }
    
    // Generate a new random problem
    function generateNewProblem() {
        // Generate random slices per pizza between 2 and 8
        slicesPerPizza = Math.floor(Math.random() * 7) + 2; // 2-8
        
        // Generate total slices to make a problem with remainder
        // Making sure total is bigger than slicesPerPizza and reasonable size
        const maxSlices = slicesPerPizza * 3; // Generate problems with at most 3 whole pizzas
        totalSlices = slicesPerPizza + Math.floor(Math.random() * (maxSlices - slicesPerPizza));
        
        // Add some problems with no remainder
        if (Math.random() > 0.7) { // 30% chance of exact division
            totalSlices = slicesPerPizza * (Math.floor(Math.random() * 3) + 1); // 1-3 whole pizzas
        }
        
        // Make sure we don't get more than 5 remaining slices (for the select options)
        const remainder = totalSlices % slicesPerPizza;
        if (remainder > 5) {
            // Adjust total to have a smaller remainder
            totalSlices = totalSlices - remainder + Math.floor(Math.random() * 6); // 0-5 remainder
        }
        
        // Initialize the game with new values
        initializeGame();
    }
    
    // Reset button click handler
    resetButton.addEventListener('click', function() {
        initializeGame();
    });
    
    // New problem button click handler
    newProblemButton.addEventListener('click', function() {
        generateNewProblem();
    });
    
    // Initialize the game
    findWorkingImagePaths(function() {
        // Start with the initial problem
        initializeGame();
        
        // Add event listener for checking answers
        document.getElementById('check-pizza').addEventListener('click', checkAnswer);
    });
});