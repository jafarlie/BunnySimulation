var importedMeadow = document.createElement('script');
var importedBunny = document.createElement('script');
var importedPlant = document.createElement('script');
importedMeadow.src = 'meadow.js';
importedBunny.src = 'bunny.js';
importedPlant.src = 'plant.js';
document.head.appendChild(importedMeadow);
document.head.appendChild(importedBunny);
document.head.appendChild(importedPlant);

/* 
    Overall approach: run the simulation and to find the growth rate of plant I will manipulate the growthRate based
    on the success or failure of the simulation. For plant filling the meadow, setTimeout (maybe setInterval) seemed
    only options. However, I believe setTimeout/setInterval cause the problem in the overall logic. Reasons for this is 
    single threaded nature of JS and buggy use of binding inside the function parameter for the setTimeout.
    Overall the logic:
    1) GrowthRate is 1000, assume bunny survived. Check if the failureRate array is empty, if so: increase the growthRate by adding to it half of it.
    2) Growth Rate is 1500, assume bunny died. Check if passRate array is empty; it is not empty. Hence growthRate of plant is : 1500 - (1500-1000)*0.5
    Keep repeating until the gap is less than this.gap which is 0.5;
*/

class Simulation{

    constructor(){
        this.passRateArray = []; // this array will be used to manipulate the plantGrowthRate inside the Meadow grid; will hold the growth rates where bunny survived
        this.failureRateArray = []; // this array will be used to manipulate the plantGrowthRate inside the Meadow grid; will hold the growth rates where bunny did not survived
        this.timeToEnergyData = []; // this array will have objects inside it. An example of such object would be : {<time> : <bunnyEnergy>}, i.e. will hold such data: [{0: 1000, 1: 999, 2: 998, ....., 10000: 0}]
        this.rateToEnergyTimeData = {}; // Want to track all the data related to the growthRate
        this.timeCounter = 10000; // 1000 1sec = 1000 millisecond
        this.growthTimeRate = 1000; // 1 second = 1000 millisecond
        this.gap = 0.5; // used to control the limit between lastSurvival and failure, so that we can find the approximate minimal growth rate
        this.meadow = null;
        this.bunny = null;
    }
   
    /*
        Method that creates an object with the given parameters where the currTime will be 
        the key and bunnyenergy will be the value
    */
    timeToEnergyDataPopulator(currTime, bunnyenergy){
        var relation = {};
        relation[currTime] = bunnyenergy;
        this.timeToEnergyData.push(relation);
    }

    simulation(divisor){
        // Instantitate the Meadow to the this.meadow variable
        this.meadow = new Meadow();
        // Instantitate the Bunny to the this.bunny variable
        this.bunny = new Bunny();
        // get current time
        var i = 10000;

        // run the loop while i > 0
        while(i > 0){ 
            
            // bunny made a move. The result is either false (has no energy) or [x,y] coordinates
            let bunnyMove = this.bunny.move();  

            console.log("Inside simulation, bunny made move to coordinate: " + bunnyMove);

            // not enough energy, bunny did not survive
            if(bunnyMove === false){
                console.log("Bunny move is false, i.e no energy left");
                // record the data
                this.timeToEnergyDataPopulator(i, this.bunny.getBunnyEnergy());

                // get the rate by dividing growthTimeRate by 1000
                let rate = divisor;
                // since simulation will stop in few lines below, I want to track the whole timeToEnergyData data and assign it as a value to my key which will be current growthRate
                this.rateToEnergyTimeData[rate] = this.timeToEnergyData; //{rate : this.timeToEnergyData};
                // add the failure rate to the failureRateArray
                this.failureRateArray.push(divisor);
                console.log("Bunny has no energy left, its energy is: " + this.bunny.getBunnyEnergy());
                return false;
                // stop the simulation
            }
            // store the value of checkValidBunnyMove
            let validMoveResult = this.meadow.checkValidBunnyMove(bunnyMove);
            // while the move is not valid, generate new bunnyMove coordinate and check again if the move is valid
            while(validMoveResult === false){
                // it actually gets stuck over here, bug!
                console.log("stuck?");
                bunnyMove = this.bunny.move();
                validMoveResult = this.meadow.checkValidBunnyMove(bunnyMove);
            }
            // check if the bunny has to eat at the coordiante it moved to
            if(this.meadow.checkIfBunnyEats(bunnyMove) === true){
                
                // since bunny made still a move, -1 energy
                this.bunny.decreaseEnergyByOne();
                // and since the meadow at that coordinate had food, we add +10 to energy via eatPlant method
                this.bunny.energy += 10;
                console.log("bunny eats, has energy: " + this.bunny.energy);
            }else{
                // no food, -1 energy
                console.log("Bunny did not eat, no food, has energy: " + this.bunny.energy);
                this.bunny.decreaseEnergyByOne();        
            }
            // console.log("Bunny has energy: " + this.bunny.getBunnyEnergy()); 
            let bunEnergy = this.bunny.getBunnyEnergy();
            // populate the timeToEnergy array
            this.timeToEnergyDataPopulator(i, bunEnergy);
            
            if(i % divisor == 0){
                console.log("Plant is grown, i= " + i);
                this.meadow.growAPlant();
            }
            i -= 1;
            if(i == 1){
                console.log("Prelast run");
                // since simulation will stop in few lines below, I want to track the whole timeToEnergyData data and assign it as a value to my key which will be current growthRate
                this.rateToEnergyTimeData[divisor] = this.timeToEnergyData; //{rate : this.timeToEnergyData};
                if(this.bunny.energy > 0){
                    return true;
                }else{
                    return false;
                }
            }
        }
        
    }
}

// Setup for the simulation
let simulation = new Simulation();
// 1, 2, 4, 5, 8, 10,16, 20, 25, 40, 50, 80, 100, 125, 200, 250, 400,500, 500, 625, 1000, 1250
let divisors = [1, 2, 4, 5, 8, 10,16, 20, 25, 40, 50, 80, 100, 125, 200, 250, 400,500, 500, 625, 1000, 1250];
let ratesThatPasses = [];
let dataRelatedToRate = [];
let res;
// Our goal is to minimize the gap between lastSurvival rate and lastFailure rate until it is smaller than simulation.gap

for(let x=0; x < divisors.length; x++){
    console.log("Working with divisor: " + divisors[x]);
    res = simulation.simulation(divisors[x]);
    if(res === false){
        break;
    }else{
        ratesThatPasses.push(divisors[x]);
    }  
}
dataRelatedToRate.push(simulation.rateToEnergyTimeData);

let minimumApproximateGenerationRate = ratesThatPasses[ratesThatPasses.length - 1];
let f = dataRelatedToRate[0];

let dataToAnalyse = f[minimumApproximateGenerationRate];
console.log(dataToAnalyse);
console.log("The minimum plant regeneration rate required to sustain the bunny for 10000 units of time is " + 
    minimumApproximateGenerationRate + " regenerations/unit time");

// plotting the last round of the simulation data where the minimum growth value was found.
// plotting works as intended, check graphing.js for example. Inside the index.html uncomment the script where graphing.js is loading and you will see the graph
var ctx = document.getElementById('myChart').getContext('2d');
var keyValues = dataToAnalyse.map(elem => Object.keys(elem)[0]);
var dataValues = dataToAnalyse.map(elem => Object.values(elem)[0]);
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: keyValues,
        datasets: [{
            label: 'Bunny simulation infographics',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: dataValues,
            fill: false,
        }]
    },

    // Configuration options go here
    options: {}
});




