function Bunny(){
    this.energy = 1000;
    this.currXCoord = 15;
    this.currYCoord = 15;
    this.previousX = 15;
    this.previousY = 15;
    this.move = function(){
        // access the getRandomCoordinate
        // update the x and y coords
        // if food, then +10 energy(i.e use the eatPlant method)
        // update the energy, -1
        let randVar = Math.random();
        if(this.energy >= 1){
            if(randVar <= 0.25){
                // move on X axis
                if(this.currXCoord == 0){
                    this.previousX = this.currXCoord;
                    this.currXCoord = this.currXCoord + 1;
                } else if(this.currXCoord == 29){
                    this.previousX = this.currXCoord;
                    this.currXCoord = this.currXCoord - 1;
                } else{
                    let randomX = this.getRandomCoordinate(this.currXCoord-1, this.currXCoord+1, "x");
                    this.previousX = this.currXCoord;
                    this.currXCoord = randomX;
                }
            }else if(randVar <= 0.5 && randVar > 0.25){
                // move on Y axis
                if(this.currYCoord == 0){
                    this.previousY = this.currYCoord;
                    this.currYCoord = this.currYCoord + 1;
                } else if(this.currYCoord == 29){
                    this.previousY = this.currYCoord;
                    this.currYCoord = this.currYCoord - 1;
                }else{
                    let randomY = this.getRandomCoordinate(this.currYCoord-1, this.currYCoord+1, "y"); 
                    this.previousY = this.currYCoord;
                    this.currYCoord = randomY;
                }
                
            }else if(randVar > 0.5 && randVar <= 0.75){
                // upper right or left diagonals
                let randomXCoordsArray;
                if(this.currXCoord == 0){
                    this.previousX = this.currXCoord;
                    this.currXCoord = this.currXCoord + 1;
                    this.previousY = this.currYCoord;
                    this.currYCoord = this.currYCoord + 1;
                }
                else if(this.currYCoord >= 29){
                    this.previousY = this.currYCoord;
                    this.currYCoord = this.currYCoord - 1;
                }
                else if(this.currXCoord == 29){
                    this.previousX = this.currXCoord;
                    this.currXCoord = this.currXCoord - 1;
                } 
                else{
                    randomXCoordsArray = [this.currXCoord - 1, this.currXCoord + 1];
                    let chosenRandomXCoord = randomXCoordsArray[Math.floor(Math.random() * randomXCoordsArray.length)];
                    while(chosenRandomXCoord == this.previousX){
                        chosenRandomXCoord = randomXCoordsArray[Math.floor(Math.random() * randomXCoordsArray.length)];
                    }
                    this.previousX = this.currXCoord;
                    this.currXCoord = chosenRandomXCoord;
                    this.currYCoord = this.currYCoord + 1;
                }
            } 
            else{
                // lower right or left diagonals
                let randomXCoordsArray;
                if(this.currYCoord == 0){
                    this.previousX = this.currXCoord;
                    this.currXCoord = this.currXCoord + 1;
                    this.previousY = this.currYCoord;
                    this.currYCoord = this.currYCoord + 1;
                }
                else if(this.currYCoord >= 29){
                    this.previousY = this.currYCoord;
                    this.currYCoord = this.currYCoord - 1;
                } else if(this.currXCoord == 0 && this.currYCoord > 0){
                    this.previousX = this.currXCoord;
                    this.currXCoord = this.currXCoord + 1;
                    this.previousY = this.currYCoord;
                    this.currYCoord = this.currYCoord - 1;
                }
                else if(this.currXCoord >= 29){
                    this.previousX = this.currXCoord;
                    this.currXCoord = this.currXCoord - 1;
                } 
                else{
                    randomXCoordsArray = [this.currXCoord - 1, this.currXCoord + 1];
                    let chosenRandomXCoord = randomXCoordsArray[Math.floor(Math.random() * randomXCoordsArray.length)];
                    while(chosenRandomXCoord == this.previousX){
                        chosenRandomXCoord = randomXCoordsArray[Math.floor(Math.random() * randomXCoordsArray.length)];
                    }
                    this.previousX = this.currXCoord;
                    this.currXCoord = chosenRandomXCoord;
                    this.currYCoord = this.currYCoord - 1;
                }
                /*
                let randomXCoordsArray = [this.currXCoord - 1, this.currXCoord + 1];
                let chosenRandomXCoord = randomXCoordsArray[Math.floor(Math.random() * randomXCoordsArray.length)];
                while(chosenRandomXCoord == this.previousX){
                    chosenRandomXCoord = randomXCoordsArray[Math.floor(Math.random() * randomXCoordsArray.length)];
                }
                this.previousX = this.currXCoord;
                this.currXCoord = chosenRandomXCoord;
                this.previousY = this.currYCoord;
                this.currYCoord = this.currYCoord - 1; */
            }
            return [this.currXCoord, this.currYCoord];
        }else{
            return false;
        }
        
    };

    this.getBunnyEnergy = function(){
        return this.energy;
    };

    this.decreaseEnergyByOne = function(){
        this.energy -= 1;
    };

    this.eatPlant = function(){
        this.energy += 10;
    };
    
    // this is non-uniform random generation of number
    //Returns a random integer between min (inclusive) and max (inclusive).
    //The value is no lower than min (or the next integer greater than min
    // if min isn't an integer) and no greater than max (or the next integer
    // lower than max if max isn't an integer).
    this.getRandomCoordinate = function(min, max, axis) {
        // Think about this function, it should generate random number according to the coord system
        min = Math.ceil(min);
        max = Math.floor(max);
        let val = Math.floor(Math.random() * (max - min + 1)) + min;
        if(axis == 'x'){
            while(val == this.currXCoord){
                val = Math.floor(Math.random() * (max - min + 1)) + min;
            }
        } else if(axis == 'y'){
            while(val == this.currYCoord){
                val = Math.floor(Math.random() * (max - min + 1)) + min;
            } 
        }
        return val;
    };
}
/*
let b = new Bunny();
let res = b.getRandomCoordinate(28, 30, "x");
console.log(res); */